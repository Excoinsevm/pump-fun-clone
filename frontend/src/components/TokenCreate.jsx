import React, { useState, useCallback } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { abi } from "./abi";
import { ethers } from "ethers";
import CONFIG from "../config";
import { useEthersSigner } from "../ethers";
import upload from "./upload.svg";
import BeatLoader from "react-spinners/BeatLoader";

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
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
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
    setErrors({ ...errors, file: "" });

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
    setErrors({ ...errors, file: "" });
  };

  const handleCreate = async () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!ticker.trim()) newErrors.ticker = "Symbol is required";
    if (!file) newErrors.file = "Image or video is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      // First, upload the file
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const uploadResponse = await fetch(`${CONFIG.API_URL}/upload/`, {
        method: "POST",
        body: uploadFormData,
      });
      const uploadData = await uploadResponse.json();

      const contract = new ethers.Contract(
        CONFIG.CONTRACT_ADDRESS,
        abi,
        signer
      );

      const transaction = await contract.createAndBuyToken(name, ticker, {
        value: ethers.utils.parseUnits("0.0001", "ether"),
      });
      const receipt = await transaction.wait();
      console.log("receipt", receipt);
      
      // Find TokenCreated event and extract contract address
      const tokenCreatedEvent = receipt.events.find(
        event => event.eventSignature === "TokenCreated(address,address,uint256)"
      );
      console.log("event", tokenCreatedEvent);
      const contractAddress = tokenCreatedEvent ? tokenCreatedEvent.args[0] : null;
      console.log("address", contractAddress);
      // Then create the token with the file URL and contract address
      const tokenData = {
        name: name,
        symbol: ticker,
        description: description,
        twitter_url: twitter,
        telegram_url: telegram,
        website: website,
        logo_url: uploadData.url,
        contract_address: contractAddress,
        owner_address: signer._address,
      };

      const response = await fetch(`${CONFIG.API_URL}/tokens/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tokenData),
      });
      
      const data = await response.json();
      console.log("Token created:", data);
      
      alert(`Transaction successful! Hash: ${receipt.blockHash}`);
      navigate("/");
      
    } catch (error) {
      console.error("Error creating token:", error);
      alert("Failed to create token. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="token-create-page">
      <div className="token-create-container">
        <h3 className="start-new-coin" onClick={() => navigate("/")}>
          [go back]
        </h3>
        <div className="input-container">
          <label className="input-label">
            name <span className="required">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors({ ...errors, name: "" });
            }}
            className={`input-field ${errors.name ? "error-field" : ""}`}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}

          <label className="input-label">
            symbol <span className="required">*</span>
          </label>
          <input
            type="text"
            value={ticker}
            onChange={(e) => {
              setTicker(e.target.value);
              setErrors({ ...errors, ticker: "" });
            }}
            className={`input-field ${errors.ticker ? "error-field" : ""}`}
          />
          {errors.ticker && (
            <span className="error-message">{errors.ticker}</span>
          )}

          <label className="input-label">description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
          />

          <label className="input-label">
            Image or video <span className="required">*</span>
          </label>
          <div
            className={`file-drop-zone ${isDragging ? "dragging" : ""} ${
              errors.file ? "error-field" : ""
            }`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="file-drop-content">
              <span className="upload-icon">
                <img src={upload} alt="Logo" />
              </span>
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
          {errors.file && <span className="error-message">{errors.file}</span>}

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
            {isLoading ? (
              <BeatLoader size={10} color={"#fff"} />
            ) : (
              "create coin"
            )}
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
