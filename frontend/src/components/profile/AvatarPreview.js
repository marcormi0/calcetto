import React from "react";
import { Image } from "react-bootstrap";

const AvatarPreview = ({ avatar, accessories, selectedFlag }) => (
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
          zIndex: 1, // Lower z-index for background flag
        }}
      />
    )}
    <Image
      src={avatar}
      alt="Avatar"
      style={{
        position: "relative", // Relative to ensure it's above the flag
        width: "200px",
        height: "200px",
        objectFit: "cover",
        zIndex: 2, // Higher z-index for avatar
      }}
    />
    {accessories.map((accSrc, index) => (
      <Image
        key={index}
        src={accSrc}
        alt="Accessory"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          zIndex: 3, // Highest z-index for accessories
        }}
      />
    ))}
  </div>
);

export default AvatarPreview;
