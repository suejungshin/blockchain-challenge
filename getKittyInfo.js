const axios = require('axios');

var Web3 = require('web3');
// "Web3.providers.givenProvider" will be set if in an Ethereum supported browser.
var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

const PROJECT_ID = require('./secrets.js').PROJECT_ID;
const topicInfo = require('./findTopicByName.js');
const endpoint = `https://mainnet.infura.io/v3/${PROJECT_ID}`;
const contract = '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d'; // address for cryptokitties

const getKittyInfo = () => {
  axios({
    method: 'post',
    url: endpoint,
    data: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_call',
      params: [{
        to: contract,
        data: topicInfo.topicHexGetKitty,
      }, 'latest'],
      id: 1
    }),
    headers: {
      'Content-Type': 'application/json',
    }
  }).then((response) => {
    console.log(response)
    let result = web3.eth.abi.decodeParameters([
      {
        "name": "isGestating",
        "type": "bool"
      },
      {
        "name": "isReady",
        "type": "bool"
      },
      {
        "name": "cooldownIndex",
        "type": "uint256"
      },
      {
        "name": "nextActionAt",
        "type": "uint256"
      },
      {
        "name": "siringWithId",
        "type": "uint256"
      },
      {
        "name": "birthTime",
        "type": "uint256"
      },
      {
        "name": "matronId",
        "type": "uint256"
      },
      {
        "name": "sireId",
        "type": "uint256"
      },
      {
        "name": "generation",
        "type": "uint256"
      },
      {
        "name": "genes",
        "type": "uint256"
      }
    ], response.data.result);
    console.log(result)

  }).catch((error) => {
    console.log('error', error);
  })
}

console.log(getKittyInfo())