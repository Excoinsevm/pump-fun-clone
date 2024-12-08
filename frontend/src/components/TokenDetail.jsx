import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import "../App.css";
import { abi } from "./abi";
import { tokenAbi } from "./tokenAbi";
import CONFIG from "../config";
import { useEthersSigner } from "../ethers";
import BeatLoader from "react-spinners/BeatLoader";
import { useAccount, useBalance } from "wagmi";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import heart from "./heart.svg";
import info from "./info.svg";
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
  const ethBalance = useBalance({ address: account.address, uint: "ether" });
  const [isLoading, setIsLoading] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTooltip2, setShowTooltip2] = useState(false);

  const [remainingTokens, setRemainingTokens] = useState("0");
  const [fundingRaised, setFundingRaised] = useState(0);
  const [totalSupply, setTotalSupply] = useState("0");
  const [balance, setBalance] = useState("0");
  const [ethReserve, setEthReserve] = useState(0);
  const [tokenReserve, setTokenReserve] = useState(0);

  const [holderDistributionData, setHolderDistributionData] = useState([]);
  const [repliesData, setRepliesData] = useState([]);

  // Constants
  const fundingGoal = 5;
  const maxSupply = parseInt(1_000_000_000);
  const fundingSupply = parseInt(800_000_000);

  const [activeTab, setActiveTab] = useState("thread");

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample data for trades (replace with actual data fetching logic)
  const tradesData = [
    // {
    //   account: "FUatjT",
    //   type: "buy",
    //   eth: 0.5,
    //   idp: "9.49m",
    //   date: "16s ago",
    //   transaction: "4b38j3",
    // },
    // {
    //   account: "d16xMV",
    //   type: "buy",
    //   eth: 0.21,
    //   idp: "4.06m",
    //   date: "25s ago",
    //   transaction: "5MYibQ",
    // },
    // {
    //   account: "d16xMV",
    //   type: "sell",
    //   eth: 0.21,
    //   idp: "4.06m",
    //   date: "25s ago",
    //   transaction: "5MYibQ",
    // },
    // ... more trades
  ];

  // Sample replies data
  // const repliesData = [
  //   {
  //     avatar:
  //       "https://pump.mypinata.cloud/ipfs/QmeSzchzEPqCU1jwTnsipwcBAeH7S4bmVvFGfF65iA1BY1?img-width=16&img-dpr=2&img-onerror=redirect",
  //     name: "DDKrich",
  //     reply_time: "2:04:05 PM",
  //     likes: 7,
  //     content: "seems legit",
  //   },
  // ];

  // Sample holder distribution data
  // const holderDistributionData = [
  //   { address: "9qP5Uv", percentage: 29.5, holder_type: "BONDING_CURVE" },
  // ];

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
        setHolderDistributionData(data.holders);
        setRepliesData(data.comments);
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
    let commentData = {
      message: comment,
      user_address: signer._address,
      token_id: tokenData.id,
    };

    if (file) {
      // First, upload the file
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const uploadResponse = await fetch(`${CONFIG.API_URL}/upload/`, {
        method: "POST",
        body: uploadFormData,
      });
      const uploadData = await uploadResponse.json();
      commentData.img_url = uploadData.url;
    }

    try {
      const response = await fetch(
        `${CONFIG.API_URL}/tokens/${tokenAddress}/comments/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(commentData),
        }
      );
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

  function keepFirstAndLastFourChars(str) {
    if (str.length <= 8) {
      return str; // Return the original string if it's 8 characters or less
    }
    return str.slice(0, 8) + "..." + str.slice(-6); // Concatenate first 4 and last 4 characters
  }

  return (
    <div className="token-detail-page">
      <div className="token-detail-page-container">
        <h3 className="back-button" onClick={() => navigate("/")}>
          [go back]
        </h3>

        <div className="token-detail-header">
          <div>
            {tokenData.name}({tokenData.symbol})
          </div>
          <div className="thread-reply-header">
            <img
              src="https://pump.mypinata.cloud/ipfs/QmeSzchzEPqCU1jwTnsipwcBAeH7S4bmVvFGfF65iA1BY1?img-width=16&img-dpr=2&img-onerror=redirect"
              alt="User Avatar"
              className="user-avatar"
            />
            <strong>name</strong>
            <span>3 minutes ago</span>
          </div>
          <div className="text-green">market cap: $7,178</div>
          <div className="text-grey">replies: 2</div>
        </div>

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
                    <strong>{keepFirstAndLastFourChars(tokenData.owner_address)}</strong>
                    <span>{tokenData.created_at.slice(0, 10)}</span>
                  </div>
                  <p>{tokenData.description}</p>
                  <p>this is just a test</p>
                </div>
                {repliesData.map((reply, index) => (
                  <div key={index} className="thread-reply">
                    <div className="thread-reply-header">
                      <img
                        src="https://pump.mypinata.cloud/ipfs/QmeSzchzEPqCU1jwTnsipwcBAeH7S4bmVvFGfF65iA1BY1?img-width=16&img-dpr=2&img-onerror=redirect"
                        alt="User Avatar"
                        className="user-avatar"
                      />
                      <strong>{keepFirstAndLastFourChars(reply.user_address)}</strong>
                      <span>{reply.date_time.slice(0, 10)}</span>
                      <span className="likes">
                        <img src={heart} alt="Icon" width="16" /> {reply.likes}
                      </span>
                      <span className="thread-reply-button">[reply]</span>
                    </div>
                    <div className="thread-reply-content">
                      <div>{reply.message}</div>
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
                <div
                  className={
                    tradeType === "buy"
                      ? "trade-actions"
                      : "trade-actions trade-actions-right"
                  }
                >
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

                <div
                  className={
                    tradeType === "buy" ? "trade-actions" : "trade-actions"
                  }
                >
                  {(tradeType === "buy") & useEth ? (
                    <>
                      <span>amount (ETH)</span>
                      <span>balance: {account.balance} ETH</span>
                    </>
                  ) : (
                    <>
                      <span>amount ({tokenData.symbol})</span>
                      <span>
                        balance: {parseFloat(balance).toFixed(2)}{" "}
                        {tokenData.symbol}
                      </span>
                    </>
                  )}
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
                    <img
                      src="https://pump.fun/_next/image?url=%2Fsolana-logo-square.png&w=64&q=75"
                      className="currency-label-img"
                    ></img>
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
                  <div className="stat-info">
                    <label>
                      bonding curve progress: {fundingRaisedPercentage}%
                    </label>
                    <img
                      src={info}
                      alt="icon"
                      width="16"
                      className="svg-icon"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    />
                    {showTooltip && (
                      <div className="tooltip">
                        when the market cap reaches $98,005 (~411.06 SOL), all
                        the liquidity in the bonding curve will be deposited to
                        raydium and burned. progression increases as more tokens
                        are bought. the bonding curve still has 12.9M tokens
                        available for sale.
                      </div>
                    )}
                  </div>
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
                  <div className="stat-info">
                    <label>
                      king of the hill progress:{" "}
                      {tokenData.king_of_hill_progress}%
                    </label>
                    <img
                      src={info}
                      alt="icon"
                      width="16"
                      className="svg-icon"
                      onMouseEnter={() => setShowTooltip2(true)}
                      onMouseLeave={() => setShowTooltip2(false)}
                    />
                    {showTooltip2 && (
                      <div className="tooltip">
                        when the market cap reaches $47,730, this coin will be
                        pinned to the top of the feed (until dethroned)!
                      </div>
                    )}
                  </div>
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
                      <span className="holder-address">
                        {keepFirstAndLastFourChars(holder.address)}
                      </span>
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
    </div>
  );
};

export default TokenDetail;
