import React from "react";
import { Image } from "react-bootstrap";
import { accessoryOptions } from "./Costants";

const AvatarPreview = ({ avatar, accessories, selectedFlag }) => {
  // Sort accessories by zIndex
  const sortedAccessories = accessories
    .map((accSrc) => {
      const accessory = accessoryOptions.find((opt) => opt.src === accSrc);
      return { src: accSrc, zIndex: accessory ? accessory.zIndex : 0 };
    })
    .sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      style={{
        position: "relative",
        width: "200px",
        height: "200px",
        margin: "0 auto 2rem",
        border: "1px solid #dee2e6",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      {selectedFlag && (
        <Image
          src={selectedFlag}
          alt="Flag"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 1,
          }}
        />
      )}
      <Image
        src={avatar}
        alt="Avatar"
        style={{
          position: "relative",
          width: "200px",
          height: "200px",
          objectFit: "cover",
          zIndex: 2,
        }}
      />
      {sortedAccessories.map((acc, index) => (
        <Image
          key={index}
          src={acc.src}
          alt="Accessory"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            zIndex: acc.zIndex + 3, // Add 3 to ensure accessories are always above the avatar
          }}
        />
      ))}
    </div>
  );
};

export default AvatarPreview;
