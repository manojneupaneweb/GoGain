// main.jsx or index.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import axios from "axios";
import Loading from "./Component/Loading.jsx";

// ProtectedRoute
import ProtectedRoute from './utils/ProtectedRoute.jsx'
// Public Pages
import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Pricing from "./Pages/Pricing.jsx";
import Services from "./Pages/Services.jsx";
import ProductListing from "./Pages/Product.jsx";
import ProductShow from "./Pages/ProductShow.jsx";
import Contact from "./Pages/Contact.jsx";
import PageNotFound1 from "./Pages/PageNotFound.jsx";

// User Pages
import UserDashboard from "./Pages/Users/UserDashboard.jsx";
import UserProfile from "./Pages/Users/UserProfile.jsx";
import UserSetting from "./Pages/Users/UserSetting.jsx";
import MyProduct from "./Pages/Users/MyProduct.jsx";
import Createplan from "./Pages/createplan.jsx";
import Cart from "./Pages/Users/Cart.jsx";
import PaymentSuccess from "./Pages/paymentSuccess.jsx";

// Trainer Pages
import TrannirDashboard from "./Pages/Trannir/TrannirDashboard.jsx";

// Admin Pages
import AdminLayout from "./Pages/Admin/AdminLayout.jsx";
import AdminDashboard from "./Pages/Admin/AdminDashboard.jsx";
import PageNotFound from "./Pages/Admin/AdminPageNotFound.jsx";
import Security from "./Pages/Admin/Settings/security.jsx";
import UserPermission from "./Pages/Admin/Settings/UserPermission.jsx";
import PendingOrdres from "./Pages/Admin/Orders/PendingOrdres.jsx";
import ShippingOrders from "./Pages/Admin/Orders/ShippingOrders.jsx";
import CompleteOrders from "./Pages/Admin/Orders/CompleteOrders.jsx";
import CancelOrders from "./Pages/Admin/Orders/CancelOrders.jsx";
import AddProduct from "./Pages/Admin/Product/AddProduct.jsx";
import AllProduct from "./Pages/Admin/Product/AllProduct.jsx";
import UpdateProduct from "./Pages/Admin/Product/UpdateProduct.jsx";
import ContactFormMessage from "./Pages/Admin/contactFormMessage.jsx";
import Constumers from "./Pages/Admin/Constumers.jsx";
import Analytics from "./Pages/Admin/Analytics.jsx";
import Reports from "./Pages/Admin/Reports.jsx";

// Axios default
axios.defaults.baseURL = "http://localhost:3000";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            // Public Pages
            { path: "/", element: <Home /> },
            { path: "/about", element: <About /> },
            { path: "/pricing", element: <Pricing /> },
            { path: "/services", element: <Services /> },
            { path: "/product", element: <ProductListing /> },
            { path: "/product/:id", element: <ProductShow /> },
            { path: "/contact", element: <Contact /> },
            { path: "*", element: <PageNotFound1 /> },

            // User protected
            {
                path: "/profile",
                element: (
                    <ProtectedRoute allowedRoles={['user', 'trainer']}>
                        <UserProfile />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/dashboard",
                element: (
                    <ProtectedRoute allowedRoles={["user"]}>
                        <UserDashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/myorder",
                element: (
                    <ProtectedRoute allowedRoles={['user', 'trainer']}>
                        <MyProduct />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/cart",
                element: (
                    <ProtectedRoute allowedRoles={['user', 'trainer']}>
                        <Cart />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/setting",
                element: (
                    <ProtectedRoute allowedRoles={['user', 'trainer']}>
                        <UserSetting />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/paymentsuccess",
                element: (
                    <ProtectedRoute allowedRoles={["user"]}>
                        <PaymentSuccess />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/createplan",
                element: (
                    <ProtectedRoute allowedRoles={["user"]}>
                        <Createplan />
                    </ProtectedRoute>
                ),
            },

            // Trainer protected
            {
                path: "/trainer-dashboard",
                element: (
                    <ProtectedRoute allowedRoles={["trainer"]}>
                        <TrannirDashboard />
                    </ProtectedRoute>
                ),
            },
        ],
    },

    // Admin layout protected
    {
        path: "/admin",
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: "dashboard", element: <AdminDashboard /> },
            // Products
            { path: "add-product", element: <AddProduct /> },
            { path: "all-product", element: <AllProduct /> },
            { path: "update-product/:id", element: <UpdateProduct /> },
            // Orders
            { path: "orders/pending", element: <PendingOrdres /> },
            { path: "orders/shipping", element: <ShippingOrders /> },
            { path: "orders/complete", element: <CompleteOrders /> },
            { path: "orders/cancel", element: <CancelOrders /> },
            { path: "customers", element: <Constumers /> },
            { path: "analytics", element: <Analytics /> },
            { path: "reports", element: <Reports /> },
            // Settings
            { path: "settings/security", element: <Security /> },
            { path: "settings/userpermission", element: <UserPermission /> },
            // Contact messages
            { path: "contactformmessage", element: <ContactFormMessage /> },

            { path: "*", element: <PageNotFound /> },
        ],
    },
]);

const root = createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
