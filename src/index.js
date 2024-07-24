const vorpal = require('vorpal')()
const Table = require('cli-table')

const Blockchain = require('./blockchain')

const blockchain = new Blockchain()

function formateLog(data) {
  if (!data || data.length == 0) {
    return
  }
  if (!Array.isArray(data)) {
    data = [data]
  }
  const first = data[0]
  const head = Object.keys(first)
  const table = new Table({
    head: head,
    colWidths: new Array(head.length).fill(25)
  })
  const res = data.map(v => {
    return Object.values(v).map(x => JSON.stringify(x, null, 1))
  })
  table.push(
    ...res
  )
  console.log(table.toString());
}

vorpal
  .command('trans <from> <to> <amount>', 'Transfer')
  .action(function (args, callback) {
    let trans = blockchain.transfer(args.from, args.to, args.amount)
    if (trans) {
      formateLog(trans)
    }
    callback()
  })

vorpal
  .command('blance <address> ', 'Blance')
  .action(function (args, callback) {
    const blance = blockchain.blance(args.address)
    if (blance) {
      formateLog({ blance, address: args.address })
    }
    callback()
  })


vorpal
  .command('detail <index>', 'View detail of block')
  .action(function (args, callback) {
    const block = blockchain.blockchain[args.index]
    this.log(JSON.stringify(block, null, 2))
    callback()
  })

vorpal
  .command('mine <address>', 'Mine a block')
  .action(function (args, callback) {
    const newBlock = blockchain.mine(args.address)
    if (newBlock) {
      formateLog(newBlock);
    }
    callback()
  })

vorpal
  .command('blockchain', 'List blockchain')
  .action(function (args, callback) {
    formateLog(blockchain.blockchain);
    callback()
  })

vorpal
  .command('init', 'Generate the first block')
  .action(function (args, callback) {
    const newBlock = blockchain.generateFirstBlock()
    if (newBlock) {
      console.log(newBlock);
    }
    callback()
  })

console.log('welcome to tcs blockchain');
vorpal.exec('help')
vorpal
  .show()