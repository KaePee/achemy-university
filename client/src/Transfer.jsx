import { useState } from "react";
import server from "./server";
import{ keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import { secp256k1 } from "ethereum-cryptography/secp256k1";



function Transfer({ address, setBalance, privateKey}) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  
  const setValue = (setter) => (evt) => setter(evt.target.value);

  //?Hash message
  function hashMessage(message) {
    return toHex(keccak256(utf8ToBytes(JSON.stringify(message))));
}


  async function transfer(evt) {
    evt.preventDefault();

    //!server data to send is a message hash and sign by private key
    //!message hash contains obj = {sender:address, amount: parseInt(sendAmount), recipient} ? hash just the sender address as message
    //!sign with private key, include recovery bit
    //! server.post(`send`, { hashedMessage, amount: parseInt(sendAmount), recipient})
    if(!privateKey) {
      alert("No wallet Connected!")
      return;
    }

    if (confirm("Sign Transaction with Private key?")) {
			const body = {
				amount: parseInt(sendAmount),
				recipient,
			};

			const msgHash = hashMessage(body);
			const signature = secp256k1.sign(msgHash, privateKey)
      // console.log("signature-->", signature, typeof signature);
			const publicAddr = signature.recoverPublicKey(msgHash).toHex();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        ...body,
        signature: JSON.parse(JSON.stringify(signature, (key, value) => typeof value === 'bigint' ? value.toString() : value)),
        msgHash,
        publicAddr
      });
      alert(`Successfully sent ${body.amount} to ${body.recipient}`)
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }
}

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
