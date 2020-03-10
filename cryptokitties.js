const axios = require('axios');
const PROJECT_ID = require('./secrets.js');

var Web3 = require('web3');
// "Web3.providers.givenProvider" will be set if in an Ethereum supported browser.
var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

const endpoint = `https://mainnet.infura.io/v3/${PROJECT_ID}`;


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


const getLogs = (topic, startBlock, endBlock, countsOfBirthsByMatron) => {
  axios({
    method: 'post',
    url: endpoint,
    data: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getLogs',
      params: [{
        address: '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d', // address for cryptokitties
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
    if (response === undefined) {
      console.log('no response received')
    } else {
      let results = response.data.result;
      countBirthsFromLog(results, [topic], countsOfBirthsByMatron)
//      console.log(maxBirths)
    }
  }).catch((error) => {
    console.log('error', error);
    getLogs(topic, startBlock, startBlock + (endBlock - startBlock) / 2, countsOfBirthsByMatron)
    getLogs(topic, 1 + startBlock + (endBlock - startBlock) / 2, endBlock, countsOfBirthsByMatron)
  })
}


let countsOfBirthsByMatron = {}
let maxBirths = {
  matronId: null,
  maxBirths: 0
}


const start = 6607985;
const end = 7028323;
const interval = 100;


const turnIntToHex = (integer) => {
  return `0x${integer.toString(16)}`
}

const callGetLogs = async () => {

  for (let i = start; i <= end; i += interval) {
    await getLogs(birthEventTopic, turnIntToHex(i), turnIntToHex(i + interval - 1), countsOfBirthsByMatron)
  }

  return maxBirths;

}
callGetLogs().then((result) => {console.log(result)})



// let promises = []

// for (let i = start; i <= end; i += interval) {
//   promises.push(getLogs(birthEventTopic, turnIntToHex(i), turnIntToHex(i + interval), countsOfBirthsByMatron))
// }

// Promise.all(promises).then(() => console.log('finalmax', maxBirths))

// getLogs(birthEventTopic, turnIntToHex(start), turnIntToHex(start + interval), countsOfBirthsByMatron)


const countBirthsFromLog = (results, topics, countsOfBirthsByMatron) => {
  if (results === undefined) {
    console.log('No births here')
    return
  }
  results.forEach((block) => {
    let matron = web3.eth.abi.decodeLog(birthEventInputs, block.data, topics).matronId
    if (matron === '0') { // gen0 kitties have no matron
      return
    } else if (countsOfBirthsByMatron[matron] === undefined) {
      countsOfBirthsByMatron[matron] = 1
    } else {
      countsOfBirthsByMatron[matron]++
    }
    if (countsOfBirthsByMatron[matron] > maxBirths.maxBirths) {
      maxBirths.maxBirths = countsOfBirthsByMatron[matron]
      maxBirths.matronId = matron
    }
  })
  console.log('Log counted!')
}