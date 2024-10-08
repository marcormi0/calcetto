import React from "react";
import { Accordion } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import AvatarSelector from "./AvatarSelector";
import AccessorySelector from "./AccessorySelector";
import FlagSelector from "./FlagSelector";

const CollapsibleSelectors = ({
  avatar,
  setAvatar,
  accessories,
  setAccessories,
  selectedFlag,
  setSelectedFlag,
  playerStats,
}) => {
  const { t } = useTranslation();

  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>{t("Select Avatar")}</Accordion.Header>
        <Accordion.Body>
          <AvatarSelector avatar={avatar} setAvatar={setAvatar} />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>{t("Select Accessories")}</Accordion.Header>
        <Accordion.Body>
          <AccessorySelector
            accessories={accessories}
            setAccessories={setAccessories}
            playerStats={playerStats}
          />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>{t("Select Flag")}</Accordion.Header>
        <Accordion.Body>
          <FlagSelector
            selectedFlag={selectedFlag}
            setSelectedFlag={setSelectedFlag}
            playerStats={playerStats}
          />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default CollapsibleSelectors;
