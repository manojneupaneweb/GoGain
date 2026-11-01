import api from './api';

const handleLogout = async () => {
  try {
    await api.post('/api/v1/user/logout');
  } catch (error) {
    console.error('Error during logout:', error);
  }

  window.location.href = '/';
};

export default handleLogout;
