import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { showSuccessMessage,showErrorMessage } from '../../utils/SwalMessages';
import { useNavigate } from 'react-router-dom';

const Page = () => {
  const [projects, setProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const token = localStorage.getItem('token'); // Retrieve token
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: '',
    dueDate: '',
    status: 'open',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
const getProjects =()=>{
    if (token) {
    axios
    .get(import.meta.env.VITE_SOCKET_URL+'/api/projects', {
      headers: {
        Authorization: `Bearer ${token}`, // Add token to header
      },
      params: {
        status: statusFilter, // Pass status filter in query params
      },
    })
    .then((response) => setProjects(response.data))
    .catch((error) => console.error('Error fetching projects:', error));
} else {
    console.log('No token found in localStorage');
  }
}
  useEffect(() => {
   
        getProjects();
   
  }, [statusFilter]);

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleTasks = (projectId) => {
    navigate(`/projects/tasks?p_id=${projectId}`);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(import.meta.env.VITE_SOCKET_URL+'/api/projects', newProject, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showSuccessMessage('Project Created!', 'The project was added successfully.');
      setProjects([...projects, response.data]);
      setNewProject({
        name: '',
        description: '',
        startDate: '',
        dueDate: '',
        status: 'open',
      });
    } catch (err) {
      console.error('Error creating project:', err);
      showErrorMessage('Project Creation Failed!',err?.response?.data?.error ||err?.message);

    }
  };

  // Edit Project
  const handleEdit = (project) => {
    setIsEditing(true);
    setEditingProject(project);
    setNewProject({
      ...project,
      startDate: project.startDate.split('T')[0],
      dueDate: project.dueDate.split('T')[0],
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        import.meta.env.VITE_SOCKET_URL+`/api/projects/${editingProject._id}`,
        newProject,
        {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      showSuccessMessage('Project Updated!', 'The project was Updated successfully.');
      setProjects(
        projects.map((project) =>
          project._id === editingProject._id ? response.data : project
        )
      );
      setIsEditing(false);
      setNewProject({
        name: '',
        description: '',
        startDate: '',
        dueDate: '',
        status: 'open',
      });
    } catch (err) {
      console.error('Error updating project:', err);
    }
  };

  // Delete Project
  const handleDelete = async (id) => {
    try {
      await axios.delete(import.meta.env.VITE_SOCKET_URL+`/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(projects.filter((project) => project._id !== id));
      showSuccessMessage('Project Deleted!', 'The project was Deleted successfully.');
    } catch (err) {
      console.error('Error deleting project:', err);
      showErrorMessage('Project Deletion Failed!', err?.response?.data?.error || err?.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
         {role !=="User" &&
         <>
      <h1 className="text-2xl font-semibold mb-4">{isEditing ? 'Edit Project' : 'Create Project'}</h1>
      
      <form onSubmit={isEditing ? handleUpdate : handleCreate} className="mb-4">
        <div className="mb-2">
          <label className="block text-gray-700">Project Name</label>
          <input
            type="text"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        
        <div className="mb-2">
          <label className="block text-gray-700">Description</label>
          <input
            type="text"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        
        <div className="mb-2">
          <label className="block text-gray-700">Start Date</label>
          <input
            type="date"
            value={newProject.startDate}
            onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        
        <div className="mb-2">
          <label className="block text-gray-700">Due Date</label>
          <input
            type="date"
            value={newProject.dueDate}
            onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        
        <div className="mb-2">
          <label className="block text-gray-700">Status</label>
          <select
            value={newProject.status}
            onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
            className="w-full p-2 border rounded-lg"
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          {isEditing ? 'Update Project' : 'Create Project'}
        </button>
      </form>
      </>
        }
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className="p-2 border rounded-lg w-full sm:w-auto"
        >
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Description</th>
              <th className="py-2 px-4 border">Start Date</th>
              <th className="py-2 px-4 border">Due Date</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {
                projects.length===0? <h1 className='text-center'>Records not found</h1> :
        projects.map((project) => (
              <tr key={project._id}>
                <td className="py-2 px-4 border">{project.name}</td>
                <td className="py-2 px-4 border">{project.description}</td>
                <td className="py-2 px-4 border">{new Date(project.startDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border">{new Date(project.dueDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border">{project.status}</td>
                <td className="py-2 px-4 border">
                  {role !=="User" &&  
                 <>
                 <button
                    onClick={() => handleEdit(project)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded-lg mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-lg"
                  >
                    Delete
                  </button>
                  </>
                  }
                  <button
                    onClick={() => handleTasks(project._id)}
                    className="bg-green-500 text-white px-2 py-1 rounded-lg"
                  >
                    Tasks
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    
    </div>
  );
};

export default Page;
