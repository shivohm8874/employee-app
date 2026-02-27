// src/App.tsx
import { RouterProvider } from "react-router-dom"
import { router } from "./app/routes"
import InstallPrompt from "./app/InstallPrompt"

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <InstallPrompt />
    </>
  )
}

export default App
