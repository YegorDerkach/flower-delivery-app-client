import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


import { CartProvider } from "./context/CartContext";

const queryClient = new QueryClient();

const rootElement = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  React.createElement(React.StrictMode, null,
  React.createElement(BrowserRouter, null,
  React.createElement(QueryClientProvider, { client: queryClient },
  React.createElement(CartProvider, null,
  React.createElement(App, null)
  )
  )
  )
  )
);