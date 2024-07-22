//nodejs自带的加密的
const crypto = require('crypto')

//创世区块，随便找个timestamp算出来的
const initBlock = {
  index: 0,
  data: 'Blockchain by Yongjun Wang, this is the first block',
  prevHash: '0',
  timestamp: 1721656530638,
  nonce: 102171,
  hash: '0000220294297a492a6228b300724c836b64f16d23f4a490a5904e36b31b3655'
}

class Blockchain {
  constructor() {
    this.blockchain = [initBlock]
    this.data = []
    this.difficulty = 4  //算hash的难度  前几位是0
  }

  getLastBlock() {
    return this.blockchain[this.blockchain.length - 1]
  }
  //挖矿
  mine() {
    const newBlock = this.generateNewBlock()

    if (this.isValidBlock(newBlock) && this.isValidChain()) {
      this.blockchain.push(newBlock)
      return newBlock
    } else {
      console.log('invalid block')
    }
  }

  //生成新区块
  generateNewBlock() {
    //1.生成新区块 一页新的记账加入了区块链
    //2.不停的算hash,直到符合难度条件,新增区块
    let nonce = 0 //引入nonce不停++来让hash值满足difficuty
    const index = this.blockchain.length //区块的索引值
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

  //计算hash
  computeHash(index, prevHash, timestamp, data, nonce) {
    return crypto
      .createHash('sha256') //创建sha256加密实例
      .update(index + prevHash + timestamp + data + nonce) //得到hash
      .digest('hex') //16进制
  }

  computeHashForBlock({ index, prevHash, timestamp, data, nonce }) {
    return this.computeHash(index, prevHash, timestamp, data, nonce)
  }

  //校验区块 通过上一个区块来校验这个区块
  isValidBlock(newBlock, lastBlock = this.getLastBlock()) {
    // 1.区块的index=最新区块的index+1
    if (newBlock.index !== lastBlock.index + 1) {
      return false
      //2.区块的time 大于最新区块
    } else if (newBlock.timestamp <= lastBlock.timestamp) {
      return false
      //3.最新区块的prevHash等于最新区块Hash
    } else if (newBlock.prevHash !== lastBlock.hash) {
      return false
      //4. 区块的hash符合难度要求
    } else if (newBlock.hash.slice(0, this.difficulty) !== '0'.repeat(this.difficulty)) {
      return false
      //5.新区块hash值计算正确
    } else if (newBlock.hash !== this.computeHashForBlock(newBlock)) {
      return false
    }
    return true
  }

  //校验区块链
  isValidChain(chain = this.blockchain) {
    //除创世区块外的区块
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
}

module.exports = Blockchain