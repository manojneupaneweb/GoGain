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
  BellIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Update time every second
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const navItems = [
    {
      name: 'Dashboard',
      icon: HomeIcon,
      path: '/admin',
    },
    {
      name: 'Products',
      icon: ShoppingBagIcon,
      submenu: [
        { name: 'All Products', path: '/admin/products' },
        { name: 'Add Product', path: '/admin/products/add' },
        { name: 'Edit Product', path: '/admin/products/edit' },
      ],
    },
    {
      name: 'Orders',
      icon: ShoppingCartIcon,
      submenu: [
        { name: 'Pending', path: '/admin/orders/pending' },
        { name: 'Shipping', path: '/admin/orders/shipping' },
        { name: 'Complete', path: '/admin/orders/complete' },
        { name: 'Cancelled', path: '/admin/orders/cancelled' },
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
        { name: 'Profile', path: '/admin/settings/profile' },
        { name: 'Account', path: '/admin/settings/account' },
        { name: 'Security', path: '/admin/settings/security' },
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
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                darkMode 
                  ? 'hover:bg-blue-900/30' 
                  : 'hover:bg-blue-50'
              } ${
                openSubmenus[item.name] 
                  ? darkMode 
                    ? 'bg-blue-900/30 text-blue-100' 
                    : 'bg-blue-50 text-blue-600' 
                  : darkMode 
                    ? 'text-blue-100' 
                    : 'text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`h-5 w-5 ${
                  openSubmenus[item.name] 
                    ? darkMode 
                      ? 'text-blue-300' 
                      : 'text-blue-600' 
                    : darkMode 
                      ? 'text-blue-200' 
                      : 'text-gray-600'
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
                    <ChevronDownIcon className={`h-4 w-4 transition-transform duration-300 ${
                      darkMode ? 'text-blue-300' : 'text-blue-600'
                    }`} />
                  ) : (
                    <ChevronRightIcon className={`h-4 w-4 transition-transform duration-300 ${
                      darkMode ? 'text-blue-200' : 'text-gray-500'
                    }`} />
                  )}
                </>
              )}
            </button>

            {sidebarOpen && openSubmenus[item.name] && (
              <ul className="ml-8 mt-1 space-y-1 transition-all duration-300">
                {item.submenu.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <NavLink
                      to={subItem.path}
                      className={({ isActive }) =>
                        `block px-3 py-2 text-sm rounded-lg transition-all duration-300 ${
                          darkMode 
                            ? 'hover:bg-blue-900/20' 
                            : 'hover:bg-blue-50'
                        } ${
                          isActive 
                            ? darkMode 
                              ? 'bg-blue-900/20 text-blue-100 font-medium' 
                              : 'bg-blue-50 text-blue-600 font-medium' 
                            : darkMode 
                              ? 'text-blue-200 hover:text-blue-100' 
                              : 'text-gray-700 hover:text-blue-600'
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
              `flex items-center p-3 rounded-xl transition-all duration-300 ${
                darkMode 
                  ? 'hover:bg-blue-900/30' 
                  : 'hover:bg-blue-50'
              } ${
                isActive 
                  ? darkMode 
                    ? 'bg-blue-900/30 text-blue-100 font-medium' 
                    : 'bg-blue-50 text-blue-600 font-medium' 
                  : darkMode 
                    ? 'text-blue-200 hover:text-blue-100' 
                    : 'text-gray-700 hover:text-blue-600'
              }`
            }
          >
            <item.icon className={`h-5 w-5 ${
              darkMode ? 'text-blue-200' : 'text-gray-600'
            }`} />
            {sidebarOpen && <span className="ml-3">{item.name}</span>}
          </NavLink>
        )}
      </li>
    );
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      {/* Sidebar */}
      <aside
        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} text-gray-700 shadow-lg transition-all duration-300 ease-in-out fixed md:relative z-20 h-full ${
          sidebarOpen ? 'w-64' : 'w-0 md:w-20'
        }`}
      >
        <div className={`h-full flex flex-col ${sidebarOpen ? 'px-4' : 'px-2'}`}>
          {/* Sidebar header */}
          <div className="flex items-center justify-between py-5 border-b border-gray-200 dark:border-gray-700">
            {sidebarOpen ? (
              <h1 className={`text-xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                Admin Panel
              </h1>
            ) : (
              <h1 className={`text-xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                AP
              </h1>
            )}
            <button
              onClick={toggleSidebar}
              className={`p-1 rounded-full transition-colors duration-300 ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } md:hidden`}
            >
              <XMarkIcon className={`h-6 w-6 cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
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
          <div className="py-4 border-t border-gray-200 dark:border-gray-700">
            {sidebarOpen ? (
              <div className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                v1.0.0
              </div>
            ) : (
              <div className={`text-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                v1.0.0
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} sticky top-0 z-10 transition-all duration-300 ${
          isScrolled ? 'shadow-lg' : 'shadow-sm'
        }`}>
          <div className="flex items-center justify-between px-4 py-3">
            {/* Left side - Hamburger menu */}
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <Bars3Icon className={`h-6 w-6 transition-colors duration-300 ${
                  darkMode ? 'text-gray-300 hover:text-blue-300' : 'text-gray-500 hover:text-blue-600'
                }`} />
              </button>
            </div>

            {/* Right side - User info and controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-colors duration-300 ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5 text-yellow-300" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-gray-600" />
                )}
              </button>

              <div className={`hidden md:flex items-center space-x-1 text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <span>{format(currentTime, 'HH:mm:ss')}</span>
                <span className="mx-1">•</span>
                <span>Last login: Today</span>
                <span className="mx-1">•</span>
                <span>New York</span>
              </div>

              <button className={`p-2 rounded-full transition-colors duration-300 relative ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}>
                <BellIcon className={`h-5 w-5 transition-colors duration-300 ${
                  darkMode ? 'text-gray-300 hover:text-blue-300' : 'text-gray-500 hover:text-blue-600'
                }`} />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none group"
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    darkMode 
                      ? 'bg-blue-900/40 group-hover:bg-blue-900/60' 
                      : 'bg-blue-100 group-hover:bg-blue-200'
                  }`}>
                    <span className={`font-medium transition-colors duration-300 ${
                      darkMode 
                        ? 'text-blue-300 group-hover:text-blue-200' 
                        : 'text-blue-600 group-hover:text-blue-700'
                    }`}>
                      AD
                    </span>
                  </div>
                  <ChevronDownIcon className={`h-4 w-4 transition-all duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 z-10 transition-all duration-300 origin-top-right ${
                    darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'
                  }`}>
                    <a
                      href="#"
                      className={`block px-4 py-2 text-sm transition-colors duration-300 ${
                        darkMode 
                          ? 'text-gray-200 hover:bg-gray-600 hover:text-blue-300' 
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      My Profile
                    </a>
                    <a
                      href="#"
                      className={`block px-4 py-2 text-sm transition-colors duration-300 ${
                        darkMode 
                          ? 'text-gray-200 hover:bg-gray-600 hover:text-blue-300' 
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      Settings
                    </a>
                    <a
                      href="#"
                      className={`block px-4 py-2 text-sm transition-colors duration-300 ${
                        darkMode 
                          ? 'text-gray-200 hover:bg-gray-600 hover:text-blue-300' 
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
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
        <main className={`flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300 ${
          darkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          <div className={`rounded-xl shadow-sm p-4 md:p-6 transition-all duration-300 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}