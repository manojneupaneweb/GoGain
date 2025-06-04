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
import UserProfile from "./Pages/Users/UserProfile.jsx";
import MyProduct from "./Pages/Users/MyProduct.jsx";
import UserSetting from "./Pages/Users/UserSetting.jsx";
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
      { path: "*", element: <PageNotFound1 /> },

      /// user routes 
      { path: "/profile", element: <UserProfile /> },
      { path: "/dashboard", element: <UserDashboard /> },
      { path: "/myproduct", element: <MyProduct /> },
      { path: "/setting", element: <UserSetting /> },

    ],
  }, {
    path: "/",
    element: <AdminLayout />,
    children: [
      { path: "/da", element: <Dashboard /> },
      { path: "*", element: <PageNotFound /> },
    ]
  }

]);

const root = createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
