import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// import { ChakraProvider } from '@chakra-ui/react';

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'

import theme from './theme/theme.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
