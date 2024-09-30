import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import NavigableRow from "./NavigableRows";
import { avatarOptions } from "./Costants";

const AvatarSelector = ({ avatar, setAvatar }) => {
  const { t } = useTranslation();
  const [avatarStartIndex, setAvatarStartIndex] = useState(0);

  return (
    <Form.Group className="mb-4">
      <Form.Label>{t("Select Avatar")}</Form.Label>
      <NavigableRow
        options={avatarOptions}
        selectedItem={avatar}
        onSelect={setAvatar}
        startIndex={avatarStartIndex}
        setStartIndex={setAvatarStartIndex}
        itemKey="avatar"
      />
    </Form.Group>
  );
};

export default AvatarSelector;
