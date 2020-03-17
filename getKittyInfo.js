const axios = require('axios');
var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

const PROJECT_ID = require('./secrets.js').PROJECT_ID;
const endpoint = `https://mainnet.infura.io/v3/${PROJECT_ID}`;
const contract = '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d'; // address for cryptokitties

const helpers = require('./helpers.js');

const getKittyInfo = (id) => {
  let topicObjGetKitty = helpers.findTopicByName('getKitty')
  let topicHexGetKitty = web3.eth.abi.encodeFunctionCall(topicObjGetKitty, [id])

  return axios({
    method: 'post',
    url: endpoint,
    data: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_call',
      params: [{
        to: contract,
        data: topicHexGetKitty,
      }, 'latest'],
      id: 1
    }),
    headers: {
      'Content-Type': 'application/json',
    }
  }).then((response) => {
    let outputs = helpers.findTopicByName('getKitty').outputs
    let data = web3.eth.abi.decodeParameters(outputs, response.data.result);
    let result = {
      birthTime: data.birthTime,
      generation: data.generation,
      genes: data.genes
    }
    return result;
  }).catch((error) => {
    console.log('error', error);
  })
}

module.exports = {
  getKittyInfo
}
