import { accessoryOptions } from "./Costants";
import { avatarOptions } from "./Costants";
import { flagOptions } from "./Costants";

export const fetchPlayerProfile = async (
  userId,
  setPlayer,
  setName,
  setAvatar,
  setAccessories,
  setSelectedFlag,
  setPlayerStats,
  setLoading,
  setError,
  t
) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`/playerStats/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (response.ok && data) {
      const { accessories = [], ...rest } = data;

      // Filter out unavailable accessories
      const availableAccessories = accessories.filter((acc) =>
        isAccessoryAvailable(
          accessoryOptions.find((opt) => opt.src === acc),
          data.stats
        )
      );

      setPlayer(rest);
      setName(data.name);
      setAvatar(data.avatar || avatarOptions[0]);
      setAccessories(availableAccessories); // Set filtered accessories
      setSelectedFlag(data.flag || null);
      setPlayerStats(data.stats);
    } else {
      throw new Error(data.message || "Failed to fetch player data");
    }
    setLoading(false);
  } catch (error) {
    console.error("Error fetching player profile:", error);
    setError(t("Failed to load profile. Please try again."));
    setLoading(false);
  }
};

export const savePlayerProfile = async (
  name,
  avatar,
  accessories,
  selectedFlag,
  playerStats,
  setPlayer,
  setIsEditing,
  setError,
  t
) => {
  const unavailableAccessories = accessories.filter(
    (acc) =>
      !isAccessoryAvailable(
        accessoryOptions.find((opt) => opt.src === acc),
        playerStats
      )
  );

  if (unavailableAccessories.length > 0) {
    setError(
      t(
        "You've selected accessories that are not yet available. Please remove them before saving."
      )
    );
    return;
  }

  if (
    selectedFlag &&
    !isFlagAvailable(
      flagOptions.find((opt) => opt.src === selectedFlag),
      playerStats
    )
  ) {
    setError(
      t(
        "The selected flag is not yet available. Please play more matches to unlock it."
      )
    );
    return;
  }

  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        avatar,
        accessories,
        flag: selectedFlag,
      }),
    });

    if (!response.ok) {
      throw new Error(t("Failed to save player profile"));
    }

    const data = await response.json();
    setPlayer(data);
    setIsEditing(false);
    setError("");
  } catch (error) {
    console.error("Error saving player profile:", error);
    setError(t("Failed to save profile. Please try again."));
  }
};

export const isAccessoryAvailable = (accessory, playerStats) => {
  if (!playerStats) return false;
  return accessory.criteria(playerStats);
};

export const isFlagAvailable = (flag, playerStats) => {
  if (!playerStats) return false;
  return flag.criteria(playerStats);
};
