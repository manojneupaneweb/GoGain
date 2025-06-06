import { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  ChartBarIcon,
  CogIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
  UsersIcon,
  HomeIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  XMarkIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { FaDumbbell } from 'react-icons/fa';
import axios from 'axios';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem('accessToken');
  const fetchUser = async () => {
    try {
      if (!token) {
        console.error('No access token found');
        setUser(null);
        return;
      }
      const response = await axios.get('/api/v1/user/getuser', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      if (response.data.success) {
        setUser(response.data.user);
      } else {
        console.error('Failed to fetch user data:', response.data.message);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
    }
  };
  
  useEffect(() => {
    fetchUser();
  }, [token]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSubmenu = (menu) => {
    setOpenSubmenus({
      ...openSubmenus,
      [menu]: !openSubmenus[menu],
    });
  };

  const navItems = [
    {
      name: 'Dashboard',
      icon: HomeIcon,
      path: '/admin/dashboard',
    },
    {
      name: 'Products',
      icon: ShoppingBagIcon,
      submenu: [
        { name: 'All Products', path: '/admin/all-product' },
        { name: 'Add Product', path: '/admin/add-product' },
      ],
    },
    {
      name: 'Orders',
      icon: ShoppingCartIcon,
      submenu: [
        { name: 'Pending', path: '/admin/orders/pending' },
        { name: 'Shipping', path: '/admin/orders/shipping' },
        { name: 'Complete', path: '/admin/orders/complete' },
        { name: 'Cancel', path: '/admin/orders/cancel' },
      ],
    },
    {
      name: 'Customers',
      icon: UsersIcon,
      path: '/admin/customers',
    },
    {
      name: 'Reports',
      icon: DocumentTextIcon,
      path: '/admin/reports',
    },
    {
      name: 'Analytics',
      icon: ChartBarIcon,
      path: '/admin/analytics',
    },
    {
      name: 'Settings',
      icon: CogIcon,
      submenu: [
        { name: 'Account', path: '/admin/settings/account' },
        { name: 'Security', path: '/admin/settings/security' },
        { name: 'userpermission', path: '/admin/settings/userpermission' },
      ],
    },
  ];

  const SidebarItem = ({ item }) => {
    const hasSubmenu = item.submenu;

    return (
      <li>
        {hasSubmenu ? (
          <>
            <button
              onClick={() => toggleSubmenu(item.name)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 hover:bg-gray-700 ${
                openSubmenus[item.name]
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`h-5 w-5 ${
                  openSubmenus[item.name]
                    ? 'text-white'
                    : 'text-gray-400'
                }`} />
                {sidebarOpen && (
                  <span className={`${
                    openSubmenus[item.name]
                      ? 'font-medium'
                      : ''
                  }`}>
                    {item.name}
                  </span>
                )}
              </div>
              {sidebarOpen && (
                <>
                  {openSubmenus[item.name] ? (
                    <ChevronDownIcon className="h-4 w-4 transition-transform duration-300 text-white" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4 transition-transform duration-300 text-gray-400" />
                  )}
                </>
              )}
            </button>

            {sidebarOpen && openSubmenus[item.name] && (
              <ul className="ml-8 mt-1 space-y-1 transition-all  duration-300">
                {item.submenu.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <NavLink
                      to={subItem.path}
                      className={({ isActive }) =>
                        `block px-3 py-2 text-sm rounded-lg transition-all duration-300 hover:bg-gray-700 ${
                          isActive
                            ? 'bg-gray-700 text-white font-medium'
                            : 'text-gray-300 hover:text-white'
                        }`
                      }
                    >
                      {subItem.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              `flex items-center p-3 rounded-xl transition-all duration-300 hover:bg-gray-700 ${
                isActive
                  ? 'bg-gray-700 text-white font-medium'
                  : 'text-gray-300 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`h-5 w-5 ${
                  isActive ? 'text-white' : 'text-gray-400'
                }`} />
                {sidebarOpen && <span className="ml-3">{item.name}</span>}
              </>
            )}
          </NavLink>
        )}
      </li>
    );
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-gray-300 shadow-lg transition-all duration-300 ease-in-out fixed md:relative z-20 h-full ${
          sidebarOpen ? 'w-64' : 'w-0 md:w-20'
        }`}
      >
        <div className={`h-full flex flex-col ${sidebarOpen ? 'px-4' : 'px-2'}`}>
          {/* Sidebar header */}
          <div className="flex items-center justify-between py-5 border-b border-gray-700">
            {sidebarOpen ? (
              <a href="/" className="flex items-center group">
                <div className="flex items-center">
                  <FaDumbbell className="text-orange-500 text-3xl mr-2 transition-transform group-hover:rotate-12" />
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
                    GoGain
                  </h1>
                </div>
              </a>
            ) : (
              <h1 className="text-xl font-bold text-orange-500">
                <FaDumbbell className="text-orange-500 text-3xl mr-2 transition-transform group-hover:rotate-12" />
              </h1>
            )}
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-full transition-colors duration-300 hover:bg-gray-700 md:hidden"
            >
              <XMarkIcon className="h-6 w-6 cursor-pointer text-gray-300" />
            </button>
          </div>

          {/* Sidebar content */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <SidebarItem key={index} item={item} />
              ))}
            </ul>
          </nav>

          {/* Sidebar footer */}
          <div className="py-4 border-t border-gray-700">
            {sidebarOpen ? (
              <div className="text-center text-sm text-gray-400">
                v1.0.0
              </div>
            ) : (
              <div className="text-center text-xs text-gray-400">
                v1.0.0
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header
          className={`bg-gray-800 sticky top-0 z-10 transition-all duration-300 ${
            isScrolled ? 'shadow-lg' : 'shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3">
            {/* Left side - Hamburger menu */}
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg transition-colors duration-300 hover:bg-gray-700"
              >
                <Bars3Icon className="h-6 cursor-pointer w-6 transition-colors duration-300 text-gray-300 hover:text-white" />
              </button>
            </div>
            <div>
              <div className="hidden md:flex items-center space-x-1 text-sm text-gray-300 font-semibold cursor-pointer">
                <span>{format(currentTime, 'HH:mm:ss')}</span>
                <span className="mx-1">•</span>
                <span>Last login: Today</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 cursor-pointer">
              <p className="text-sm text-gray-300 font-semibold hidden md:block">
                Hi, {user?.fullName}
              </p>
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none group"
                >
                  <div className="h-8 w-8 rounded-full cursor-pointer flex items-center justify-center transition-colors duration-300 bg-gray-700 group-hover:bg-gray-600">
                    <img
                      src={user?.avatar}
                      className="h-8 w-8 rounded-full object-cover"
                      alt={user?.name || 'User Avatar'}
                    />
                  </div>
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-all duration-300 text-gray-300 ${
                      userDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 z-10 transition-all duration-300 origin-top-right bg-gray-800 border border-gray-700">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm transition-colors duration-300 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      My Profile
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm transition-colors duration-300 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Settings
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm transition-colors duration-300 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300 bg-gray-900">
          <div className="rounded-xl shadow-sm p-4 md:p-6 transition-all duration-300 bg-gray-800 border border-gray-700">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}