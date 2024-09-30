import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import NavigableRow from "./NavigableRows";
import { accessoryOptions } from "./Costants";
import { isAccessoryAvailable } from "./ProfileUtils";

const AccessorySelector = ({ accessories, setAccessories, playerStats }) => {
  const { t } = useTranslation();
  const [accessoryStartIndex, setAccessoryStartIndex] = useState(0);

  // Effect to remove unavailable accessories on mount or playerStats change
  useEffect(() => {
    const availableAccessories = accessories.filter((acc) =>
      isAccessoryAvailable(
        accessoryOptions.find((opt) => opt.src === acc),
        playerStats
      )
    );
    if (availableAccessories.length !== accessories.length) {
      setAccessories(availableAccessories);
    }
  }, [playerStats, accessories, setAccessories]);

  const handleSelectAccessory = (accSrc) => {
    const selectedAccessory = accessoryOptions.find(
      (opt) => opt.src === accSrc
    );

    if (!isAccessoryAvailable(selectedAccessory, playerStats)) {
      alert(t("This accessory is not available for your current stats."));
      return;
    }

    setAccessories((prev) => {
      // Get the category of the selected accessory
      const category = selectedAccessory.category;

      // Filter out any accessory from the same category
      const filteredAccessories = prev.filter((a) => {
        const accessory = accessoryOptions.find((opt) => opt.src === a);
        return accessory.category !== category;
      });

      // If already selected, deselect it; otherwise, add it to the filtered list
      return prev.includes(accSrc)
        ? filteredAccessories
        : [...filteredAccessories, accSrc];
    });
  };

  return (
    <Form.Group className="mb-4">
      <Form.Label>{t("Select Accessories")}</Form.Label>
      <NavigableRow
        options={accessoryOptions}
        selectedItem={accessories}
        onSelect={handleSelectAccessory}
        startIndex={accessoryStartIndex}
        setStartIndex={setAccessoryStartIndex}
        itemKey="accessory"
        multiple={true}
        isItemAvailable={(item) => isAccessoryAvailable(item, playerStats)}
      />
    </Form.Group>
  );
};

export default AccessorySelector;
