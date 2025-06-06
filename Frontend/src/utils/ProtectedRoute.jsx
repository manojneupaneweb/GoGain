// ProtectedRoute.js

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const fetchUser = async () => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get('/api/v1/user/getuser', {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

const AdminProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const userData = await fetchUser();
      if (userData && userData.user.role === 'admin') {
        setUser(userData);
      } else {
        navigate('/');
      }
      setLoading(false);
    };
    getUser();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  return user ? children : null;
};

const TrannirProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const userData = await fetchUser();
      if (userData && userData.user.role === 'trannir') {
        setUser(userData);
      } else {
        navigate('/');
      }
      setLoading(false);
    };
    getUser();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  return user ? children : null;
};

const UserProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const userData = await fetchUser();
      
      if (userData && userData.user.role === 'user') {
        setUser(userData);
      } else {
        toast.error("Please login to access this page");
        navigate('/');
      }
      setLoading(false);
    };
    getUser();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  return user ? children : null;
};

export { AdminProtectedRoute, TrannirProtectedRoute, UserProtectedRoute };
