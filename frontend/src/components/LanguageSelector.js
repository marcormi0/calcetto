import React from "react";
import { useTranslation } from "react-i18next";
import Flag from "react-flagkit";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: "en", country: "US", name: "English" },
    { code: "it", country: "IT", name: "Italiano" },
    // Add more languages here if needed
  ];

  const changeLanguage = () => {
    const currentIndex = languages.findIndex(
      (lang) => lang.code === i18n.language
    );
    const nextIndex = (currentIndex + 1) % languages.length;
    i18n.changeLanguage(languages[nextIndex].code);
  };

  const currentLang =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <button
      onClick={changeLanguage}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
      }}
    >
      <Flag
        country={currentLang.country}
        style={{ width: "20px", height: "20px" }}
      />
    </button>
  );
};

export default LanguageSelector;
