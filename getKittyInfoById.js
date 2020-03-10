const axios = require('axios');
const API_TOKEN = require('./secrets.js').CK_API_TOKEN

const getKittyInfo = (id) => {
  axios({
    method: 'get',
    url: `https://public.api.cryptokitties.co/v1/kitties/${id}`,
    headers: {
      'x-api-token': API_TOKEN,
    }
  }).then((response) => {
    console.log(response)
    let result = {
      birthTimestamp: response.data.created_at,
      generation: response.data.generation,
      genes: null
    }
    console.log(result)
    return result

  }).catch((error) => {
    console.log(error)
  })
}
console.log(getKittyInfo(20))
