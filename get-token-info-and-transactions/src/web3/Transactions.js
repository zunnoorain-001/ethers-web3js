import { useState } from "react";
import message from "../message.json";
import { ethers } from "ethers";
import Web3 from "web3";

const Transactions = ({ tokenAddress, accountInfo }) => {
  const [recieverAddress, setRecieverAddress] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [sendBalance, setSendBalance] = useState(0);

  const sendTransactions = async (e) => {
    // console.log(tokenAddress);
    // console.log(accountInfo);
    e.preventDefault();
    const provider1 = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider1.getSigner();

    let newContract = new ethers.Contract(tokenAddress, message, signer);

    // send balance
    const value = ethers.utils.parseUnits(sendBalance, "ether");
    
    try {
      await newContract.transfer(recieverAddress, value);
    } catch (error) {
      console.log(error);
    }

    // console.log(recieverAddress);
    // console.log(sendBalance);
  };
  return (
    <div className="container my-5 shadow p-3 mb-5 bg-white rounded">
      <form
        onSubmit={(e) => {
          sendTransactions(e);
        }}
      >
        <div className="form-group my-3">
          <input
            type="text"
            className="form-control"
            id="reciever"
            aria-describedby="reciever"
            onChange={(e) => setRecieverAddress(e.target.value)}
            placeholder="Acount Address"
          />
          <small id="recievernew" className="form-text text-muted"></small>
        </div>
        <div className="form-group my-3">
          <input
            type="number"
            className="form-control"
            id="number"
            onChange={(e) => setSendBalance(e.target.value)}
            placeholder="Balance"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Send Transactions
        </button>
      </form>
    </div>
  );
};

export default Transactions;
