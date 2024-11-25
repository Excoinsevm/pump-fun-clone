import React, { useState, useEffect } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { abi } from "./abi";
import CONFIG from "../config";
import { useEthersSigner } from "../ethers";
import { useAccount } from "wagmi";

const CardSkeleton = () => (
  <div className="card skeleton">
    <div className="card-content">
      <div className="skeleton-image"></div>
      <div className="skeleton-text">
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
      </div>
    </div>
  </div>
);

const App = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { connector } = useAccount();
  const signer = useEthersSigner();
  const provider = new ethers.providers.JsonRpcProvider(CONFIG.RPC_URL);
  const factoryContract = new ethers.Contract(
    CONFIG.CONTRACT_ADDRESS,
    abi,
    provider
  );
  const [sortOption, setSortOption] = useState("featured");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    const fetchMemeTokens = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${CONFIG.API_URL}/tokens`);
        const tokens = await response.json();

        setCards(
          tokens.map((token) => ({
            name: token.name || "",
            symbol: token.symbol || "",
            description: token.description || "",
            tokenImageUrl: token.logo_url || "https://pump.mypinata.cloud/ipfs/Qmf89h3H1LZ3DPmyYREtTs2wpSCZcnA961tQtwVh4Cp1vC?img-width=256&img-dpr=2&img-onerror=redirect",
            fundingRaised: "0", // You might want to add this field to your API response
            tokenAddress: token.contract_address || "",
            creatorAddress: token.owner_address || "",
            createdAt: token.created_at,
          }))
        );
      } catch (error) {
        console.error("Error fetching tokens:", error);
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
      <div className="card-container">
        <h3
          className="start-new-coin"
          onClick={() => navigate("/token-create")}
        >
          [start a new coin]
        </h3>
        {cards.length > 0 ? (
          <>
            <img
              src="https://pump.fun/_next/image?url=%2Fking-of-the-hill.png&w=256&q=75"
              alt="Start a new coin"
              className="start-new-image"
            />

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
          </>
        ) : (
          <>
            <div className="start-new-image-skeleton"></div>
            <div className="main-card">
              <CardSkeleton />
            </div>
          </>
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

        <div className="sort-container">
          <div
            className="sort-dropdown"
            onClick={() => setShowSortDropdown(!showSortDropdown)}
          >
            <span className="sort-text">
              sort: {sortOption} {sortOption === "featured" && "🔥"}
            </span>
            <span className="dropdown-arrow">▼</span>
          </div>

          {showSortDropdown && (
            <div className="sort-options">
              <div
                className={`sort-option ${
                  sortOption === "featured" ? "active" : ""
                }`}
                onClick={() => {
                  setSortOption("featured");
                  setShowSortDropdown(false);
                }}
              >
                featured 🔥
              </div>
              <div
                className={`sort-option ${
                  sortOption === "newest" ? "active" : ""
                }`}
                onClick={() => {
                  setSortOption("newest");
                  setShowSortDropdown(false);
                }}
              >
                newest
              </div>
              <div
                className={`sort-option ${
                  sortOption === "oldest" ? "active" : ""
                }`}
                onClick={() => {
                  setSortOption("oldest");
                  setShowSortDropdown(false);
                }}
              >
                oldest
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="card-list">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
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
