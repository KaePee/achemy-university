import Wallet from "./Wallet";
import Transfer from "./Transfer";
import Footer from "./Footer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [shortAddress, setShortAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="app">
      <Wallet
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        balance={balance}
        setBalance={setBalance}
        address={address}
        shortAddress={shortAddress}
        setAddress={setAddress}
        setShortAddress={setShortAddress}
        isConnected={isConnected}
        setIsConnected={setIsConnected}
      />
      <Transfer setBalance={setBalance} address={address} privateKey={privateKey} />
      <div className="footer">
        <Footer />
      </div>
    </div>

  );
}

export default App;
