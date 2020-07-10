import * as localForage from "localforage";

export const getOntology = (url, collapseTree = false) => localForage.getItem(url + (collapseTree ? "-collapsed" : "")).then(res => {
  if(res) return {json : res, status:200};
  else return fetch(
    process.env.REACT_APP_API_URL+"/getOntology",
    {
      method:'POST',
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({'url': url, collapseTree:collapseTree})
    }
  )
  // .then(res => res.json())
  .then((response) => {
    return new Promise((resolve) => response.json()
      .then((json) => resolve({
        status: response.status,
        json,
      })));
  }).then(({ status, json, ok }) => {
    switch (status) {
      case 200:
        localForage.setItem(url + (collapseTree ? "-collapsed" : ""), res)
      default:
        return { status, json, ok };
    }
  });
});


export const getAvailableOntologies = () => localForage.getItem('adam2-demo-ontologies').then(res => {
  if(res) return res;
  else return fetch(
    process.env.REACT_APP_API_URL+"/getAvailableOntologies",
    {
      method:'GET',
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }
  )
  .then(res => res.json())
  .then(res => {
    localForage.setItem("adam2-demo-ontologies", res)
    return res
  });
});