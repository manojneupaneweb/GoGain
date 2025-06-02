import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

// Pages
import Home from "./Pages/Home.jsx";
import UserDashboard from "./Pages/Users/UserDashboard.jsx";


// Set up Axios globally
import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000";



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/user", element: <UserDashboard /> },


    ],
  }, 
  
]);

const root = createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
