// src/components/LanguageSelector.js
import React from "react";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="light" id="dropdown-basic">
        {i18n.language === "en" ? "English" : "Italiano"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => changeLanguage("en")}>
          English
        </Dropdown.Item>
        <Dropdown.Item onClick={() => changeLanguage("it")}>
          Italiano
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageSelector;
