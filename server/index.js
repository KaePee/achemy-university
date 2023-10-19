const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
app.use(cors());
app.use(express.json());

const { secp256k1 } = require('ethereum-cryptography/secp256k1');
const { toHex, hexToBytes } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak');

//Preset accounts with balances. Private keys for each found below
const balances = {
  "0x025e5a664eb12ee40d13ce3aced4352b6aa9fe45dde42dc9b6f4139426248ee188": 100,
  "0x0306a716dc3962566f75f6edd6089e83aab3c346d103c7dbaf858084489b618e2d": 50,
  "0x025fa660c5c8e10833e918560d6155e4819d9e1041cf3c11c6313734b8433ac213": 75,
};
//Test accounts with key-pairs //!USE Ox ADDRESSES SINCE THAT IS WHAT YOU WILL BE RECOVERING
// accounts 1
// Private key --> 4c1a40f031257bf3496b227e56c5732fc1dd3fe3d571a98635155065cb771fd7
// Public Key --> 025e5a664eb12ee40d13ce3aced4352b6aa9fe45dde42dc9b6f4139426248ee188

// accounts 2
// Private key --> 31e09947c1c831a572f5a96a081a31fa39004295750f9a1c2eaa3095662d00be
// Public Key --> 0306a716dc3962566f75f6edd6089e83aab3c346d103c7dbaf858084489b618e2d

// accounts 3
// Private key --> 84255d10bce567b9f53795148681ca1094a67d6d2e8410b9747b82cd4f67f0a6
// Public Key --> 025fa660c5c8e10833e918560d6155e4819d9e1041cf3c11c6313734b8433ac213

// accounts 4
// Private key --> b0f2a61920f9f103dc82c840227bbcb5b3fb321d140321221ba1e39e2da8a4d2
// Public Key --> 030f93823d1da3a06b0145c054ab16307e34b7276fc2aec59bcdd8db8ad8625db3


app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

//calculate ETH address //!wasn't working for some reason
// function getEthAddress(publicKey) {
// 	const hash = keccak256(publicKey.slice(1, publicKey.length));
// 	return (toHex(hash.slice(-20)));
// }

app.post("/send", (req, res) => {

  const { recipient, amount, signature, msgHash, publicAddr } = req.body;
  console.log("received request--> ", req.body);
  signature.r = BigInt(signature.r);
	signature.s = BigInt(signature.s);
  if (!secp256k1.verify(signature, msgHash, publicAddr)) return res.status(400).send({ message: "Invalid Signer! Transaction is invalid" });

  //get sender address
  const sender = `0x${publicAddr}`;
  console.log(sender)
	if (!balances[sender]) return res.status(400).send({ message: "Invalid sender" });

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
