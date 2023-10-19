import{ keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import { secp256k1 } from "ethereum-cryptography/secp256k1";

function hashMessage(message) {
    return toHex(keccak256(utf8ToBytes(JSON.stringify(message))));
}
const privateKey = "4c1a40f031257bf3496b227e56c5732fc1dd3fe3d571a98635155065cb771fd7"
const body = {
    amount: 10,
    recipient: "4c1a40f031257bf3496b227e56c5732fc1dd3fe3d571a98635155065cb771fd7",
};

const msgHash = hashMessage(body);
const signature = secp256k1.sign(msgHash, privateKey)
const pubAddr = signature.recoverPublicKey(msgHash).toHex();
console.log(JSON.parse(JSON.stringify(signature, (key, value) => typeof value === 'bigint' ? value.toString() : value)), signature);