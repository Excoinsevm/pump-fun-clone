import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import "../App.css";
import NavBar from "./NavBar.jsx";
import { abi } from "./abi";
import { tokenAbi } from "./tokenAbi";
import CONFIG from "../config";
import { useEthersSigner } from "../ethers";

const TokenDetail = () => {
  const { tokenAddress } = useParams();
  const location = useLocation();
  const { card } = location.state || {};

  const [owners, setOwners] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSupply, setTotalSupply] = useState("0");
  const [remainingTokens, setRemainingTokens] = useState("0");
  const [fundingRaised, setFundingRaised] = useState(0);
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [cost, setCost] = useState("0");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const factoryAddress = CONFIG.CONTRACT_ADDRESS;
  const provider = new ethers.providers.JsonRpcProvider(CONFIG.RPC_URL);
  const signer = useEthersSigner();
  const [tradeType, setTradeType] = useState('buy');

  const tokenDetails = card || {
    name: "Unknown",
    symbol: "Unknown",
    description: "No description available",
    tokenImageUrl: "https://via.placeholder.com/200",
    fundingRaised: "0 ETH",
    creatorAddress: "0x0000000000000000000000000000000000000000",
  };

  // const fundingRaised = parseFloat(
  //   tokenDetails.fundingRaised.replace(" ETH", "")
  // );

  // Constants
  const fundingGoal = 5;
  const maxSupply = parseInt(1_000_000_000);
  const fundingSupply = parseInt(800_000_000);

  useEffect(() => {
    const factoryContract = new ethers.Contract(factoryAddress, abi, provider);
    const queryEvents = async () => {
      const eventFilter = factoryContract.filters.TokenBought();
      // let events = await factoryContract.queryFilter(eventFilter, 1, "latest");

      const latestBlock = provider.getBlockNumber();
      let events = await factoryContract.queryFilter(
        eventFilter,
        latestBlock - 800,
        "latest"
      );
      console.log(events);
    };

    // const boughts = await Promise.all(
    //   events.map(async (e) => {
    //     return {
    //       tokenAddress: e.args[0],
    //       creatorAddress: e.args[1],
    //     };
    //   })
    // );
    // console.log(boughts);
    // setTransfers(boughts);
    queryEvents();
  }, [tokenAddress]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const ownersResponse = await fetch(
        //   `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/owners?chain=sepolia&order=DESC`,
        //   {
        //     headers: {
        //       accept: "application/json",
        //       "X-API-Key": process.env.REACT_APP_X_API_KEY,
        //     },
        //   }
        // );
        // const ownersData = await ownersResponse.json();
        setOwners([]);

        // const transfersResponse = await fetch(
        //   `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/transfers?chain=sepolia&order=DESC`,
        //   {
        //     headers: {
        //       accept: "application/json",
        //       "X-API-Key": process.env.REACT_APP_X_API_KEY,
        //     },
        //   }
        // );
        // const transfersData = await transfersResponse.json();
        setTransfers([]);

        const factoryContract = new ethers.Contract(
          factoryAddress,
          abi,
          provider
        );
        const tokenState = await factoryContract.tState(tokenAddress);
        const ethReserve = tokenState.ethReserve;
        console.log(ethReserve);
        setFundingRaised(ethers.utils.formatEther(ethReserve));

        // Fetch total supply
        const contract = new ethers.Contract(tokenAddress, tokenAbi, provider);
        const totalSupplyResponse = await contract.balanceOf(
          CONFIG.CONTRACT_ADDRESS
        );
        var totalSupplyFormatted = parseInt(
          ethers.utils.formatUnits(totalSupplyResponse, "ether")
        );
        console.log(totalSupplyFormatted);
        setTotalSupply(parseInt(maxSupply - totalSupplyFormatted));

        // Calculate remaining tokens
        setRemainingTokens(fundingSupply + totalSupplyFormatted - maxSupply);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tokenAddress, isModalOpen]);

  // Calculate percentages for progress bars
  const fundingRaisedPercentage = (fundingRaised / fundingGoal) * 100;
  const totalSupplyPercentage = (parseFloat(totalSupply) / fundingSupply) * 100;

  // Function to get cost of purchasing tokens
  const getCost = async () => {
    if (!purchaseAmount) return;

    try {
      // console.log(ethers.parseEther(purchaseAmount))
      // const costInWei = await factoryContract.getExactTokenAmountForBuying(
      //   factoryAddress,
      //   ethers.parseEther(purchaseAmount)
      // ); // Replace with actual function
      // console.log(costInWei)
      // setCost(ethers.utils.formatUnits(costInWei, "ether"));

      setCost("0.1");
      setIsModalOpen(true); // Open the modal
    } catch (error) {
      console.error("Error calculating cost:", error);
    }
  };

  // Function to handle purchase
  const handlePurchase = async () => {
    try {
      const factoryContract = new ethers.Contract(factoryAddress, abi, signer);
      const transaction = await factoryContract.buyToken(
        tokenAddress,
        ethers.utils.parseEther(purchaseAmount),
        {
          value: ethers.utils.parseUnits(cost, "ether"),
        }
      );
      const receipt = await transaction.wait();
      console.log(receipt);

      alert(`Transaction successful! Hash: ${receipt.hash}`);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error during purchase:", error);
    }
  };

  return (
    <div className="token-detail-container">
      <NavBar></NavBar>
      <h3 className="start-new-coin" onClick={() => navigate("/")}>
        [go back]
      </h3>

      <div className="token-details-section">
        <div className="token-details">
          <h2>Token Detail for {tokenDetails.name}</h2>
          <img
            src={tokenDetails.tokenImageUrl}
            alt={tokenDetails.name}
            className="token-detail-image"
          />
          <p>
            <strong>Creator Address:</strong> {tokenDetails.creatorAddress}
          </p>
          <p>
            <strong>Token Address:</strong> {tokenAddress}
          </p>
          <p>
            <strong>Funding Raised:</strong> {tokenDetails.fundingRaised}
          </p>
          <p>
            <strong>Token Symbol:</strong> {tokenDetails.symbol}
          </p>
          <p>
            <strong>Description:</strong> {tokenDetails.description}
          </p>
        </div>

        <div className="right-column">
          <div className="progress-bars">
            <div className="progress-container">
              <p>
                <strong>Bonding Curve Progress:</strong> {fundingRaised} /{" "}
                {fundingGoal} ETH
              </p>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${fundingRaisedPercentage}%` }}
                ></div>
              </div>
              <p>
                When the market cap reaches {fundingGoal} ETH, all the liquidity
                from the bonding curve will be deposited into Uniswap, and the
                LP tokens will be burned. Progression increases as the price
                goes up.
              </p>
            </div>

            <div className="progress-container">
              <p>
                <strong>Remaining Tokens Available for Sale:</strong>{" "}
                {remainingTokens} / {fundingSupply}
              </p>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${totalSupplyPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="buy-tokens">
            <div className="trading-card">
              <div className="trade-tabs">
                <button 
                  className={`tab ${tradeType === 'buy' ? 'active' : ''}`}
                  onClick={() => setTradeType('buy')}
                >
                  Buy
                </button>
                <button 
                  className={`tab ${tradeType === 'sell' ? 'active sell-active' : ''}`}
                  onClick={() => setTradeType('sell')}
                >
                  Sell
                </button>
              </div>
              
              <div className="card-content1">
                <div className="token-actions">
                  {tradeType === 'buy' && (
                    <button className="action-btn token-switch">
                      switch to ${tokenDetails.symbol}
                    </button>
                  )}
                  <button className="action-btn slippage">
                    Set max slippage
                  </button>
                </div>

                <div className="amount-field">
                  <input
                    type="text"
                    placeholder="0.0"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                  />
                  <div className="currency-badge">
                    <span>{tradeType === 'buy' ? 'SOL' : '$UFOMO'}</span>
                    {tradeType === 'sell' && (
                      <img src="/path-to-ufomo-icon.png" alt="UFOMO" className="token-icon" />
                    )}
                  </div>
                </div>

                <div className="quick-actions">
                  <button className="quick-btn">reset</button>
                  {tradeType === 'buy' ? (
                    <>
                      <button className="quick-btn">0.1 SOL</button>
                      <button className="quick-btn">0.5 SOL</button>
                      <button className="quick-btn">1 SOL</button>
                    </>
                  ) : (
                    <>
                      <button className="quick-btn">25%</button>
                      <button className="quick-btn">50%</button>
                      <button className="quick-btn">75%</button>
                      <button className="quick-btn">100%</button>
                    </>
                  )}
                </div>

                {tradeType === 'sell' && (
                  <div className="estimated-return">
                    <span>0.09657595 SOL</span>
                  </div>
                )}

                <button 
                  className={`trade-btn ${tradeType === 'sell' ? 'sell-btn' : ''}`} 
                  onClick={getCost}
                >
                  place trade
                </button>

                <label className="comment-toggle">
                  <input type="checkbox" />
                  <span>add comment</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h4>Confirm Purchase</h4>
            <p>
              Cost of {purchaseAmount} tokens: {cost} ETH
            </p>
            <button onClick={handlePurchase} className="confirm-button">
              Confirm
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <h3>Owners</h3>
      {loading ? (
        <p>Loading owners...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Owner Address</th>
              <th>Percentage of Total Supply</th>
            </tr>
          </thead>
          <tbody>
            {owners.map((owner, index) => (
              <tr key={index}>
                <td>{owner.owner_address}</td>
                <td>{owner.percentage_relative_to_total_supply}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Transfers</h3>
      {loading ? (
        <p>Loading transfers...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>From Address</th>
              <th>To Address</th>
              <th>Value (ETH)</th>
              <th>Transaction Hash</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((transfer, index) => (
              <tr key={index}>
                <td>{transfer.from_address}</td>
                <td>{transfer.to_address}</td>
                <td>{transfer.value_decimal}</td>
                <td>
                  <a
                    style={{ color: "white" }}
                    href={`https://sepolia.etherscan.io/tx/${transfer.transaction_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {transfer.transaction_hash}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TokenDetail;
