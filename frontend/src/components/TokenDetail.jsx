import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import "../App.css";
import { abi } from "./abi";
import { tokenAbi } from "./tokenAbi";
import CONFIG from "../config";
import { useEthersSigner } from "../ethers";
import BeatLoader from "react-spinners/BeatLoader";
import { useAccount } from 'wagmi'

const TokenDetail = () => {
  const { tokenAddress } = useParams();
  const location = useLocation();
  const { card } = location.state || {};
  const navigate = useNavigate();
  const [tokenData, setTokenData] = useState(null);
  const [purchaseAmount, setPurchaseAmount] = useState("0.0");
  const [tradeType, setTradeType] = useState("buy");
  const [loading, setLoading] = useState(true);
  const [useEth, setUseEth] = useState(true);
  const factoryAddress = CONFIG.CONTRACT_ADDRESS;
  const provider = new ethers.providers.JsonRpcProvider(CONFIG.RPC_URL);
  const signer = useEthersSigner();
  const account = useAccount()
  const [isLoading, setIsLoading] = useState(false);
  const [inputError, setInputError] = useState(false);

  const [remainingTokens, setRemainingTokens] = useState("0");
  const [fundingRaised, setFundingRaised] = useState(0);
  const [totalSupply, setTotalSupply] = useState("0");
  const [balance, setBalance] = useState("0");

  // Constants
  const fundingGoal = 5;
  const maxSupply = parseInt(1_000_000_000);
  const fundingSupply = parseInt(800_000_000);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const response = await fetch(
          `${CONFIG.API_URL}/tokens/${tokenAddress}`
        );
        const data = await response.json();
        data.logo_url = data.logo_url.replace(
          "https://pump.mypinata.cloud/ipfs/",
          "https://ipfs.io/ipfs/"
        );
        setTokenData(data);
      } catch (error) {
        console.error("Error fetching token data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();
  }, [tokenAddress]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const factoryContract = new ethers.Contract(
          factoryAddress,
          abi,
          provider
        );
        const tokenState = await factoryContract.tState(tokenAddress);
        const ethReserve = tokenState.ethReserve;
        const adjustedReserve = ethers.BigNumber.from(ethReserve).sub(
          ethers.utils.parseEther("1.7")
        );
        setFundingRaised(ethers.utils.formatEther(adjustedReserve));

        // Fetch total supply
        const contract = new ethers.Contract(tokenAddress, tokenAbi, provider);
        const totalSupplyResponse = await contract.balanceOf(
          CONFIG.CONTRACT_ADDRESS
        );
        var totalSupplyFormatted = parseInt(
          ethers.utils.formatUnits(totalSupplyResponse, "ether")
        );
        // console.log(totalSupplyFormatted);
        setTotalSupply(parseInt(maxSupply - totalSupplyFormatted));

        // Calculate remaining tokens
        setRemainingTokens(fundingSupply + totalSupplyFormatted - maxSupply);
        console.log(account.address)
        const balanceOfMyself = await contract.balanceOf(account.address);
        setBalance(
          parseFloat(
            ethers.utils.formatUnits(balanceOfMyself, "ether")
          ).toFixed(6)
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tokenAddress]);

  // Calculate percentages for progress bars
  const fundingRaisedPercentage = Math.round(
    (fundingRaised / fundingGoal) * 100
  );
  const totalSupplyPercentage = Math.round(
    (parseFloat(totalSupply) / fundingSupply) * 100
  );

  if (loading || !tokenData) {
    return <div>Loading...</div>;
  }

  const handlePurchase = async () => {
    if (!purchaseAmount || parseFloat(purchaseAmount) === 0) {
      setInputError(true);
      return;
    }

    setInputError(false);
    setIsLoading(true);
    try {
      const factoryContract = new ethers.Contract(factoryAddress, abi, signer);
      const transaction = await factoryContract.buyToken(
        tokenAddress,
        ethers.utils.parseEther(purchaseAmount),
        {
          value: ethers.utils.parseUnits(purchaseAmount, "ether"),
        }
      );
      const receipt = await transaction.wait();
      console.log(receipt);

      alert(`Transaction successful! Hash: ${receipt.txHash}`);
      // setIsModalOpen(false);
    } catch (error) {
      console.error("Error during purchase:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSell = async () => {
    if (!purchaseAmount || parseFloat(purchaseAmount) === 0) {
      setInputError(true);
      return;
    }
    setInputError(false);
    setIsLoading(true);
    try {
      const factoryContract = new ethers.Contract(factoryAddress, abi, signer);
      const transaction = await factoryContract.sellToken(
        tokenAddress,
        ethers.utils.parseEther(purchaseAmount),
        0 // FIXME: slippage
      );
      const receipt = await transaction.wait();
      console.log(receipt);

      alert(`Transaction successful! Hash: ${receipt.txHash}`);
      // setIsModalOpen(false);
    } catch (error) {
      console.error("Error during purchase:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="token-detail-page">
      <h3 className="start-new-coin" onClick={() => navigate("/")}>
        [go back]
      </h3>

      <div className="token-detail-content">
        <div className="token-detail-content-left">
          {/* <div className="token-info">
          </div> */}
          TODO
        </div>
        <div className="token-detail-content-right">
          <div className="trading-panel">
            <div className="trade-tabs">
              <button
                className={`tab ${tradeType === "buy" ? "active" : ""}`}
                onClick={() => setTradeType("buy")}
              >
                buy
              </button>
              <button
                className={`tab ${
                  tradeType === "sell" ? "active sell-active" : ""
                }`}
                onClick={() => setTradeType("sell")}
              >
                sell
              </button>
            </div>

            <div className="trade-content">
              <div className="trade-actions">
                {tradeType === "buy" && (
                  <button
                    className="action-btn"
                    onClick={() => setUseEth(!useEth)}
                  >
                    switch to {useEth ? tokenData.symbol : "ETH"}
                  </button>
                )}
                <button className="action-btn">set max slippage</button>
              </div>

              <div className="amount-input">
                <input
                  type="number"
                  value={purchaseAmount}
                  onChange={(e) => {
                    setInputError(false);
                    setPurchaseAmount(e.target.value);
                  }}
                  placeholder="0.0"
                  className={inputError ? "error" : ""}
                />
                <div className="currency-label">
                  {tradeType === "buy" && useEth ? "ETH" : tokenData.symbol}
                </div>
              </div>

              {useEth && (
                <div className="quick-amounts">
                  <button onClick={() => setPurchaseAmount("0.0")}>
                    reset
                  </button>
                  {tradeType === "buy" ? (
                    <>
                      <button onClick={() => setPurchaseAmount("0.1")}>
                        0.1 ETH
                      </button>
                      <button onClick={() => setPurchaseAmount("0.5")}>
                        0.5 ETH
                      </button>
                      <button onClick={() => setPurchaseAmount("1")}>
                        1 ETH
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setPurchaseAmount((balance * 0.25).toString())}>
                        25%
                      </button>
                      <button onClick={() => setPurchaseAmount((balance * 0.5).toString())}>
                        50%
                      </button>
                      <button onClick={() => setPurchaseAmount((balance * 0.75).toString())}>
                        75%
                      </button>
                      <button onClick={() => setPurchaseAmount(balance.toString())}>
                        100%
                      </button>
                    </>
                  )}
                </div>
              )}

              <div className="estimated-return">
                <span>0.09657595 SOL</span>
              </div>

              <button
                className="place-trade-btn"
                onClick={() => {
                  if (tradeType === "buy") {
                    handlePurchase();
                  } else {
                    handleSell();
                  }
                }}
              >
                {isLoading ? (
                  <BeatLoader size={10} color={"#fff"} />
                ) : (
                  "place trade"
                )}
              </button>

              {/* <label className="comment-checkbox">
                <input type="checkbox" />
                <span>add comment</span>
              </label> */}
            </div>
          </div>
          <div className="token-info">
            <div className="token-header">
              <img
                src={tokenData.logo_url}
                alt={tokenData.name}
                className="token-image"
              />
              <div className="token-title">
                <h2>{tokenData.name}</h2>
                <p>just {tokenData.name}</p>
              </div>
            </div>

            <div className="token-stats">
              <div className="stat-item">
                <label>
                  bonding curve progress: {fundingRaisedPercentage}%
                </label>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${fundingRaisedPercentage}%` }}
                  />
                </div>
                <p className="stat-description">
                  graduate this coin to raydium at ${tokenData.market_cap}{" "}
                  market cap there is {tokenData.virtual_sol_reserves} SOL in
                  the bonding curve
                </p>
              </div>

              <div className="stat-item">
                <label>
                  king of the hill progress: {tokenData.king_of_hill_progress}%
                </label>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${tokenData.king_of_hill_progress}%` }}
                  />
                </div>
                <p className="stat-description">
                  dethrone the current king at ${tokenData.market_cap} market
                  cap
                </p>
              </div>
            </div>

            <div className="holder-distribution">
              <div className="holder-header">
                <h3>holder distribution</h3>
                <button className="bubble-map-btn">generate bubble map</button>
              </div>
              <div className="holder-list">
                {tokenData.holders.map((holder, index) => (
                  <div key={index} className="holder-item">
                    <span className="holder-rank">{index + 1}.</span>
                    <span className="holder-address">{holder.address}</span>
                    {holder.holder_type === "BONDING_CURVE" && (
                      <span className="holder-type">👑</span>
                    )}
                    <span className="holder-percentage">
                      {holder.percentage.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetail;
