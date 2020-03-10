var Web3 = require('web3');

// "Web3.providers.givenProvider" will be set if in an Ethereum supported browser.
var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

const axios = require('axios');
const PROJECT_ID = require('./secrets.js');

const endpoint = `https://mainnet.infura.io/v3/${PROJECT_ID}`;

const startingBlock = 6607985;
const startingBlockHex = `0x${startingBlock.toString(16)}`;
//const endingBlock = 7028323;
const endingBlock = 6607986;
const endingBlockHex = `0x${endingBlock.toString(16)}`;

// const data = JSON.stringify({
//   jsonrpc: '2.0',
//   method: 'eth_getBlockByNumber',
//   params: [startingBlockHex,true],
//   id: 1
// })

const data = JSON.stringify({
  jsonrpc: '2.0',
  method: 'eth_getLogs',
  params: [{
    address:'0x06012c8cf97BEaD5deAe237070F9587f8E7A266d', // address for cryptokitties
    topics: [
    ], // 0x88c2a0bf is giveBirth
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
  //console.log(response.data.result);
  let topic1 = response.data.result[0].topics[0]
  let decoded = web3.eth.abi.decodeParameters(['uint256'], topic1)
  console.log(decoded)
})
.catch((error) => {
  console.log(error);
});

//console.log(web3.eth.abi.decodeParameters(['string', 'uint256'], '0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000ea000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000'));
//> Result { '0': 'Hello!%!', '1': '234' }