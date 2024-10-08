import React, { useState } from "react";
import NavigableRow from "./NavigableRows";
import { avatarOptions } from "./Costants";

const AvatarSelector = ({ avatar, setAvatar }) => {
  const [avatarStartIndex, setAvatarStartIndex] = useState(0);

  return (
    <>
      <NavigableRow
        options={avatarOptions}
        selectedItem={avatar}
        onSelect={setAvatar}
        startIndex={avatarStartIndex}
        setStartIndex={setAvatarStartIndex}
        itemKey="avatar"
      />
    </>
  );
};

export default AvatarSelector;
