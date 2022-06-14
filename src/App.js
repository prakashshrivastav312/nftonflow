import './App.css';


import Collection from "./Collection.js";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import {useState, useEffect} from 'react';
import {create} from 'ipfs-http-client';
import {mintNFT} from "./cadence/transactions/mint_nft.js";
import {setupUserTx} from "./cadence/transactions/setup_user.js";


const client = create('https://ipfs.infura.io:5001/api/v0');

fcl.config()
  .put("accessNode.api", "https://access-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")

function App() {
  const [user, setUser] = useState();
  const [nameOfNFT, setNameOfNFT] = useState('');
  const [file, setFile] = useState();
 

  useEffect(() => {
    // sets the `user` variable to the person that is logged in through Blocto
    fcl.currentUser().subscribe(setUser);
  }, [])

  const logIn = () => {
    // log in through Blocto
    fcl.authenticate();
  }
//emit & log events
//parameterized the address for contracts imports
  const mint = async () => {

    try {
      const added = await client.add(file)
      const hash = added.path;

      const transactionId = await fcl.send([
        fcl.transaction(mintNFT),
        fcl.args([
          fcl.arg(hash, t.String),
          fcl.arg(nameOfNFT, t.String)
        ]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999)
      ]).then(fcl.decode);
      //emit & log the event 
      console.log(transactionId);
      return fcl.tx(transactionId).onceSealed();
    } catch(error) {
      console.log('Error uploading file: ', error);
    }
  }
//emit & log events
//parameterized the address for contracts imports
//explain how do fcl.authorization work
//explain resource save, linking, get capability 
//explain contracts(Nu10NFT.cdc, NonFungibleToken.cdc), Transactions(Setup Account and Mint NFTs)
  const setupUser = async () => {
    const transactionId = await fcl.send([
      fcl.transaction(setupUserTx),
      fcl.args([]),
      fcl.payer(fcl.authz),
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(9999)
    ]).then(fcl.decode);

    console.log(transactionId);
    return fcl.tx(transactionId).onceSealed();
  }

  

 

  return (
    <div className="App">
      <h1>Nu10 NFT (Flow Blockchain)</h1>
      <h2>Account address: {user && user.addr ? user.addr : ''}</h2>
      <button onClick={() => logIn()}>Log In</button>
      <button onClick={() => fcl.unauthenticate()}>Log Out</button>
      <button onClick={() => setupUser()}>Setup User</button>

      

      <div>
        <input type="text" onChange={(e) => setNameOfNFT(e.target.value)} />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={() => mint()}>Mint</button>
      </div>

      {user && user.addr
        ?
        <Collection address={user.addr} ></Collection>
        :
        null  
      }
      

      
    </div>
  );
}

export default App;