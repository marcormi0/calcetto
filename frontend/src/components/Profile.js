// src/components/Profile.js
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchPlayerProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await fetch(`/players/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data != null) {
          setPlayer(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching player profile:", error);
        setLoading(false);
      }
    };

    fetchPlayerProfile();
  }, [user.id]);

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`/players`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id, name, avatar }),
      });

      if (!response.ok) {
        throw new Error("Failed to save player profile");
      }

      const data = await response.json();
      setPlayer(data.player);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving player profile:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!player) {
    return (
      <div>
        <h2>Create Player Profile</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Avatar URL"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
        />
        <button onClick={handleSaveProfile}>Save Profile</button>
      </div>
    );
  } else {
    return (
      <div>
        <h2>Player Profile</h2>
        {isEditing ? (
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Avatar URL"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
            <button onClick={handleSaveProfile}>Save Profile</button>
          </div>
        ) : (
          <div>
            <p>Name: {player.name}</p>
            <p>
              Avatar: <img src={player.avatar} alt="Avatar" />
            </p>
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          </div>
        )}
      </div>
    );
  }
};

export default Profile;
