import rdflib, json, hashlib
from fastapi import Depends, FastAPI
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from rdflib.namespace import RDFS
from owlready2 import *
from os import path
from os import listdir
from os.path import isfile, join
import re
import unidecode
import urllib.request
import asyncio
from hashlib import sha1

def slugify(text):
    text = unidecode.unidecode(text).lower()
    return re.sub(r'[\W_]+', '-', text)

class Query(BaseModel):
  url: str
  collapseTree: Optional[bool]


class OntologyTooLargeError(Exception):
    """Raised when the ontology size exceeds 30mb"""
    pass

app = FastAPI(docs_url="/docs", redoc_url="/redoc")

origins = [
  "http://localhost",
  "http://localhost:3002"
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)


def recAddChildren(g, visited, k, v):
  if k in visited: return v
  # print("children of {}: {}".format(k, v['children']))
  visited_new = visited.copy()
  visited_new.add(k)
  v_new = {'value': k, 'label': v['label']}
  if v['children']:
    v_new['children'] = [recAddChildren(g, visited_new, k_child, g[k_child]) for k_child in v['children']]
  return v_new

def firstChildrenWithLabel(g, k, visited = {}):
  if g[k]['label']: return [k]
  else:
    res = []
    visited[k] = visited[k] + 1 if k in visited else 1
    for c in g[k]['children']:
      # bit of a nasty workaround ... this is to avoid an infinite loop but at the same time
      # allow several branches which might potentially have the same child to be explored
      # the 20 hits limit is arbitrary
      if c not in visited or visited[c] < 20:
        res = res + firstChildrenWithLabel(g, c, visited)

    return res


def subClassOfTrans(g, a, b):
  if b in g[a]: return True
  for k in g[a]:
    if subClassOfTrans(g,k,b): return True

  return False



@app.get("/getAvailableOntologies")
async def getAvailableOntologies():
  with open("ebi_ontologies.json") as file:
    return json.loads(file.read())


@app.get("/cacheAvailableOntologies")
async def cacheAvailableOntologies():
  with open("ebi_ontologies.json", "r+") as file:
    ebi_ontologies = json.loads(file.read())

    for o in ebi_ontologies:
      try:
        checksum, _ = await getOntologyInternal(Query(url = o['url']+"/download"), o['checksum'] if 'checksum' in o else None)
        print(o['abbrev']+ " ok")
        o['status'] = "ok"
        if checksum is not None: o['checksum'] = checksum
      except OntologyTooLargeError:
        print(o['abbrev']+ " too large")
        o['status'] = "too large"
      except Exception as e:
        print(o['abbrev']+ " faled with: ", e)
        o['status'] = "parsing error"
    
    file.seek(0)
    file.write(json.dumps(ebi_ontologies, indent = 2))
    file.truncate()  


async def getOntologyInternal(payload:Query, checksumCurrent = None):
  '''
  Fetch new ontology
  '''

  if payload.collapseTree:
    cached_path = "ontologies/"+slugify(payload.url)+'-collapsed.json'
  else:
    cached_path = "ontologies/"+slugify(payload.url)+'.json'

  if path.exists(cached_path) and checksumCurrent is None:
    with open(cached_path) as file:
      return None, json.loads(file.read())
  else:
    checksumNew = ""
    with urllib.request.urlopen(payload.url) as url:
      meta = url.info()
      if int(meta["Content-length"]) > 31457280:
        raise OntologyTooLargeError

      print("calculate checksum...")
      checksum = hashlib.sha1()
      downloaded = url.read()
      checksum.update(downloaded)
      checksumNew = checksum.hexdigest()
      # if path.exists(cached_path):
      if checksumCurrent is not None and path.exists(cached_path) and checksumCurrent == checksumNew :
        with open(cached_path) as file:
          return None, json.loads(file.read())
      if checksumCurrent is not None and checksumCurrent != checksumNew :
        print("ontology changed, re-parsing...")


    # there are two potential parsers. if the first one from rdflib fails
    # we try the owlready2 one. not sure whether there is ever a case where
    # the first one fails and second succeeds tho
    try:
      g = rdflib.Graph()
      g.load(payload.url)
    except:
      onto = get_ontology(payload.url)
      onto.load()
      g = default_world.as_rdflib_graph()

    if payload.collapseTree:
      res = {}
      for s, _, o in g.triples((None, RDFS.subClassOf, None)):
        s_str = str(s)
        o_str = str(o)

        if s_str not in res:
          r = g.preferredLabel(s)
          if len(r) > 0:
            _,l = r[0]
            res[s_str] = l
        if o_str not in res:
          r = g.preferredLabel(o)
          if len(r) > 0:
            _,l = r[0]
            res[o_str] = l
      return None,res

    else:
      subcls = {}
      notTopLevel = set()

      subcls_inv = {}

      for s, _, o in g.triples((None, RDFS.subClassOf, None)):
        s_str = str(s)
        o_str = str(o)

        if o_str in subcls:
          subcls[o_str]['children'] = subcls[o_str]['children'] + [s_str]
        else:
          r = g.preferredLabel(o)
          l = ''
          if len(r) > 0:
            _,l = r[0]
          subcls[o_str] = {'label': str(l), 'children':[s_str]}

        if s_str not in subcls:
          r = g.preferredLabel(s)
          l = ''
          if len(r) > 0:
            _,l = r[0]
          subcls[s_str] = {'label': str(l), 'children':[]}

        notTopLevel.add(s_str)

        if s_str not in subcls_inv:
          subcls_inv[s_str] = {o_str}
        else:
          subcls_inv[s_str].add(o_str)

        if o_str not in subcls_inv:
          subcls_inv[o_str] = set()

      allTopLevelWithLabels = [x for (k,v) in subcls.items() for x in firstChildrenWithLabel(subcls, k) if k not in notTopLevel]
      allTopLevelWithLabelsFiltered = []

      for x in allTopLevelWithLabels:
        notSubClassOfAny = True
        for y in allTopLevelWithLabels:
          if subClassOfTrans(subcls_inv, x, y): 
            notSubClassOfAny = False
            break
        if notSubClassOfAny: allTopLevelWithLabelsFiltered.append(x)

      res = [recAddChildren(subcls, set(), k, subcls[k]) for k in allTopLevelWithLabelsFiltered]

      with open(cached_path, 'w') as outfile:
        json.dump(res, outfile)

      return checksumNew, res

@app.post("/getOntology")
async def getOntology(payload:Query):
  '''
  Fetch new ontology
  '''
  _, res = await getOntologyInternal(payload)
  return res
