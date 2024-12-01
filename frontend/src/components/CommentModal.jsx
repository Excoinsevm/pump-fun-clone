import React, { useState, useEffect } from "react";
import upload from "./upload.svg";

const CommentModal = ({ isOpen, onClose, onSubmit }) => {
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
    setErrors({ ...errors, file: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!comment.trim()) newErrors.comment = "Comment is required";
    if (!file) newErrors.file = "Image is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(comment, file);
    setComment("");
    setFile(null);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setComment(""); // Reset comment
      setFile(null); // Reset image
    }
  }, [isOpen]);

  if (!isOpen) return null;

  //   const handleDrag = useCallback((e) => {
  //     e.preventDefault();
  //     e.stopPropagation();
  //   }, []);

  //   const handleDragIn = useCallback((e) => {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     setIsDragging(true);
  //   }, []);

  //   const handleDragOut = useCallback((e) => {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     setIsDragging(false);
  //   }, []);

  //   const handleDrop = useCallback((e) => {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     setIsDragging(false);
  //     setErrors({ ...errors, file: "" });

  //     const files = e.dataTransfer.files;
  //     if (files && files.length > 0) {
  //       setFile(files[0]);
  //     }
  //   }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add a comment</h3>
        <textarea
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            setErrors({ ...errors, comment: "" });
          }}
          placeholder="comment"
          required
          className="input-field"
        />
        {errors.comment && (
          <span className="error-message">{errors.comment}</span>
        )}
        <label className="input-label">Image (Optional)</label>
        <div
          className={`file-drop-zone ${isDragging ? "dragging" : ""} ${
            errors.file ? "error-field" : ""
          }`}
          // onDragEnter={handleDragIn}
          // onDragLeave={handleDragOut}
          // onDragOver={handleDrag}
          // onDrop={handleDrop}
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
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <label htmlFor="file-input" className="select-file-button">
              select file
            </label>
            {file && <p className="selected-file">Selected: {file.name}</p>}
          </div>
        </div>
        {errors.file && <span className="error-message">{errors.file}</span>}

        <button className="post-reply-btn" onClick={handleSubmit}>
          Post Reply
        </button>
        <label
          className="input-label text-center cursor-pointer"
          onClick={onClose}
        >
          [Cancel]
        </label>
      </div>
    </div>
  );
};

export default CommentModal;
