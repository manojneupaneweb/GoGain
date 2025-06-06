// index.jsx or main.jsx

import React from "react";
import { createRoot } from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

// Protected Route
import {
    AdminProtectedRoute,
    TrannirProtectedRoute,
    UserProtectedRoute,
} from "./utils/ProtectedRoute.jsx";

// Public Pages
import Home from "./Pages/Home.jsx";
import PageNotFound1 from "./Pages/PageNotFound.jsx";
import About from "./Pages/About.jsx";
import Pricing from "./Pages/Pricing.jsx";
import ProductListing from "./Pages/Product.jsx";
import ProductShow from "./Pages/ProductShow.jsx";
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
import Security from "./Pages/Admin/Settings/security.jsx";
import PendingOrdres from "./Pages/Admin/Orders/PendingOrdres.jsx";
import ShippingOrders from "./Pages/Admin/Orders/ShippingOrders.jsx";
import CompleteOrders from "./Pages/Admin/Orders/CompleteOrders.jsx";
import UserPermission from "./Pages/Admin/Settings/UserPermission.jsx";
import CancelOrders from "./Pages/Admin/Orders/CancelOrders.jsx";
import AddProduct from "./Pages/Admin/Product/AddProduct.jsx";
import AllProduct from "./Pages/Admin/Product/AllProduct.jsx";





// Axios setup
import axios from "axios";
import Loading from "./Component/Loading.jsx";
import UpdateProduct from "./Pages/Admin/Product/UpdateProduct.jsx";
import Cart from "./Pages/Users/Cart.jsx";
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
            { path: "/product/:id", element: <ProductShow /> },
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
                path: "/cart",
                element: (
                    <UserProtectedRoute>
                        <Cart />
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
            //product routes
            { path: "add-product", element: <AddProduct />, },
            { path: "all-product", element: <AllProduct />, },
            { path: "update-product/:id", element: <UpdateProduct />, },

            //orders
            { path: "orders/pending", element: < PendingOrdres />, },
            { path: "orders/shipping", element: < ShippingOrders />, },
            { path: "orders/complete", element: < CompleteOrders />, },
            { path: "orders/cancel", element: < CancelOrders />, },


            //settings
            { path: "settings/security", element: < Security />, },
            { path: "settings/userpermission", element: < UserPermission />, },



            { path: "*", element: <PageNotFound />, },
        ],
    },
]);

const root = createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
