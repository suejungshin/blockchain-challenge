/*
Find Big “CryptoKitty” Momma
This should be fun exercise that will help you learn some basic blockchain concepts if you are new to them.
CryptoKitties is a blockchain-based game developed by Axiom Zen that allows players to purchase, collect, breed and sell various types of digital kitties. Your objective is to build a program that takes a startingBlock and endingBlock as arguments and counts the total number of births that happened during that range. Finally, use that information to find the Kitty (birth timestamp, generation and their genes) that gave birth to the most kitties.
Email us at maker@makersplace.com with the answer using startingBlock=6607985 and endingBlock=7028323, along with the source code and we promise to respond immediately!
*/

const reviewBirths = require('./reviewBirths.js').reviewBirths;
const getKittyInfo = require('./getKittyInfo.js').getKittyInfo;

const start = 6607985;
const end = 7028323;

const getTotalBirths = async (start, end) => {
  let result = await reviewBirths(start, end)

  return result.totalBirths;
}

let totalBirths = await getTotalBirths(start, end)
let bigMomma = await getKittyInfo(totalBirths)