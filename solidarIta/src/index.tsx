import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";

// 1. import `ChakraProvider` component
import { ChakraProvider } from '@chakra-ui/react'
import {theme} from './assets/styles/theme'

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider  theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
