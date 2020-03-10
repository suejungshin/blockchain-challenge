const axios = require('axios');
const PROJECT_ID = require('./secrets.js');
var Web3 = require('web3');
// "Web3.providers.givenProvider" will be set if in an Ethereum supported browser.
var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

const endpoint = `https://mainnet.infura.io/v3/${PROJECT_ID}`;

const startingBlock = 6607985;
const startingBlockHex = `0x${startingBlock.toString(16)}`;
//const endingBlock = 7028323;
const endingBlock = 6607990
const endingBlockHex = `0x${endingBlock.toString(16)}`;

const birthEventInputs = [
  {
    "indexed": false,
    "name": "owner",
    "type": "address"
  },
  {
    "indexed": false,
    "name": "kittyId",
    "type": "uint256"
  },
  {
    "indexed": false,
    "name": "matronId",
    "type": "uint256"
  },
  {
    "indexed": false,
    "name": "sireId",
    "type": "uint256"
  },
  {
    "indexed": false,
    "name": "genes",
    "type": "uint256"
  }
]

const birthEventTopic = web3.eth.abi.encodeEventSignature({
  "anonymous": false,
  "inputs": birthEventInputs,
  "name": "Birth",
  "type": "event"
});

const data = JSON.stringify({
  jsonrpc: '2.0',
  method: 'eth_getLogs',
  params: [{
    address:'0x06012c8cf97BEaD5deAe237070F9587f8E7A266d', // address for cryptokitties
    topics: [birthEventTopic],
    fromBlock: startingBlockHex,
    toBlock: endingBlockHex
  }],
  id: 1
})

axios({
  method: 'post',
  url: endpoint,
  data: data,
  headers: {
    'Content-Type': 'application/json',
  }
}).then((response) => {
 // console.log(response.data.result);
   let topics = [birthEventTopic]
   console.log(web3.eth.abi.decodeLog(birthEventInputs, response.data.result[0].data, topics));

})
.catch((error) => {
  console.log(error);
});