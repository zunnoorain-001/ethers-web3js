import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import message from "../message.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Web3 from "web3";
import Transactions from "./Transactions";
const AccountInfo = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [isTransaction, setIsTransaction] = useState(false);
  const [accountInfo, setAccountInfo] = useState({
    name: "-",
    address: "-",
    balance: null,
    symbol: "-",
    totalSupply: null,
  });
  useEffect(() => {
    setIsTransaction(false);
  }, []);

  const detectProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      window.alert("No Ethereum browser detected! Check out MetaMask");
    }
    return provider;
  };

  const getTokenInfo = async (e) => {
    e.preventDefault();
    waitNotification();
    const provider1 = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider1.getSigner();

    // console.log("Account : " + tokenAddress);
    //creating contract
    let newContract = new ethers.Contract(tokenAddress, message, signer);
    let tokenName = await newContract.name(); // name
    const tokenSymbolLatest = await newContract.symbol(); // symbol
    const tokenTotalSupply = await newContract.totalSupply(); //total supply
    const totalSupplyInEther = Web3.utils.fromWei(
      tokenTotalSupply.toString(),
      "ether"
    );

    const signerAddress = await signer.getAddress();
    let balanceToken = await newContract.balanceOf(signerAddress);
    const amount = Web3.utils.fromWei(balanceToken.toString(), "ether");
    setAccountInfo({
      name: tokenName ? tokenName : "-",
      address: tokenAddress ? tokenAddress : "",
      balance: amount ? amount : "",
      symbol: tokenSymbolLatest ? tokenSymbolLatest : "-",
      totalSupply: totalSupplyInEther ? totalSupplyInEther : null,
    });
    setIsTransaction(true);
    successNotification();
  };

  const waitNotification = () => {
    toast.info("Please Wait ! ", {
      position: "bottom-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  };
  const successNotification = () => {
    toast.success("Token Info Recieved ", {
      position: "bottom-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <>
      <div className="container shadow p-3 mb-5 bg-white rounded">
        <div className="row">
          <div className="col">
            {" "}
            <div className="container">
              <h1 className="text-center">Token Info</h1>
              <form
                className="d-flex flex-column"
                onSubmit={(e) => {
                  getTokenInfo(e);
                }}
              >
                <div className="form-group my-3">
                  <input
                    type="text"
                    className="form-control text-center"
                    id="tokenaddress"
                    aria-describedby="emailHelp"
                    placeholder="Token Address"
                    value={tokenAddress}
                    onChange={(e) => {
                      setTokenAddress(e.target.value);
                    }}
                  />
                  <small
                    id="emailHelp"
                    className="form-text text-muted"
                  ></small>
                </div>

                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={tokenAddress.length <= 0}
                >
                  Get Token Info
                </button>
              </form>
            </div>
            <div className="container">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Address</th>
                    <th scope="col">Balance</th>
                    <th scope="col">Symbol</th>
                    <th scope="col">Total Supply</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{accountInfo.name}</td>
                    <td>{accountInfo.address}</td>
                    <td>{accountInfo.balance}</td>
                    <td>{accountInfo.symbol}</td>
                    <td>{accountInfo.totalSupply}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {isTransaction ? (
            <div className="col">
              <Transactions
                tokenAddress={tokenAddress}
                accountInfo={accountInfo}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      {/* Transacations */}

      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
      />
    </>
  );
};

export default AccountInfo;
