import React, { useState } from "react";
import NavigableRow from "./NavigableRows";
import { flagOptions } from "./Costants";
import { isFlagAvailable } from "./ProfileUtils";

const FlagSelector = ({ selectedFlag, setSelectedFlag, playerStats }) => {
  const [flagStartIndex, setFlagStartIndex] = useState(0);

  const handleSelectFlag = (flagSrc) => {
    if (flagSrc === selectedFlag) {
      setSelectedFlag(null);
    } else {
      setSelectedFlag(flagSrc);
    }
  };

  return (
    <>
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
    </>
  );
};

export default FlagSelector;
