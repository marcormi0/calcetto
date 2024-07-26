import React from "react";
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation();

  return (
    <div className="container unselectable">
      <h2>{t("Home")}</h2>
      <p>{t("Welcome to the Calcetto App!")}</p>
    </div>
  );
}

export default Home;
