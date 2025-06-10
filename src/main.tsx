import React from 'react'
import ReactDOM from 'react-dom/client'
import '../src/shared/assets/main.css'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './app/routes/router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
   <RouterProvider router={router} />
  </React.StrictMode>,
) 