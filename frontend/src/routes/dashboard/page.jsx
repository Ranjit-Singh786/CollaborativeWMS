import { useTheme } from "@/hooks/use-theme";

import { Footer } from "@/layouts/footer";
import axios from "axios";
import { NavLink } from 'react-router-dom';

import { TrendingUp, Users } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { useSocket } from "@/contexts/SocketContext";

const DashboardPage = () => {
    const [data, setData] = useState(null);
   
    const socket = useSocket();

    useEffect(() => {
        if (socket) {
            console.log("Socket is available globally:", socket.id);
            socket.on("connect", () => {
                console.log("Socket connected", socket.id);
                localStorage.setItem("socketId", socket.id);
                socket.emit("register_user", JSON.parse(localStorage.getItem("user"))?.id);
            });
        }
    }, [socket]);
    

    useEffect(() => {
        const token = localStorage.getItem('token');
        const baseUrl = "https://collaborative-wms-bakend.vercel.app" || 'http://localhost:5000';
        axios.get(baseUrl+'/api/projects/getDashboardSummary', {
          headers: {
            Authorization: `Bearer ${token}`  // Attach token here
          }
        })
        .then((response) => {
          setData(response.data);
        })
        .catch((err) => {
          console.log(err, 'error');
        }); 
      }, []);
      
    
    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Dashboard</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <div className="card">
                    <div className="card-header">
                        <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            {/* <Package size={26} /> */}
                        </div>
                        <p className="card-title">Project Summary</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                    <NavLink to="/projects" className="block">
                        <p className="font-bold text-slate-900 transition-colors dark:text-slate-50">Open : {data?.projectSummary?.open}</p>
                        <p className="font-bold text-slate-900 transition-colors dark:text-slate-50">In-Progress : {data?.projectSummary["in-progress"]}</p>
                        <p className="font-bold text-slate-900 transition-colors dark:text-slate-50">Completed : {data?.projectSummary?.completed}</p>
                        {/* <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600"> */}
                            {/* <TrendingUp size={18} />
                            25% */}
                        {/* </span> */}
                        </NavLink>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            {/* <DollarSign size={26} /> */}
                        </div>
                        <p className="card-title">Task Summery</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <NavLink to="/projects" className="block">
                            <p className="font-bold text-slate-900 transition-colors dark:text-slate-50">Done:
                            {data?.taskSummary?.done}
                            </p>
                            <p className="font-bold  text-slate-900 transition-colors dark:text-slate-50">To-do:
                            {data?.taskSummary["to-do"]}
                            </p>
                            <p className="font-bold  text-slate-900 transition-colors dark:text-slate-50">In-Progress:
                            {data?.taskSummary['in-progress']}
                            </p>
                            {/* <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                            <TrendingUp size={18} />
                            12%
                            </span> */}
                        </NavLink>
                 </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            {/* <Users size={26} /> */}
                        </div>
                        <p className="card-title">Upcoming Deadlines</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                    <NavLink to="/projects" className="block">
                    {data?.upcomingDeadlines?.length > 0 ? (
                    data?.upcomingDeadlines.map((item, index) => (
                        <div key={index} className="mb-4">
                        <p className="font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {item?.title}
                        </p>
                        <p className="text-slate-900 transition-colors dark:text-slate-50">
                            {item?.description}
                        </p>
                        <p className="text-slate-900 transition-colors dark:text-slate-50">
                            {new Date(item?.dueDate).toISOString().split('T')[0]} {/* Formatting the due date */}
                        </p>
                        </div>
                    ))
                    ) : (
                    <p>No upcoming deadlines available</p> // Fallback message if no deadlines
                    )}

                        
                        {/* <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                            <TrendingUp size={18} />
                            15%
                        </span> */}
                        </NavLink>
                    </div>
                </div>
               
            </div>
            <Footer />
        </div>
    );
};

export default DashboardPage;
