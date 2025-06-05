import Cookies from 'js-cookie'; 

const handelLogout = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No token found, cannot logout');
      return;
    }

    localStorage.removeItem('accessToken');
    Cookies.remove('accessToken');
    sessionStorage.removeItem('accessToken');

    window.location.href = '/';

  } catch (error) {
    console.error('Error during logout:', error);
  }
};

export default handelLogout;
