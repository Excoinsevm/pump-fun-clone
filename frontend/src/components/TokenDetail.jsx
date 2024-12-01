import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import "../App.css";
import { abi } from "./abi";
import { tokenAbi } from "./tokenAbi";
import CONFIG from "../config";
import { useEthersSigner } from "../ethers";
import BeatLoader from "react-spinners/BeatLoader";
import { useAccount } from "wagmi";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import heart from "./heart.svg";
import CommentModal from "./CommentModal";

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
  const account = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [inputError, setInputError] = useState(false);

  const [remainingTokens, setRemainingTokens] = useState("0");
  const [fundingRaised, setFundingRaised] = useState(0);
  const [totalSupply, setTotalSupply] = useState("0");
  const [balance, setBalance] = useState("0");
  const [ethReserve, setEthReserve] = useState(0);
  const [tokenReserve, setTokenReserve] = useState(0);

  // Constants
  const fundingGoal = 5;
  const maxSupply = parseInt(1_000_000_000);
  const fundingSupply = parseInt(800_000_000);

  const [activeTab, setActiveTab] = useState("thread");

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample data for trades (replace with actual data fetching logic)
  const tradesData = [
    {
      account: "FUatjT",
      type: "buy",
      eth: 0.5,
      idp: "9.49m",
      date: "16s ago",
      transaction: "4b38j3",
    },
    {
      account: "d16xMV",
      type: "buy",
      eth: 0.21,
      idp: "4.06m",
      date: "25s ago",
      transaction: "5MYibQ",
    },
    {
      account: "d16xMV",
      type: "sell",
      eth: 0.21,
      idp: "4.06m",
      date: "25s ago",
      transaction: "5MYibQ",
    },
    // ... more trades
  ];

  // Sample replies data
  const repliesData = [
    {
      avatar:
        "https://pump.mypinata.cloud/ipfs/QmeSzchzEPqCU1jwTnsipwcBAeH7S4bmVvFGfF65iA1BY1?img-width=16&img-dpr=2&img-onerror=redirect",
      name: "DDKrich",
      reply_time: "2:04:05 PM",
      likes: 7,
      content: "seems legit",
    },
    {
      avatar:
        "https://pump.mypinata.cloud/ipfs/QmeSzchzEPqCU1jwTnsipwcBAeH7S4bmVvFGfF65iA1BY1?img-width=16&img-dpr=2&img-onerror=redirect",
      name: "dh8c4",
      reply_time: "2:06:14 PM",
      likes: 7,
      content: "sound legit for me",
    },
    {
      avatar:
        "https://pump.mypinata.cloud/ipfs/QmeSzchzEPqCU1jwTnsipwcBAeH7S4bmVvFGfF65iA1BY1?img-width=16&img-dpr=2&img-onerror=redirect",
      name: "WARBUCKS",
      reply_time: "2:11:12 PM",
      likes: 5,
      content: "Take my money",
    },
    {
      avatar:
        "https://pump.mypinata.cloud/ipfs/QmeSzchzEPqCU1jwTnsipwcBAeH7S4bmVvFGfF65iA1BY1?img-width=16&img-dpr=2&img-onerror=redirect",
      name: "jrjubilium",
      reply_time: "2:13:40 PM",
      likes: 5,
      content: "nice top holder trimmed sendor",
    },
    {
      avatar:
        "https://pump.mypinata.cloud/ipfs/QmeSzchzEPqCU1jwTnsipwcBAeH7S4bmVvFGfF65iA1BY1?img-width=16&img-dpr=2&img-onerror=redirect",
      name: "7NRvsk",
      reply_time: "2:15:12 PM",
      likes: 5,
      content: "5% out",
    },
  ];

  // Sample holder distribution data
  const holderDistributionData = [
    { address: "9qP5Uv", percentage: 29.5, holder_type: "BONDING_CURVE" },
    { address: "C4dUZB", percentage: 2.45 },
    { address: "Hr8JVp", percentage: 2.16 },
    { address: "9ER2KU", percentage: 2.07 },
    { address: "A4Zmko", percentage: 1.91 },
    { address: "GpJSc5", percentage: 1.88 },
    { address: "GuLeBH", percentage: 1.83 },
    { address: "GmAmTk", percentage: 1.81 },
    { address: "5nFoxC", percentage: 1.76 },
    { address: "6EtpaF", percentage: 1.74 },
    { address: "9ieq7B", percentage: 1.7 },
    { address: "E9Hj79", percentage: 1.65 },
    { address: "7pfi6t", percentage: 1.63 },
    { address: "7Ts8Uj", percentage: 1.62 },
    { address: "EU8vyG", percentage: 1.52 },
    { address: "GUx2Ww", percentage: 1.46 },
    { address: "4bdEcZ", percentage: 1.42 },
    { address: "8VARYw", percentage: 1.4 },
    { address: "88zBaU", percentage: 1.38 },
    { address: "8ATF76", percentage: 1.38 },
  ];

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
        const tokenReserve = tokenState.tokenReserve;
        setEthReserve(ethReserve);
        setTokenReserve(tokenReserve);
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
        // console.log(account.address);
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

  const handlePurchaseToken = async () => {
    if (!purchaseAmount || parseFloat(purchaseAmount) === 0) {
      setInputError(true);
      return;
    }

    setInputError(false);
    setIsLoading(true);
    const ethAmount = getExactTokenAmountForBuying(purchaseAmount);
    try {
      const factoryContract = new ethers.Contract(factoryAddress, abi, signer);
      const transaction = await factoryContract.buyToken(
        tokenAddress,
        ethers.utils.parseEther(ethAmount),
        {
          value: ethers.utils.parseUnits(ethAmount, "ether"),
        }
      );
      const receipt = await transaction.wait();
      console.log(receipt);

      alert(`Transaction successful! Hash: ${receipt.transactionHash}`);
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
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
      const tx = await tokenContract.approve(
        factoryAddress,
        ethers.utils.parseEther(purchaseAmount)
      );
      await tx.wait();
      const factoryContract = new ethers.Contract(factoryAddress, abi, signer);
      const transaction = await factoryContract.sellToken(
        tokenAddress,
        ethers.utils.parseEther(purchaseAmount),
        0
      );
      const receipt = await transaction.wait();
      console.log(receipt);

      alert(`Transaction successful! Hash: ${receipt.transactionHash}`);
      // setIsModalOpen(false);
    } catch (error) {
      console.error("Error during purchase:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTokenAmountBought = (ethAmount) => {
    if (parseFloat(ethAmount) === 0.0 || ethAmount === "") {
      return 0;
    }
    const ethAmt = ethers.utils.parseEther(ethAmount);
    const tokenAmount = ethAmt.mul(tokenReserve).div(ethAmt.add(ethReserve));
    const tokenAmt = ethers.utils.formatEther(tokenAmount);
    return Math.round(tokenAmt);
  };

  const getExactTokenAmountForBuying = (tokenAmount) => {
    if (parseFloat(tokenAmount) === 0.0 || tokenAmount === "") {
      return 0;
    }
    const tokenAmt = ethers.utils.parseUnits(tokenAmount.toString(), "ether");
    const ethAmount = tokenAmt
      .mul(ethReserve)
      .div(tokenReserve.sub(tokenAmt).add(1));
    const ethAmt = ethers.utils.formatEther(ethAmount);
    return parseFloat(ethAmt).toFixed(4);
  };

  const getEthAmountReceived = (tokenAmount) => {
    if (parseFloat(tokenAmount) === 0.0 || tokenAmount === "") {
      return 0;
    }
    const tokenAmt = ethers.utils.parseUnits(tokenAmount.toString(), "ether");
    const ethAmount = tokenAmt.mul(ethReserve).div(tokenReserve.add(tokenAmt));
    const ethAmt = ethers.utils.formatEther(ethAmount);
    return parseFloat(ethAmt).toFixed(4);
  };

  function scrollPageToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  const handlePostComment = async (comment, file) => {
    const formData = new FormData();
    formData.append("comment", comment);
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch("/comment", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        // Handle successful comment post
        console.log("Comment posted successfully");
      } else {
        console.error("Error posting comment");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="token-detail-page">
      <h3 className="start-new-coin" onClick={() => navigate("/")}>
        [go back]
      </h3>

      <div className="token-detail-content">
        <div className="token-detail-content-left">
          <div className="tradingview-chart">
            <AdvancedRealTimeChart
              theme="dark"
              autosize
              symbol={tokenData.symbol}
              copyrightStyles='display": "none"'
            ></AdvancedRealTimeChart>
          </div>
          {/* Tab Switch */}
          <div className="tab-switch">
            <button
              onClick={() => setActiveTab("thread")}
              className={activeTab === "thread" ? "active" : ""}
            >
              Thread
            </button>
            <button
              onClick={() => setActiveTab("trades")}
              className={activeTab === "trades" ? "active" : ""}
            >
              Trades
            </button>
          </div>

          {activeTab === "thread" && (
            <div className="post-reply">
              <span onClick={() => setIsModalOpen(true)} className="post">
                [post a reply]
              </span>
              <span onClick={scrollPageToBottom} className="scroll">
                [scroll to bottom]
              </span>
            </div>
          )}
          {/* Tab Content */}
          {activeTab === "thread" && (
            <div className="thread-content">
              <div className="thread-reply">
                <div className="thread-reply-header">
                  <img
                    src="https://pump.mypinata.cloud/ipfs/QmeSzchzEPqCU1jwTnsipwcBAeH7S4bmVvFGfF65iA1BY1?img-width=16&img-dpr=2&img-onerror=redirect"
                    alt="User Avatar"
                    className="user-avatar"
                  />
                  <strong>name</strong>
                  <span>12/1/2024, 2:00:18 PM</span>
                </div>
                <p>just a test (test)</p>
                <p>this is just a test</p>
              </div>
              {repliesData.map((reply, index) => (
                <div key={index} className="thread-reply">
                  <div className="thread-reply-header">
                    <img
                      src={reply.avatar}
                      alt="User Avatar"
                      className="user-avatar"
                    />
                    <strong>{reply.name}</strong>
                    <span>{reply.reply_time}</span>
                    <span className="likes">
                      <img src={heart} alt="Icon" width="16" /> {reply.likes}
                    </span>
                    <span className="thread-reply-button">[reply]</span>
                  </div>
                  <div className="thread-reply-content">
                    <div>{reply.content}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "trades" && (
            <div className="trades-content">
              <table>
                <thead>
                  <tr>
                    <th>account</th>
                    <th>type</th>
                    <th>ETH</th>
                    <th>IDP</th>
                    <th>date</th>
                    <th>transaction</th>
                  </tr>
                </thead>
                <tbody>
                  {tradesData.map((trade, index) => (
                    <tr key={index}>
                      <td>
                        <div>
                          <img
                            src="https://pump.mypinata.cloud/ipfs/QmeSzchzEPqCU1jwTnsipwcBAeH7S4bmVvFGfF65iA1BY1?img-width=16&img-dpr=2&img-onerror=redirect"
                            alt="User Avatar"
                            className="user-avatar"
                          />
                          {trade.account}
                        </div>
                      </td>
                      <td>
                        <div
                          className={
                            trade.type === "buy" ? "text-green" : "text-red"
                          }
                        >
                          {trade.type}
                        </div>
                      </td>
                      <td>{trade.eth}</td>
                      <td>{trade.idp}</td>
                      <td>{trade.date}</td>
                      <td>{trade.transaction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

              {
                <div className="quick-amounts">
                  {tradeType === "buy" ? (
                    useEth && (
                      <>
                        <button onClick={() => setPurchaseAmount("")}>
                          reset
                        </button>
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
                    )
                  ) : (
                    <>
                      <button onClick={() => setPurchaseAmount("")}>
                        reset
                      </button>
                      <button
                        onClick={() =>
                          setPurchaseAmount((balance * 0.25).toString())
                        }
                      >
                        25%
                      </button>
                      <button
                        onClick={() =>
                          setPurchaseAmount((balance * 0.5).toString())
                        }
                      >
                        50%
                      </button>
                      <button
                        onClick={() =>
                          setPurchaseAmount((balance * 0.75).toString())
                        }
                      >
                        75%
                      </button>
                      <button
                        onClick={() => setPurchaseAmount(balance.toString())}
                      >
                        100%
                      </button>
                    </>
                  )}
                </div>
              }

              <div className="estimated-return">
                {purchaseAmount && (
                  <span>
                    {tradeType === "sell"
                      ? `${getEthAmountReceived(purchaseAmount)} ETH`
                      : useEth
                      ? `${getTokenAmountBought(purchaseAmount)} ${
                          tokenData.symbol
                        }`
                      : `${getExactTokenAmountForBuying(purchaseAmount)} ETH`}
                  </span>
                )}
              </div>

              <button
                className="place-trade-btn"
                onClick={() => {
                  if (tradeType === "buy") {
                    if (useEth) {
                      handlePurchase();
                    } else {
                      handlePurchaseToken();
                    }
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
                {/* <button className="bubble-map-btn">generate bubble map</button> */}
              </div>
              <div className="holder-list">
                {holderDistributionData.map((holder, index) => (
                  <div key={index} className="holder-item">
                    <span className="holder-rank">{index + 1}.</span>
                    <span className="holder-address">{holder.address}</span>
                    {holder.holder_type === "BONDING_CURVE" && (
                      <span className="holder-type">👑 (bonding curve)</span>
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

      <CommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePostComment}
      />
    </div>
  );
};

export default TokenDetail;
