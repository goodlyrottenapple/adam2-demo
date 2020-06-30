import rdflib, json, hashlib
from fastapi import Depends, FastAPI
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from rdflib.namespace import RDFS
from os import path
from os import listdir
from os.path import isfile, join
import re
import unidecode

def slugify(text):
    text = unidecode.unidecode(text).lower()
    return re.sub(r'[\W_]+', '-', text)

class Query(BaseModel):
  url: str
  collapseTree: Optional[bool]


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

def firstChildrenWithLabel(g, k):
  if g[k]['label']: return [k]
  else:
    res = []
    for c in g[k]['children']:
      res = res + firstChildrenWithLabel(g, c)

    return res


def subClassOfTrans(g, a, b):
  if b in g[a]: return True
  for k in g[a]:
    if subClassOfTrans(g,k,b): return True

  return False


@app.post("/loadOntologies")
async def loadOntologies():
    '''
    Fetch local .json ontology files from disk to preload dropdown options
    '''
    file_names = [f for f in listdir('.') if isfile(join('.', f))]
    res = []
    for file_name in file_names:
        if '.json' in file_name:
            with open(file_name) as file:
                res.append({
                    'name': file_name,
                    'content': json.loads(file.read())
                })
    return res

@app.post("/getOntology")
async def getOntology(payload:Query):
  '''
  Fetch new ontology
  '''
  # m = hashlib.md5()
  # m.update(payload.url.encode('utf-8'))
  # h_url = "cache/" + str(m.hexdigest())+".json"
  # h_url = str(m.hexdigest())+".json"
  if payload.collapseTree:
    h_url = slugify(payload.url)+'-collapsed.json'
  else:
    h_url = slugify(payload.url)+'.json'

  if path.exists(h_url):
    with open(h_url) as file:
      return json.loads(file.read())
  else:
    g = rdflib.Graph()
    g.load(payload.url)
    
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
      return res

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
          if subClassOfTrans(subcls_inv, x, y): notSubClassOfAny = False
        if notSubClassOfAny: allTopLevelWithLabelsFiltered.append(x)
      # print([subcls[x]['label'] for x in allTopLevelWithLabelsFiltered])
      res = [recAddChildren(subcls, set(), k, subcls[k]) for k in allTopLevelWithLabelsFiltered]

      with open(h_url, 'w') as outfile:
        json.dump(res, outfile)

      return res
