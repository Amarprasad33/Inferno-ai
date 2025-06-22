import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the auto generated route tree
import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree })

// Registering the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root');
if(!rootElement?.innerHTML){
  const root = ReactDOM.createRoot(rootElement!);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  )
}

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
