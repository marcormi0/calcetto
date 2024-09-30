import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import NavigableRow from "./NavigableRows";
import { flagOptions } from "./Costants";
import { isFlagAvailable } from "./ProfileUtils";

const FlagSelector = ({ selectedFlag, setSelectedFlag, playerStats }) => {
  const { t } = useTranslation();
  const [flagStartIndex, setFlagStartIndex] = useState(0);

  // Function to handle flag selection and deselection
  const handleSelectFlag = (flagSrc) => {
    if (flagSrc === selectedFlag) {
      // Deselect flag if the same flag is selected again
      setSelectedFlag(null);
    } else {
      setSelectedFlag(flagSrc);
    }
  };

  return (
    <Form.Group className="mb-4">
      <Form.Label>{t("Select Flag")}</Form.Label>
      <NavigableRow
        options={flagOptions}
        selectedItem={selectedFlag}
        onSelect={handleSelectFlag}
        startIndex={flagStartIndex}
        setStartIndex={setFlagStartIndex}
        itemKey="flag"
        multiple={false}
        isItemAvailable={(item) => isFlagAvailable(item, playerStats)}
      />
    </Form.Group>
  );
};

export default FlagSelector;
