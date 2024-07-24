let fs = require('fs')
let EC = require('elliptic').ec

let ec = new EC('secp256k1')

let keypair = ec.genKeyPair()

// get public key via private key
function getPub(prv) {
  return ec.keyFromPrivate(prv).getPublic('hex').toString()
}

// save public key and private key in file: wallet.json
function generateKeys() {
  const fileName = './wallet.json'
  try {
    let res = JSON.parse(fs.readFileSync(fileName))
    if (res.prv && res.pub && getPub(res.prv) == res.pub) {
      keypair = ec.keyFromPrivate(res.prv)
      // console.log(keypair);
      return res
    } else {
      // verfication fail, throw exception and regenerate it
      throw 'Invalid wallet.json'
    }
  } catch (err) {
    // file not exist or it is illegal
    const res = {
      prv: keypair.getPrivate('hex').toString(),
      pub: keypair.getPublic('hex').toString()
    }
    fs.writeFileSync(fileName, JSON.stringify(res))
    return res
  }
}

function sign({ from, to, amount, timestamp }) {
  const bufferMsg = Buffer.from(`${timestamp}-${amount}-${from}-${to}`)

  // use keypair to sign the data
  // use private key to get keypair
  // keypair = ec.keyFromPrivate(res.prv)
  let signature = Buffer.from(keypair.sign(bufferMsg).toDER()).toString('hex')
  return signature
}

// verify signature
function verify({ from, to, amount, timestamp, signature }, pub) {
  // use public key to get keypairTemp
  const keypairTemp = ec.keyFromPublic(pub, 'hex')
  const bufferMsg = Buffer.from(`${timestamp}-${amount}-${from}-${to}`)
  // use keypairTemp to verify data and signature
  return keypairTemp.verify(bufferMsg, signature)
}

const keys = generateKeys()
//console.log(keys);
module.exports = { sign, verify, keys }


const trans = { from: 'woniu', to: 'imooc', amount: 100 }
const signature = sign(trans)
//console.log(signature);

const trans1 = { from: 'woniu', to: 'imooc', amount: 1000 }
trans1.signature = signature

const isVerify = verify(trans1, keys.pub)
console.log(isVerify);
