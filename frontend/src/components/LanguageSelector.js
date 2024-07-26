// src/components/LanguageSelector.js
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Flag from "react-flagkit";
import "./LanguageSelector.css";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const getCurrentFlag = () => {
    return i18n.language === "en" ? "US" : "IT";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="language-selector" ref={dropdownRef}>
      <button className="language-toggle" onClick={() => setIsOpen(!isOpen)}>
        <Flag
          country={getCurrentFlag()}
          style={{ width: "20px", height: "20px" }}
        />
      </button>
      {isOpen && (
        <div className="language-dropdown">
          <button
            onClick={() => changeLanguage("en")}
            className="language-option"
          >
            <Flag country="US" style={{ width: "20px", height: "20px" }} />
            <span>English</span>
          </button>
          <button
            onClick={() => changeLanguage("it")}
            className="language-option"
          >
            <Flag country="IT" style={{ width: "20px", height: "20px" }} />
            <span>Italiano</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
