const vorpal = require('vorpal')()
const Blockchain = require('./blockchain')

const blockchain = new Blockchain()

vorpal
  .command('init', 'Generate the first block')
  .action(function (args, callback) {
    const newBlock = blockchain.generateFirstBlock()
    if (newBlock) {
      console.log(newBlock);
    }
    callback()
  })

vorpal
  .command('mine', 'Mine a block')
  .action(function (args, callback) {
    const newBlock = blockchain.mine()
    if (newBlock) {
      console.log(newBlock);
    }
    callback()
  })

vorpal
  .command('blockchain', 'List blockchain')
  .action(function (args, callback) {
    console.log(blockchain.blockchain);
    callback()
  })


console.log('welcome to tcs blockchain');
vorpal.exec('help')
vorpal
  .show()