// utils/ProtectedRoute.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../Component/Loading";

const fetchUser = async () => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.get("/api/v1/user/getuser", {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const userData = await fetchUser();
      if (userData && allowedRoles.includes(userData.user.role)) {
        setUser(userData);
      } else {
        toast.error("You are not authorized to access this page");
        navigate("/");
      }
      setLoading(false);
    };
    getUser();
  }, [navigate, allowedRoles]);

  if (loading) return <Loading />;
  return user ? children : null;
};

export default ProtectedRoute;
