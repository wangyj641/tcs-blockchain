const crypto = require('crypto')

const initBlock = {
  index: 0,
  data: 'Blockchain by Yongjun Wang, this is the first block',
  prevHash: '0',
  timestamp: 1721726276724,
  nonce: 24261,
  hash: '0000fb2c487cb586441df25537241bb8f8e0f533f2d08958c153c7385f7e6c31'
}

class Blockchain {
  constructor() {
    this.blockchain = [initBlock]
    this.data = []
    this.difficulty = 4
  }

  getLastBlock() {
    return this.blockchain[this.blockchain.length - 1]
  }

  blance(address) {
    //from to amount
    let blance = 0
    this.blockchain.forEach(block => {
      // if data is a string, it indicates it is the first block
      // trans is a object
      if (!Array.isArray(block.data)) {
        return
      }
      block.data.forEach(trans => {

        if (address == trans.from) {
          blance -= trans.amount
        }
        if (address == trans.to) {
          blance += trans.amount
        }
      })
    })
    return blance
  }

  mine(address) {
    this.transfer('0', address, 100)
    const newBlock = this.generateNewBlock()

    if (this.isValidBlock(newBlock) && this.isValidChain()) {
      this.blockchain.push(newBlock)
      this.data = []
      console.log('------------------------- mine ok ----------------------');
      return newBlock
    } else {
      console.log('invalid block')
    }
  }

  generateNewBlock() {
    let nonce = 0
    const index = this.blockchain.length
    const data = this.data
    const prevHash = this.getLastBlock().hash
    let timestamp = new Date().getTime()
    let hash = this.computeHash(index, prevHash, timestamp, data, nonce)

    while (hash.slice(0, this.difficulty) !== '0'.repeat(this.difficulty)) {
      nonce++;
      hash = this.computeHash(index, prevHash, timestamp, data, nonce)
    }
    return {
      index,
      data,
      prevHash,
      timestamp,
      nonce,
      hash
    }
  }

  generateFirstBlock() {
    let nonce = 0
    const index = 0
    const data = 'Blockchain by Yongjun Wang, this is the first block'
    const prevHash = 0
    let timestamp = new Date().getTime()
    let hash = this.computeHash(index, prevHash, timestamp, data, nonce)

    while (hash.slice(0, this.difficulty) !== '0'.repeat(this.difficulty)) {
      nonce++;
      hash = this.computeHash(index, prevHash, timestamp, data, nonce)
    }
    console.log(nonce, timestamp, hash)
  }

  computeHash(index, prevHash, timestamp, data, nonce) {
    return crypto
      .createHash('sha256')
      .update(index + prevHash + timestamp + data + nonce)
      .digest('hex')
  }

  computeHashForBlock({ index, prevHash, timestamp, data, nonce }) {
    return this.computeHash(index, prevHash, timestamp, data, nonce)
  }

  isValidBlock(newBlock, lastBlock = this.getLastBlock()) {
    if (newBlock.index !== lastBlock.index + 1) {
      return false
    } else if (newBlock.timestamp <= lastBlock.timestamp) {
      return false
    } else if (newBlock.prevHash !== lastBlock.hash) {
      return false
    } else if (newBlock.hash.slice(0, this.difficulty) !== '0'.repeat(this.difficulty)) {
      return false
    } else if (newBlock.hash !== this.computeHashForBlock(newBlock)) {
      return false
    }
    return true
  }

  isValidChain(chain = this.blockchain) {
    // except the first block
    for (let i = chain.length - 1; i >= 1; i--) {
      if (!this.isValidBlock(chain[i], chain[i - 1])) {
        return false
      }
    }
    if (JSON.stringify(chain[0]) !== JSON.stringify(initBlock)) {
      return false
    }
    return true
  }
  transfer(from, to, amount) {

    if (from !== '0') {
      // it is a transfer
      const blance = this.blance(from)
      if (blance < amount) {
        console.log('Not enough blance', from, blance, amount);
        return
      }
    }

    const transObj = { from, to, amount }
    this.data.push(transObj)
    console.log(this.data)
    return transObj
  }
}

module.exports = Blockchain
