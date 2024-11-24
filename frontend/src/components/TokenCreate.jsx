import React, { useState, useCallback } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { abi } from "./abi";
import { ethers } from "ethers";
import CONFIG from "../config";
import { useEthersSigner } from "../ethers";
import upload from "./upload.svg";

const TokenCreate = () => {
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [twitter, setTwitter] = useState("");
  const [telegram, setTelegram] = useState("");
  const [website, setWebsite] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const navigate = useNavigate();
  const signer = useEthersSigner();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleCreate = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("ticker", ticker);
    formData.append("description", description);
    formData.append("twitter", twitter);
    formData.append("telegram", telegram);
    formData.append("website", website);
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch("/token/create", {
        method: "POST",
        body: formData,
      });
      const contract = new ethers.Contract(
        CONFIG.CONTRACT_ADDRESS,
        abi,
        signer
      );

      const transaction = await contract.createAndBuyToken(name, ticker, {
        value: ethers.utils.parseUnits("0.0001", "ether"),
      });
      const receipt = await transaction.wait();

      alert(`Transaction successful! Hash: ${receipt.hash}`);
      navigate("/");
    } catch (error) {
      console.error("Error creating token:", error);
      alert("Failed to create token. Please try again.");
    }
  };

  return (
    <div className="token-create-page">
      <div className="token-create-container">
        <h3 className="start-new-coin" onClick={() => navigate("/")}>
          [go back]
        </h3>
        {/* <p className="info-text">MemeCoin creation fee: 0.0001 ETH</p>
        <p className="info-text">
          Max supply: 1 million tokens. Initial mint: 200k tokens.
        </p>
        <p className="info-text">
          If funding target of 24 ETH is met, a liquidity pool will be created
          on Uniswap.
        </p> */}
        <div className="input-container">
          <label className="input-label">name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />
          <label className="input-label">symbol</label>
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="input-field"
          />
          <label className="input-label">description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
          />
          <label className="input-label">Image or video</label>
          <div
            className={`file-drop-zone ${isDragging ? "dragging" : ""}`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="file-drop-content">
              <span className="upload-icon"><img src={upload} alt="Logo" /></span>
              <p>drag and drop an image or video</p>
              <input
                type="file"
                id="file-input"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
              <label htmlFor="file-input" className="select-file-button">
                select file
              </label>
              {file && <p className="selected-file">Selected: {file.name}</p>}
            </div>
          </div>
          <div className="social-links-section">
            <div
              className="social-links-header"
              onClick={() => setShowSocialLinks(!showSocialLinks)}
            >
              <span className="toggle-icon">{showSocialLinks ? "−" : "+"}</span>
              <span>Show more options</span>
            </div>

            {showSocialLinks && (
              <div className="social-links-inputs">
                <label className="input-label">twitter link</label>
                <input
                  type="text"
                  placeholder="(Optional)"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className="input-field"
                />
                <label className="input-label">telegram link</label>
                <input
                  type="text"
                  placeholder="(Optional)"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  className="input-field"
                />
                <label className="input-label">website</label>
                <input
                  type="text"
                  placeholder="(Optional)"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="input-field"
                />
                <p className="info-text">
                tip: coin data cannot be changed after creation
                </p>
              </div>
            )}
          </div>
          <button className="create-button" onClick={handleCreate}>
            create coin
          </button>
          <p className="info-text">
            when your coin completes its bonding curve you receive 0.1 ETH
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenCreate;
