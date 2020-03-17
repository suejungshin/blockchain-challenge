let abiArr = require('./abi.json')

const findTopicByName = (target) => {
  for (let i = 0; i < abiArr.length; i++) {
    if (abiArr[i].name === target) {
      return abiArr[i]
    }
  }
}
const turnIntToHex = (integer) => {
  return `0x${integer.toString(16)}`
}

module.exports = {
  turnIntToHex,
  findTopicByName
}