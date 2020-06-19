
export const getAttributes = (id, callback, callback_err) => fetch(
  process.env.REACT_APP_API_URL+"/discover/getAttributes/"+id, {
  headers: {
    "Access-Control-Allow-Origin": "*",
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
  })
  .then(res => res.json())
  .then(callback, callback_err);

export const getAttributeValues = (id, attribute, callback, callback_err) => fetch(
  process.env.REACT_APP_API_URL+"/discover/getAttributeValues/"+id, {
    method:'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify({'attribute': attribute})
  })
  .then(res => res.json())
  .then(callback, callback_err);



export const getAttributeValuesLimitOffset = (id, attribute, limit, offset, callback, callback_err) => fetch(
  process.env.REACT_APP_API_URL+"/discover/getAttributeValuesLimit/"+id, {
    method:'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify({'attribute': attribute, 'limit': limit})
  })
  .then(res => res.json())
  .then(callback, callback_err);


export const getUserIsAdminOf = (id, callback, callback_err) => fetch(
  process.env.REACT_APP_API_URL+"/discover/userIsAdminOf/"+id, {
  headers: {
    "Access-Control-Allow-Origin": "*",
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
  })
  .then(res => res.json())
  .then(callback, callback_err);
