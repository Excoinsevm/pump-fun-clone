import React, { useState, useEffect } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar.jsx";
const { ethers } = require("ethers");
const { abi } = require("./abi");

const App = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
  const factoryContract = new ethers.Contract(
    process.env.REACT_APP_CONTRACT_ADDRESS,
    abi,
    provider
  );

  useEffect(() => {
    const fetchMemeTokens = async () => {
      try {
        const eventFilter = factoryContract.filters.TokenCreated();
        let events = await factoryContract.queryFilter(
          eventFilter,
          1,
          "latest"
        );

        const tokens = await Promise.all(
          events.map(async (e) => {
            const tokenInfo = await getTokenInfo(e.args[0]);
            return {
              tokenAddress: e.args[0],
              creatorAddress: e.args[1],
              ...tokenInfo,
            };
          })
        );
        console.log(tokens);

        setCards(
          tokens.map((token) => ({
            name: token.name || "",
            symbol: token.symbol || "",
            description: token.description || "",
            tokenImageUrl:
              token.tokenImageUrl ||
              "https://pump.mypinata.cloud/ipfs/Qmf89h3H1LZ3DPmyYREtTs2wpSCZcnA961tQtwVh4Cp1vC?img-width=256&img-dpr=2&img-onerror=redirect",
            fundingRaised: ethers.formatUnits(
              token.fundingRaised || 0,
              "ether"
            ), // Format the fundingRaised from Wei to Ether
            tokenAddress: token.tokenAddress || "",
            creatorAddress: token.creatorAddress || "",
          }))
        );
      } catch (error) {
        console.error("Error fetching meme tokens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemeTokens();
  }, []);

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  const navigateToTokenDetail = (card) => {
    navigate(`/token-detail/${card.tokenAddress}`, { state: { card } }); // Use tokenAddress for URL
  };

  async function getTokenInfo(tokenAddress) {
    const erc20Abi = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function decimals() view returns (uint8)",
      "function totalSupply() view returns (uint256)",
    ];
    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);

    const name = await tokenContract.name();
    const symbol = await tokenContract.symbol();
    const decimals = await tokenContract.decimals();
    const totalSupply = await tokenContract.totalSupply();
    return { name, symbol, decimals, totalSupply };
  }

  return (
    <div className="app">
      <NavBar />
      <div className="card-container">
        <h3
          className="start-new-coin"
          onClick={() => navigate("/token-create")}
        >
          [start a new coin]
        </h3>
        <img
          src="https://pump.fun/_next/image?url=%2Fking-of-the-hill.png&w=256&q=75"
          alt="Start a new coin"
          className="start-new-image"
        />

        {cards.length > 0 && (
          <div
            className="card main-card"
            onClick={() => navigateToTokenDetail(cards[0])}
          >
            <div className="card-content">
              <img
                src={cards[0].tokenImageUrl}
                alt={cards[0].name}
                className="card-image"
              />
              <div className="card-text">
                <h2>Created by {cards[0].creatorAddress}</h2>
                <p>Funding Raised: {cards[0].fundingRaised} ETH</p>
                <p>
                  {cards[0].name} (ticker: {cards[0].symbol})
                </p>
                <p>{cards[0].description}</p>
              </div>
            </div>
          </div>
        )}

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="search for token"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>

        <h4 style={{ textAlign: "left", color: "rgb(134, 239, 172)" }}>
          Terminal
        </h4>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="card-list">
            {cards.slice(1).map((card, index) => (
              <div
                key={index}
                className="card"
                onClick={() => navigateToTokenDetail(card)}
              >
                <div className="card-content">
                  <img
                    src={card.tokenImageUrl}
                    alt={card.name}
                    className="card-image"
                  />
                  <div className="card-text">
                    <h2>Created by {card.creatorAddress}</h2>
                    <p>Funding Raised: {card.fundingRaised} ETH</p>
                    <p>
                      {card.name} (ticker: {card.symbol})
                    </p>
                    <p>{card.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
