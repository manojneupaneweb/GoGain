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
import AdminLayout from "./Pages/Admin/AdminLayout.jsx";
import PageNotFound from "./Pages/Admin/PageNotFound.jsx";
import PageNotFound1 from "./Pages/PageNotFound.jsx";
import Dashboard from "./Pages/Admin/Dashboard.jsx";
import Contact from "./Pages/Contact.jsx";
import Pricing from "./Pages/Pricing.jsx";
import About from "./Pages/About.jsx";
axios.defaults.baseURL = "http://localhost:3000";



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/user", element: <UserDashboard /> },
      { path: "/about", element: <About /> },
      { path: "/pricing", element: <Pricing /> },
      { path: "/contact", element: <Contact /> },


      {path: "*", element: <PageNotFound1/>},


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
