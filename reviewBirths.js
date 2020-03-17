const axios = require('axios');
var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

const PROJECT_ID = require('./secrets.js').PROJECT_ID;
const endpoint = `https://mainnet.infura.io/v3/${PROJECT_ID}`;
const contract = '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d'; // address for cryptokitties

const helpers = require('./helpers.js');

const reviewBirths = async (start, end) => {
  let countsOfBirthsByMatron = {};
  let birthResults = {
    maxMatronId: null,
    maxBirths: 0,
    totalBirths: 0
  };
  let interval = 10000;
  for (let i = start; i <= end; i += interval) {
    let topicObj = helpers.findTopicByName('Birth');
    let topicHex = web3.eth.abi.encodeEventSignature(topicObj);

    await getLogs(topicHex, helpers.turnIntToHex(i), helpers.turnIntToHex(i + interval - 1), countsOfBirthsByMatron, birthResults);
  }
  return birthResults;
}

const getLogs = (topic, startBlock, endBlock, countsOfBirthsByMatron, birthResults) => {
  return axios({
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
    countBirthsFromLog(results, [topic], countsOfBirthsByMatron, birthResults)
  }).catch((error) => {
    console.log('error', error);
    getLogs(topic, startBlock, startBlock + (endBlock - startBlock) / 2, countsOfBirthsByMatron, birthResults)
    getLogs(topic, 1 + startBlock + (endBlock - startBlock) / 2, endBlock, countsOfBirthsByMatron, birthResults)
  });
};

const countBirthsFromLog = (results, topics, countsOfBirthsByMatron, birthResults) => {
  if (results === undefined) {
    return;
  };
  results.forEach((block) => {
    birthResults.totalBirths++;

    let topicObj = helpers.findTopicByName('Birth');
    let topicInputs = topicObj.inputs;
    let topicHex = web3.eth.abi.encodeEventSignature(topicObj);

    let matron = web3.eth.abi.decodeLog(topicInputs, block.data, [topicHex]).matronId;
    if (matron === '0') { // gen0 kitties have no matron
      return;
    } else if (countsOfBirthsByMatron[matron] === undefined) {
      countsOfBirthsByMatron[matron] = 1;
    } else {
      countsOfBirthsByMatron[matron]++;
    }
    if (countsOfBirthsByMatron[matron] > birthResults.maxBirths) {
      birthResults.maxBirths = countsOfBirthsByMatron[matron];
      birthResults.maxMatronId = matron;
    }
  })
}

module.exports = {
  reviewBirths
}