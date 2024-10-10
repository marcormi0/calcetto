import React from "react";
import { Card } from "react-bootstrap";
import { useMediaQuery } from "../utils/useMediaQuery.js";

const SoccerFieldTeams = ({ team1, team2 }) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isSmallDesktop = useMediaQuery("(max-width: 1200px)");

  const PlayerAvatar = ({ player, position }) => (
    <div
      style={{
        position: "absolute",
        ...position,
        width: isMobile ? "45px" : isSmallDesktop ? "70px" : "140px",
        height: isMobile ? "45px" : isSmallDesktop ? "70px" : "150px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {player.flag && (
          <img
            src={player.flag}
            alt="Flag"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 1,
              borderRadius: "5%",
            }}
          />
        )}
        <img
          src={player.avatar}
          alt={player.name}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 2,
            borderRadius: "15%",
          }}
        />
        {player.accessories &&
          player.accessories.map((accSrc, index) => (
            <img
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
                zIndex: 3,
              }}
            />
          ))}
      </div>
      <div
        style={{
          color: "black",
          textAlign: "center",
          textTransform: "uppercase",
          fontSize: isMobile ? "8px" : isSmallDesktop ? "13px" : "20px",
          fontWeight: "bold",
          marginTop: "2px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: isMobile ? "50px" : isSmallDesktop ? "70px" : "150px",
        }}
      >
        {player.name}
      </div>
    </div>
  );

  const getPositions = (teamSide) => {
    if (isMobile) {
      return [
        { [teamSide]: "2%", top: "40%" },
        { [teamSide]: "17%", top: "40%" },
        { [teamSide]: "26%", top: "15%" },
        { [teamSide]: "26%", top: "70%" },
        { [teamSide]: "36%", top: "40%" },
      ];
    } else {
      return [
        { [teamSide]: "2%", top: "40%" },
        { [teamSide]: "17%", top: "40%" },
        { [teamSide]: "26%", top: "10%" },
        { [teamSide]: "26%", top: "70%" },
        { [teamSide]: "36%", top: "40%" },
      ];
    }
  };

  const team1Positions = getPositions("left");
  const team2Positions = getPositions("right");

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "54%", // 1,85:1 aspect ratio
          backgroundImage: 'url("/soccerfield1e85x1.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {team1.map((player, index) => (
          <PlayerAvatar
            key={player.name}
            player={player}
            position={team1Positions[index]}
          />
        ))}
        {team2.map((player, index) => (
          <PlayerAvatar
            key={player.name}
            player={player}
            position={team2Positions[index]}
          />
        ))}
      </div>
    </Card>
  );
};

export default SoccerFieldTeams;
