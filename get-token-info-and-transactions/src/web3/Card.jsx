import React from "react";

const Card = ({
  accountAddress,
  accountBalance,
  accountNetworkId,
  accountNetworkName,
  isAccountConnected,
}) => {
  return (
    <div className="container my- shadow p-3 mb-5 bg-white rounded">
      <div>
        <ul className="list-group my-5">
          <li className="list-group-item my-1">Account : {accountAddress}</li>
          <li className="list-group-item my-1">Balance : {accountBalance}</li>
          <li className="list-group-item my-1">
            Chain Id : {accountNetworkId}
          </li>
          <li className="list-group-item my-1">
            Network : &nbsp;
            {accountNetworkName.charAt(0).toUpperCase() +
              accountNetworkName.slice(1, 20)}
          </li>
          <li
            className="list-group-item my-1"
            style={{
              display: "flex",
              justifyContent: "flex-start",
              paddingRight: "2px",
              alignItems: "center",
            }}
          >
            Connection Status:{" "}
            {isAccountConnected ? (
              <div
                style={{
                  height: "15px",
                  width: "15px",
                  marginLeft: "10px",
                  backgroundColor: "green",
                  borderRadius: "50%",
                }}
              ></div>
            ) : (
              "Not Connected"
            )}
          </li>
        </ul>
      </div>
      <div className="d-flex justify-content-center">
        {/*<button
            className="btn btn-primary btn-block"
            onClick={() => {
              switchNetwork();
            }}
          >
            Switch Network
          </button>

           <button
            className="btn btn-outline-success mx-2"
            onClick={() => {
              addNetwork();
            }}
          >
            Add binance test net
          </button> */}
      </div>
    </div>
  );
};

export default Card;
