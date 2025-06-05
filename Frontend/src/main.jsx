// index.jsx or main.jsx

import React from "react";
import { createRoot } from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

// Public Pages
import Home from "./Pages/Home.jsx";
import PageNotFound1 from "./Pages/PageNotFound.jsx";
import About from "./Pages/About.jsx";
import Pricing from "./Pages/Pricing.jsx";
import ProductListing from "./Pages/Product.jsx";
import Contact from "./Pages/Contact.jsx";

// User pages
import UserDashboard from "./Pages/Users/UserDashboard.jsx";
import UserProfile from "./Pages/Users/UserProfile.jsx";
import UserSetting from "./Pages/Users/UserSetting.jsx";
import MyProduct from "./Pages/Users/MyProduct.jsx";



// Trannir pages (example page)
import TrannirDashboard from "./Pages/Trannir/TrannirDashboard.jsx";

// Admin pages
import AdminLayout from "./Pages/Admin/AdminLayout.jsx";
import AdminDashboard from "./Pages/Admin/AdminDashboard.jsx";
import PageNotFound from "./Pages/Admin/AdminPageNotFound.jsx";

// Protected Route
import {
    AdminProtectedRoute,
    TrannirProtectedRoute,
    UserProtectedRoute,
} from "./utils/ProtectedRoute.jsx";



// Axios setup
import axios from "axios";
import Loading from "./Component/Loading.jsx";
import AddProduct from "./Pages/Admin/Product/AddProduct.jsx";
import AllProduct from "./Pages/Admin/Product/AllProduct.jsx";
axios.defaults.baseURL = "http://localhost:3000";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/about", element: <About /> },
            { path: "/pricing", element: <Pricing /> },
            { path: "/product", element: <ProductListing /> },
            { path: "/contact", element: <Contact /> },
            { path: "/loading", element: <Loading /> },
            { path: "*", element: <PageNotFound1 /> },

            // ✅ User protected routes
            {
                path: "/profile",
                element: (
                    <UserProtectedRoute>
                        <UserProfile />
                    </UserProtectedRoute>
                ),
            },
            {
                path: "/dashboard",
                element: (
                    <UserProtectedRoute>
                        <UserDashboard />
                    </UserProtectedRoute>
                ),
            },
            {
                path: "/myproduct",
                element: (
                    <UserProtectedRoute>
                        <MyProduct />
                    </UserProtectedRoute>
                ),
            },
            {
                path: "/setting",
                element: (
                    <UserProtectedRoute>
                        <UserSetting />
                    </UserProtectedRoute>
                ),
            },

            // ✅ Trannir protected route (example)
            {
                path: "/trannir/dashboard",
                element: (
                    <TrannirProtectedRoute>
                        <TrannirDashboard />
                    </TrannirProtectedRoute>
                ),
            },
        ],
    },
    {
        // ✅ Admin layout
        path: "/admin",
        element: (
            <AdminProtectedRoute>
                <AdminLayout />
            </AdminProtectedRoute>
        ),
        children: [
            { path: "dashboard", element: <AdminDashboard />, },
            { path: "add-product", element: <AddProduct />, },
            { path: "all-product", element: <AllProduct />, },
            { path: "*", element: <PageNotFound />, },
        ],
    },
]);

const root = createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
