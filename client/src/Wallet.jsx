import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({shortAddress, setShortAddress, address, setAddress, balance, setBalance, privateKey, setPrivateKey, isConnected, setIsConnected}) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const address = `0x${toHex(secp.secp256k1.getPublicKey(privateKey))}`;
    setAddress(address);
    // console.log(address);

// shorten hex address
    function shorten(hex){
      let sec1 = hex.slice(0, 5);
      let sec2 = hex.slice(-5);
      return sec1 + "..." + sec2;
    }
   
    const shortAddress = shorten(address);
    setShortAddress(shortAddress);
    // console.log(shortAddress);
    if (address) {
      setIsConnected(true);
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      {isConnected && <span style={{color: "green", fontSize: 20}}>CONNECTED</span>}
      <label>
       Private Key
        <input placeholder="Type your private key" value={privateKey} onChange={onChange}></input>
      </label>
      <div>
        Public Address: {shortAddress}
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
