import React from "react";
import { Card } from "react-bootstrap";
import "./SoccerFieldTeams.css";

const SoccerFieldTeams = ({ team1, team2 }) => {
  const PlayerAvatar = ({ player, teamSide, index }) => (
    <div className={`player-avatar ${teamSide} position-${index}`}>
      <div className="avatar-container">
        {player.flag && <img src={player.flag} alt="Flag" className="flag" />}
        <img src={player.avatar} alt={player.name} className="player-image" />
        {player.accessories &&
          player.accessories.map((accSrc, index) => (
            <img
              key={index}
              src={accSrc}
              alt="Accessory"
              className="accessory"
            />
          ))}
      </div>
      <div className="player-name">{player.name}</div>
    </div>
  );

  return (
    <Card className="soccer-field-card">
      <div className="soccer-field">
        {team1.map((player, index) => (
          <PlayerAvatar
            key={player.name}
            player={player}
            teamSide="team1"
            index={index}
          />
        ))}
        {team2.map((player, index) => (
          <PlayerAvatar
            key={player.name}
            player={player}
            teamSide="team2"
            index={index}
          />
        ))}
      </div>
    </Card>
  );
};

export default SoccerFieldTeams;
