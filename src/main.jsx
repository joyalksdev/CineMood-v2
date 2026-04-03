import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { UserProvider } from "./context/UserContext";
import { WatchlistProvider } from "./context/WatchlistContext";
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <BrowserRouter>
      {/*
          - UserProvider: Manages the global login state (JWT check, profile).
          - WatchlistProvider: Keeps the movie collection in sync across all components.
          - HelmetProvider: Handles dynamic <head> tags for SEO and page titles.
      */}
      <UserProvider>
        <WatchlistProvider>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </WatchlistProvider>
      </UserProvider>
    </BrowserRouter>
);