

export const mkLabel = (o) => {
  switch(typeof o){
    case "object": 
      if(Array.isArray(o)){
        return "=>" + mkLabel(o[0]);
      } else {
        const res = mkLabel(o[Object.keys(o)[0]]);
        if(res === "") {
          return Object.keys(o)[0];
        } else if (Array.isArray(o[Object.keys(o)[0]])) {
          return Object.keys(o)[0] + res;
        } else {
          return Object.keys(o)[0] + "->" + res;
        }
      }
    default:
      return ""
  }
}


// generates an exists query every time it encounters an array
export const mkAttrQuery = (attr, attr_acc, op, val) => {
  switch(typeof attr){
    case "object": 
      if(Array.isArray(attr)){
        return {
          operator:"exists",
          from:attr_acc("array"),
          children: [mkAttrQuery(attr[0], (x) => x, op, val)]
        }
      } else {
        const k = Object.keys(attr)[0];
        return mkAttrQuery(attr[Object.keys(attr)[0]], (v) => attr_acc({[k] : v}), op, val)
      }
    default:
      return {
        attribute: attr_acc(attr),
        operator:op,
        value: val
      }
  }
}



// generates an exists query every time it encounters an array
export const mkAttrQuerySet = (attr, attr_acc) => {
  switch(typeof attr){
    case "object": 
      if(Array.isArray(attr)){
        const [r_set, r_q] = mkAttrQuerySet(attr[0], (x) => x);
        if(r_set === null) return [attr_acc("array"), r_q]
        else return [r_set, {operator:"set", from:r_set, path:r_q}]
      } else {
        const k = Object.keys(attr)[0];
        return mkAttrQuerySet(attr[Object.keys(attr)[0]], (v) => attr_acc({[k] : v}))
      }
    default:
      return [null, attr_acc(attr)]
  }
}



export const mergeExists = (o) => {
  // console.log("got:", o)
  switch(o.operator){
    case "exists": 
      var o_new = {...o}
      if('children' in o) o_new.children = o_new.children.map(mergeExists)
      return o_new
    case "similarity": 
      return o
    case "and":
      var o_new = {...o}
      if('children' in o && !o.dontGroupExists) o_new.children = mergeExistsInAnd(o_new.children.map(mergeExists))
      else {
        o_new.children = o_new.children.map(mergeExists)
        delete o_new.dontGroupExists
      }
      if (o_new.children.length === 1) return o_new.children[0];
      return o_new
    case "or":
      var o_new = {...o}
      if('children' in o) o_new.children = o_new.children.map(mergeExists)
      if (o_new.children.length === 1) return o_new.children[0];
      return o_new
    default:
      return o
  }
}


export const mergeExistsInAnd = (lst) => {

  const merged_exists = {
    operator: "exists",
    children: [{operator:"and", children: []}]
  }

  const new_lst = []

  // select an exists stmt from the lst
  for (var i = 0; i < lst.length; i++) {
    if(lst[i].operator === "exists"){
      if(!('from' in merged_exists)){
        merged_exists.from = lst[i].from
      }
    }
  }

  if(!('from' in merged_exists)) return lst;

  // // console.log('got here')

  for (var i = 0; i < lst.length; i++) {
    if( lst[i].operator === "exists" && 
        JSON.stringify(merged_exists.from) === JSON.stringify(lst[i].from)
      ){
      merged_exists.children[0].children.push(...lst[i].children)
    } else {
      new_lst.push(lst[i])
    }
  }

  const rest = mergeExistsInAnd(new_lst)

  if(merged_exists.children[0].children.length == 1) 
    merged_exists.children = merged_exists.children[0].children
  rest.push(merged_exists)

  return rest
}





export const removeEmpty = (o) => {
  if (o.operator === "and" || o.operator === "or" || o.operator === "exists") {
    console.log("o:", o)
    var new_children = []
    for (var i = 0; i < o.children.length; i++) {
      if ("attribute" in o.children[i] && o.children[i].value && o.children[i].value !== '') new_children.push(o.children[i])
      else if (!("attribute" in o.children[i])) {
        const res = removeEmpty(o.children[i]);
        if(res.children && res.children.length > 0 || res.operator === "similarity") new_children.push(res)
      }
    }
    return {...o, children: new_children}
  } else {
    return {...o}
  }
}


export const humanReadableQuery = (q) => {
  switch (q.operator) {
    case "and": return "(" + q.children.map(humanReadableQuery).join(" ∧\n ") + ")"
    case "or": return  "(" +  q.children.map(humanReadableQuery).join(" ∨\n ") + ")"
    case "exists": return "(∃ x ∈ " + mkLabel(q.from) + " . " + q.children.map((x) => {return humanReadableQuery(insertAttr(x))}).join("") + ")"
    case "similarity": return "(|" + humanReadableQuery(q.from) + " ⋂ sim({" + q.hpos.join(",") + "}, "+ q.similarity +")| ≥ " + q.match + ")"
    case "set": return "{ x" + (mkLabel(q.path) ? "->" : "") + mkLabel(q.path) + (q.from ? " | x ∈ " + mkLabel(q.from) +"}" : "}")
    case "is": return "(" + mkLabel(q.attribute) + " = " + (q.value === "" ? '_' : JSON.stringify(q.value)) + ")"
    case "is not": return "(" + mkLabel(q.attribute) + " ≠ " + (q.value === "" ? '_' : JSON.stringify(q.value)) + ")"
    case "<": return "(" + mkLabel(q.attribute) + " < " + (q.value === "" ? '_' : JSON.stringify(q.value)) + ")"
    case "<=": return "(" + mkLabel(q.attribute) + " ≤ " + (q.value === "" ? '_' : JSON.stringify(q.value)) + ")"
    case ">": return "(" + mkLabel(q.attribute) + " > " + (q.value === "" ? '_' : JSON.stringify(q.value)) + ")"
    case ">=": return "(" + mkLabel(q.attribute) + " ≥ " + (q.value === "" ? '_' : JSON.stringify(q.value)) + ")"
  }
}


export const generateFinalQuery = (q) => {
  return removeEmpty(mergeExists({operator:'and', children: q}))
}

export const removeQueryBuildersFromTree = (t) => {
  var deleted_items = [];
  var keys = Object.keys(t.items);
  for (var i = 0; i < keys.length; i++) {
    if (t.items[keys[i]].type === "QueryTree"){
      delete t.items[keys[i]]
      deleted_items.push(keys[i])
    }
  }
  console.log("deleting: ", deleted_items);
  deleted_items = new Set(deleted_items);
  keys = Object.keys(t.items);
  for (var i = 0; i < keys.length; i++) {
    t.items[keys[i]].children = t.items[keys[i]].children.filter((k) => !deleted_items.has(k))
  }
  return t
}


export const collectQueries = (t, e, q) => 
  t.items[e].children.map((i) => {
    if(t.items[i].children.length > 0){
      const childrenQs = collectQueries(t, i, q);
      const q_new = {...q[i]};
      q_new.children = childrenQs;
      return q_new;
    }
    return q[i]
  })






export const mkQueryBuilders = (t) => {
  const keys = [...Object.keys(t.items)].filter((k) => k !== "root");
  return keys.map((k) => {return {...t.items[k].data, type: t.items[k].type}})
}


const insertAttr = (q) => {
  switch (q.operator) {
    case "and":
    case "or":
    case "exists":
      var new_q = {...q}
      new_q.children = new_q.children.map(insertAttr)
      return new_q
    default:
      var new_q = {...q}
      new_q.attribute = {'x' : new_q.attribute}
      return new_q
  }
}


export const getType = (o) => {
  switch(typeof o){
    case "object": 
      if(Array.isArray(o)){
        return getType(o[0])
      } else {
        return getType(o[Object.keys(o)[0]])
      }
    default:
      return o
  }
}


export const getValueFromPath = (o, path) => {
  switch(typeof path){
    case "object": 
      if(Array.isArray(path)){
        return o.map((e) => getValueFromPath(e, path[0])).flat();
      } else {
        // console.log("got here:", path, Object.keys(path)[0], Object.keys(path)[0] in o)
        return Object.keys(path)[0] in o ? getValueFromPath(o[Object.keys(path)[0]], path[Object.keys(path)[0]]) : [];
      }
    default:
      return [o]
  }
}


export const cast = (o,t) => {
  switch(t){
    case "int": return parseInt(o)
    default: return o
  }
}

export const label_position = [
  {label:'Top', value:'top'},
  {label:'Left', value:'left'}
]