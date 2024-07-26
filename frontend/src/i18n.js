import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      Home: "Home",
      "Welcome to the Calcetto App!": "Welcome to the Calcetto App!",
      "Match History": "Match History",
      Profile: "Profile",
      "Player Stats": "Player Stats",
      "Vote Match": "Vote Match",
      "Load Match": "Load Match",
      Date: "Date",
      Players: "Players",
      White: "White",
      Black: "Black",
      Result: "Result",
      Submit: "Submit",
      "You can select up to 10 players only.":
        "You can select up to 10 players only.",
      "You must select exactly 10 players.":
        "You must select exactly 10 players.",
      "Match information loaded successfully":
        "Match information loaded successfully",
      "Vote the players performances": "Vote the players performances",
      "Submit Votes": "Submit Votes",
      "Loading...": "Loading...",
      "You didn't participate in this match":
        "You didn't participate in this match",
      "You already voted for this match": "You already voted for this match",
      "Error fetching the last match": "Error fetching the last match",
      "Ratings submitted successfully": "Ratings submitted successfully",
      "Player Profile": "Player Profile",
      "Create Player Profile": "Create Player Profile",
      Name: "Name",
      "Enter your name": "Enter your name",
      "Avatar URL": "Avatar URL",
      "Enter avatar URL": "Enter avatar URL",
      "Save Profile": "Save Profile",
      "Edit Profile": "Edit Profile",
      Cancel: "Cancel",
      "Failed to load profile. Please try again.":
        "Failed to load profile. Please try again.",
      "Failed to save profile. Please try again.":
        "Failed to save profile. Please try again.",
      "Loading player statistics...": "Loading player statistics...",
      "Failed to fetch player statistics": "Failed to fetch player statistics",
      "Error fetching player statistics": "Error fetching player statistics",
      "Matches Played": "Matches Played",
      Wins: "Wins",
      Losses: "Losses",
      Draws: "Draws",
      Goals: "Goals",
      Assists: "Assists",
      Performance: "Performance",
      "N/A": "N/A",
      "The performance calculation for this player is not yet reliable as it is based on too few ratings.":
        "The performance calculation for this player is not yet reliable as it is based on too few ratings.",
      "Failed to fetch matches": "Failed to fetch matches",
      Error: "Error",
    },
  },
  it: {
    translation: {
      Home: "Home",
      "Welcome to the Calcetto App!": "Benvenuto nell'App Calcetto!",
      "Match History": "Cronologia Partite",
      Profile: "Profilo",
      "Player Stats": "Statistiche Giocatori",
      "Vote Match": "Vota Partita",
      "Load Match": "Carica Partita",
      Date: "Data",
      Players: "Giocatori",
      White: "Bianchi",
      Black: "Neri",
      Result: "Risultato",
      Submit: "Invia",
      "You can select up to 10 players only.":
        "Puoi selezionare solo fino a 10 giocatori.",
      "You must select exactly 10 players.":
        "Devi selezionare esattamente 10 giocatori.",
      "Match information loaded successfully":
        "Informazioni sulla partita caricate con successo",
      "Vote the players performances": "Vota le prestazioni dei giocatori",
      "Submit Votes": "Invia Voti",
      "Loading...": "Caricamento...",
      "You didn't participate in this match":
        "Non hai partecipato a questa partita",
      "You already voted for this match": "Hai già votato per questa partita",
      "Error fetching the last match":
        "Errore nel recupero dell'ultima partita",
      "Ratings submitted successfully": "Valutazioni inviate con successo",
      "Player Profile": "Profilo Giocatore",
      "Create Player Profile": "Crea Profilo Giocatore",
      Name: "Nome",
      "Enter your name": "Inserisci il tuo nome",
      "Avatar URL": "URL Avatar",
      "Enter avatar URL": "Inserisci URL avatar",
      "Save Profile": "Salva Profilo",
      "Edit Profile": "Modifica Profilo",
      Cancel: "Annulla",
      "Failed to load profile. Please try again.":
        "Caricamento del profilo fallito. Per favore riprova.",
      "Failed to save profile. Please try again.":
        "Salvataggio del profilo fallito. Per favore riprova.",
      "Loading player statistics...": "Caricamento statistiche giocatori...",
      "Failed to fetch player statistics":
        "Recupero delle statistiche del giocatore fallito",
      "Error fetching player statistics":
        "Errore nel recupero delle statistiche del giocatore",
      "Matches Played": "Partite Giocate",
      Wins: "Vittorie",
      Losses: "Sconfitte",
      Draws: "Pareggi",
      Goals: "Gol",
      Assists: "Assist",
      Performance: "Performance",
      "N/A": "N/D",
      "The performance calculation for this player is not yet reliable as it is based on too few ratings.":
        "Il calcolo della performance di questo giocatore non è ancora affidabile in quanto si basa su troppe poche votazioni.",
      "Failed to fetch matches": "Recupero delle partite fallito",
      Error: "Errore",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
