const axios = require('axios');

var Web3 = require('web3');
// "Web3.providers.givenProvider" will be set if in an Ethereum supported browser.
var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

const PROJECT_ID = require('./secrets.js').PROJECT_ID;
const topicInfo = require('./findTopicByName.js');
const endpoint = `https://mainnet.infura.io/v3/${PROJECT_ID}`;
const contract = '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d'; // address for cryptokitties

const getLogs = (topic, startBlock, endBlock, countsOfBirthsByMatron) => {
  axios({
    method: 'post',
    url: endpoint,
    data: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getLogs',
      params: [{
        address: contract,
        topics: [topic],
        fromBlock: startBlock,
        toBlock: endBlock
      }],
      id: 1
    }),
    headers: {
      'Content-Type': 'application/json',
    }
  }).then((response) => {
    let results = response.data.result;
    countBirthsFromLog(results, [topic], countsOfBirthsByMatron)
  }).catch((error) => {
    console.log('error', error);
    getLogs(topic, startBlock, startBlock + (endBlock - startBlock) / 2, countsOfBirthsByMatron)
    getLogs(topic, 1 + startBlock + (endBlock - startBlock) / 2, endBlock, countsOfBirthsByMatron)
  })
}

const countBirthsFromLog = (results, topics, countsOfBirthsByMatron) => {
  if (results === undefined) {
    console.log('No births here')
    return
  }
  results.forEach((block) => {
    birthResults.totalBirths++
    let matron = web3.eth.abi.decodeLog(topicInfo.topicInputs, block.data, [topicInfo.topicHex]).matronId
    if (matron === '0') { // gen0 kitties have no matron
      return
    } else if (countsOfBirthsByMatron[matron] === undefined) {
      countsOfBirthsByMatron[matron] = 1
    } else {
      countsOfBirthsByMatron[matron]++
    }
    if (countsOfBirthsByMatron[matron] > birthResults.maxBirths) {
      birthResults.maxBirths = countsOfBirthsByMatron[matron]
      birthResults.maxMatronId = matron
    }
  })
  console.log('Current maxBirth', birthResults)
}


let countsOfBirthsByMatron = {}
let birthResults = {
  maxMatronId: null,
  maxBirths: 0,
  totalBirths: 0
}

const start = 6607985;
const end = 7028323;
const interval = 100;


const turnIntToHex = (integer) => {
  return `0x${integer.toString(16)}`
}

const callGetLogs = async () => {
  for (let i = start; i <= end; i += interval) {
    await getLogs(topicInfo.topicHex, turnIntToHex(i), turnIntToHex(i + interval - 1), countsOfBirthsByMatron)
  }
  return birthResults;
}
callGetLogs().then((result) => { console.log(result) })
