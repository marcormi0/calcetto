// src/i18n.js
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
      White: "Bianco",
      Black: "Nero",
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
