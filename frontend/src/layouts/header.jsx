import { useTheme } from "@/hooks/use-theme";
import { useState } from 'react';
import { Bell, ChevronsLeft, Moon, Search, Sun } from "lucide-react";
import profileImg from "@/assets/profile-image.jpg";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const Header = ({ collapsed, setCollapsed }) => {
    const { theme, setTheme } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navigate = useNavigate();

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  const handleLogout = async () => {
  
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Call logout API
          const token = localStorage.getItem('token');
          await axios.get('http://localhost:5000/api/auth/logout', {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
  
          // Clear local storage
          localStorage.removeItem('token');
          localStorage.removeItem('role');
  
          // Show success alert
          Swal.fire('Logged out!', 'You have been successfully logged out.', 'success')
            .then(() => {
              navigate('/login');
            });
        } catch (error) {
          console.error('Logout failed:', error);
          Swal.fire('Error', 'Something went wrong during logout.', 'error');
        }
      }
    });
  };

    return (
        <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={collapsed && "rotate-180"} />
                </button>
                <div className="input">
                    <Search
                        size={20}
                        className="text-slate-300"
                    />
                    <input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Search..."
                        className="w-full bg-transparent text-slate-900 outline-0 placeholder:text-slate-300 dark:text-slate-50"
                    />
                </div>
            </div>
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    <Sun
                        size={20}
                        className="dark:hidden"
                    />
                    <Moon
                        size={20}
                        className="hidden dark:block"
                    />
                </button>
                <button className="btn-ghost size-10">
                    <Bell size={20} />
                </button>
                <div className="relative" onMouseLeave={handleMouseLeave}>
                <button
                    className="size-10 overflow-hidden rounded-full"
                    onMouseEnter={handleMouseEnter}
                >
                    <img
                    src={profileImg}
                    alt="profile image"
                    className="size-full object-cover"
                    />
                </button>
                
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-0 w-40 bg-white shadow-lg rounded-lg">
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                        Logout
                    </button>
                    </div>
                )}
    </div>

            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};
