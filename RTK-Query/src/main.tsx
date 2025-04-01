import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// import { store } from './store/store.ts'
// import { Provider } from 'react-redux'


import { ApiProvider } from '@reduxjs/toolkit/query/react'

import { productsApi } from './slice/ApiSlice.ts'
import React from 'react'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ApiProvider api={productsApi}>
        <App />
      </ApiProvider>
    </React.StrictMode>,
)
