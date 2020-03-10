let abiArr = require('./abi.json')

var Web3 = require('web3');
// "Web3.providers.givenProvider" will be set if in an Ethereum supported browser.
var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

const findTopicByName = (arr, target) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].name === target) {
      return arr[i]
    }
  }
}

let topicObj = findTopicByName(abiArr, 'Birth')
let topicInputs = topicObj.inputs
let topicHex = web3.eth.abi.encodeEventSignature(topicObj)

// Birth is 0x0a5311bd2a6608f08a180df2ee7c5946819a649b204b554bb8e39825b2c50ad5

let topicObjGetKitty = findTopicByName(abiArr, 'getKitty')
let topicInputsGetKitty = topicObjGetKitty.inputs
let topicHexGetKitty = web3.eth.abi.encodeFunctionCall(topicObjGetKitty, [20])


module.exports = {
  topicHex,
  topicInputs,
  topicHexGetKitty,
  topicInputsGetKitty
}