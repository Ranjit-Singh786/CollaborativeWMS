import { useTheme } from "@/hooks/use-theme";
import { useState,useEffect, memo } from 'react';
import { Bell, ChevronsLeft, Moon, Search, Sun } from "lucide-react";
import profileImg from "@/assets/profile-image.jpg";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { useSocket } from "@/contexts/SocketContext";

export const Header = ({ collapsed, setCollapsed }) => {
    const { theme, setTheme } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [taskData, setTaskData] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();
    const socket = useSocket();
  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  const [showNotifications, setShowNotifications] = useState(false);

  const handleMouseOver = () => {
    const hasUnread = taskData.filter(task => !task.read);
    console.log('Has unread tasks:', hasUnread);
    if (hasUnread) {
      setTaskData((prevTasks) =>
        prevTasks.map(task => ({ ...task, read: true }))
      );
  
      socket.emit("read_task", hasUnread);
    }
  
    setShowNotifications(true);
  };

  const handleMouseOut = () => {
    setShowNotifications(false);
  };

  const handleNotificationClick = (projectId) => {
    setShowNotifications(false); // Optionally close notifications on click
    navigate(`/projects/tasks?p_id=${projectId}`);
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
          const baseUrl = "https://collaborative-wms-bakend.vercel.app" || 'http://localhost:5000';
          await axios.get(baseUrl+'/api/auth/logout', {
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
  
  useEffect(() => {
    if (!socket) {
      console.log('Socket is null or undefined');
      fetchNotifications();
      return;
    }
    console.log(`Socket connected: ${socket}`);
    
    socket.on('task_assigned', (taskData) => {
      console.log('Task Assigned To:', taskData.assignedUser);
      console.log('Message:', taskData.message);
      console.log('Project ID:', taskData.projectid);
      let arr = [{message: taskData.message, projectid: taskData.projectid,read:false}];
      setTaskData(arr);
      console.log('Task Data:', taskData);

      // ... further processing
    });

    //fetch notification
   async function fetchNotifications(){
      try {
        console.log('Fetching notifications...');
        const token = localStorage.getItem('token');
        // const userId = JSON.parse(localStorage.getItem('user'))?.id; 
        const baseUrl = "https://collaborative-wms-bakend.vercel.app" || 'http://localhost:5000';
        const response = await axios.get(baseUrl+'/api/notifications', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        console.log(response.data, 'Notification data fetched successfully');
        const result = response.data;
        setTaskData(prevTasks => {
          return [...prevTasks, ...result];
        });
        console.log(response, 'Notification data fetched successfully');
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    console.log(taskData, 'task data from socket io');
    return () => {
      if(socket) {
        socket.disconnect();
        console.log('Socket disconnected');
    }
  }
  }, []);

  useEffect(() => {
    console.log('Task data updated:', taskData);
    const unreadcount = taskData.filter(task => task.read === false).length;
    setUnreadCount(unreadcount);
  }
, [taskData]);

useEffect(() => {
  if (!socket) return;

  socket.on('task_assigned', (data) => {
      console.log('Task assigned notification received:', data);
      // Update your notifications or task data here
      setTaskData((prev) => [...prev, data]);
  });

  return () => {
      socket.off('task_assigned'); // Clean up the listener
  };
}, [socket]);
     

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
                <div
      className="relative"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <button className="btn-ghost size-10">
        {taskData.length > 0 && (
          <>
            <div className="absolute -top-1 right-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
              {unreadCount}
            </div>
          </>
        )}
        <Bell size={20} />
      </button>

      {showNotifications && taskData.length > 0 && (
        <div
          className="absolute right-0 top-full mt-2 bg-white border border-gray-300 rounded-md shadow-md p-4 w-64 z-10 overflow-y-auto max-h-60"
        >
          <h3 className="font-semibold mb-2">Notifications</h3>
          <ul>
            {taskData.map((task, index) => (
              
              <li
                key={index}
                className="py-1 border-b last:border-b-0 cursor-pointer hover:bg-gray-100"
                onClick={() => handleNotificationClick(task.projectid || task.projectId)}
              >
                <h3 className="font-semibold">{task.message}</h3>
                <p className="text-sm text-gray-600">Project ID: {task.projectid}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {showNotifications && taskData.length === 0 && (
        <div
          className="absolute right-0 top-full mt-2 bg-white border border-gray-300 rounded-md shadow-md p-4 w-48 z-10 text-gray-600"
        >
          No new notifications.
        </div>
      )}
    </div>
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
