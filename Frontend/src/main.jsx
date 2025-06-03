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
import AdminLayout from "./Admin/AdminLayout.jsx";
import PageNotFound from "./Admin/PageNotFound.jsx";
import Dashboard from "./Admin/Dashboard.jsx";
axios.defaults.baseURL = "http://localhost:3000";



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/user", element: <UserDashboard /> },


    ],
  }, {
    path: "/",
    element:<AdminLayout/>,
    children:[
      {path: "/da", element: <Dashboard/>},
      {path: "*", element: <PageNotFound/>},
    ]
  }
  
]);

const root = createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
