import React, { useState, useEffect, useReducer } from "react";
import Web3 from "web3";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import Card from "./Card";
import Transactions from "./Transactions";
import AccountInfo from "./AccountInfo";

const Connect = (provider) => {
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  // const [switchChainId, setSwitchChainId] = useState("4");
  const [accountAddress, setAccountAddress] = useState("");
  const [accountBalance, setAccountBalance] = useState(null);
  const [accountNetworkName, setAccountNetworkName] = useState("");
  const [accountNetworkId, setAccountNetworkId] = useState("");
  const [isAccountConnected, setIsAccountConnected] = useState(false);
  // detect provider
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

  useEffect(() => {
    connectMetaMask();
  }, [reducerValue]);

  useEffect(() => {}, []);

  const connectMetaMask = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const account = await provider.send("eth_requestAccounts", []);
    setAccountAddress(account[0]);

    await getSha();

    //check chain id
    await checkNetwork();

    //check network name
    await checkNameNetwork();

    //check balance
    await checkBalance(account[0]);

    //checkConnectionStatus
    await checkConnected(account[0]);
  };

  const checkNetwork = async () => {
    const provider = detectProvider();
    const web3 = new Web3(provider);

    const networkId = await web3.eth.getChainId();
    setAccountNetworkId(networkId);
    if (accountNetworkId != 8457) {
      switchNetwork();
    }
  };

  // sha3
  const getSha = async () => {
    const provider = detectProvider();
    const web3 = new Web3(provider);
    const shaValue = await web3.utils.sha3("asd").substr(0, 10);
    // console.log("Sha value : "+shaValue);
  };
  const checkConnected = async () => {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts && accounts.length > 0) {
      setIsAccountConnected(true);
    } else {
      setIsAccountConnected(false);
    }
  };
  const checkBalance = async (account) => {
    const provider = detectProvider();
    const web3 = new Web3(provider);
    const accBalanceEth = web3.utils.fromWei(
      await web3.eth.getBalance(account),
      "ether"
    );

    setAccountBalance(Number(accBalanceEth).toFixed(6));
  };

  const checkNameNetwork = async () => {
    const provider = detectProvider();
    const web3 = new Web3(provider);

    const networkId = await web3.eth.net.getNetworkType();
    setAccountNetworkName(networkId);
  };

  const switchNetwork = async () => {
    // let getChainId = prompt("Enter Chain ID : ");
    const provider = detectProvider();
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x2109" }],
      });

      console.log("You have succefully switched to Red Light Test network");
      forceUpdate();
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 32602) {
        console.log(
          "This network is not available in your metamask, please add it"
        );
        try {
          window.ethereum
            .request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "8457",
                  chainName: "Red Light Testnet",
                  nativeCurrency: {
                    name: "Red Light Coin",
                    symbol: "tRLC",
                    decimals: 18,
                  },
                  rpcUrls: ["http://67.219.103.0:80/"],
                  blockExplorerUrls: ["https://testnet.redlightscan.finance/"],
                },
              ],
            })
            .catch((error) => {
              console.log(error);
            });
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  return (
    <>
      <div className="container">
        <div className="d-flex justify-content-center my-2">
          {accountNetworkId === 8457 || (
            <button
              className="btn btn-success btn-block"
              onClick={() => {
                connectMetaMask();
              }}
            >
              Connect
            </button>
          )}
        </div>
        {accountNetworkId === 8457 ? (
          <>
            <div className="container">
              <div className="row">
                <div className="col">
                  <Card
                    accountAddress={accountAddress}
                    accountBalance={accountBalance}
                    accountNetworkId={accountNetworkId}
                    accountNetworkName={accountNetworkName}
                    isAccountConnected={isAccountConnected}
                  />
                </div>
                
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
      <AccountInfo />
    </>
  );
};

export default Connect;
