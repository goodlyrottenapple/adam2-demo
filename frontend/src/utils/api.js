import * as localForage from "localforage";

export const getOntology = (url) => localForage.getItem(url).then(res => {
  if(res) return res;
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
      body: JSON.stringify({'url': url})
    }
  )
  .then(res => res.json())
  .then(res => {
    localForage.setItem(url, res)
    return res
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