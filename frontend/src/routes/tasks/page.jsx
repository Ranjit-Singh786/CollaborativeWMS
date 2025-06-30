import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { showSuccessMessage } from '../../utils/SwalMessages';
import { useSocket } from '../../contexts/SocketContext';

const Page = () => {
    const [searchParams] = useSearchParams();
  const projectId = searchParams.get('p_id');
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [users, setUsers] = useState([]);
  const [isSocketState, setSocketState] = useState(false);
  const [assignUsr, setAssignusr] = useState({});
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedUser: '',
    priority: 'medium',
    status: 'to-do',
    dueDate: '',
  });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const socket = useSocket();

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };

  function getTasks(){
    if (!projectId) return;
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    axios
      .get(baseUrl+`/api/tasks/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }, params: {
          status: statusFilter, 
        },
      })
      .then((res) => setTasks(res.data))
      .catch((err) => console.error('Error fetching tasks:', err));
  }

  useEffect(() => {
    getTasks();
  }, [statusFilter]);
       

  // Fetch tasks for a given project
  useEffect(() => {
    if (!projectId) return;
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    axios
      .get(baseUrl+`/api/tasks/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTasks(res.data))
      .catch((err) => console.error('Error fetching tasks:', err));

      axios
      .get(baseUrl+`/api/projects/getuser`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error('Error fetching tasks:', err));

  }, [projectId]);

  useEffect(() => {
    if (!socket) return;
    socket.emit('assign_task', {
      message: `You've been added to a new project: ${assignUsr.title}`,
      projectid: assignUsr.project, 
      title: assignUsr.title,
      assignedUser: assignUsr.assignedUser  // This should be a Mongo _id
    });
  }, [socket, assignUsr?.assignedUser]);

  const handleChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const endpoint = editingTaskId
      ? baseUrl+`/api/tasks/${editingTaskId}`
      : baseUrl+'/api/tasks';

    const method = editingTaskId ? axios.put : axios.post;
    const payload = { ...taskForm, project: projectId };

    try {
      const res = await method(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      

      setTasks((prev) =>
        editingTaskId
          ? prev.map((task) => (task._id === res.data._id ? res.data : task))
          : [...prev, res.data]
      );
      // console.log(payload, 'payload');
      if(!editingTaskId){
        setAssignusr(payload)
     }
            showSuccessMessage('Task Created!', 'The Task was added successfully.');
      
      setTaskForm({
        title: '',
        description: '',
        assignedUser : '',
        priority: 'medium',
        status: 'to-do',
        dueDate: '',
      });
      setEditingTaskId(null);
    } catch (err) {
      console.error('Error saving task:', err);
    }
  };

  const handleEdit = (task) => {
    setTaskForm({
      title: task.title,
      description: task.description || '',
      assignedUser: task.assignedUser?._id || '',
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    });
    setEditingTaskId(task._id);
  };

  const handleDelete = async (id) => {
    try {
      const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
      await axios.delete(baseUrl+`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== id));
      showSuccessMessage('Task Deleted!', 'The Task was deleted successfully.');
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {(role === "Admin" || editingTaskId) && (
        <>
      <h2 className="text-xl font-bold mb-4">{editingTaskId ? 'Edit Task' : 'Add Task'}</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
        <input
          type="text"
          name="title"
          value={taskForm.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="description"
          value={taskForm.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 rounded"
        />
        <select name="priority" value={taskForm.priority} onChange={handleChange} className="border p-2 rounded">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select name="status" value={taskForm.status} onChange={handleChange} className="border p-2 rounded">
          <option value="to-do">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select
            name="assignedUser"
            value={taskForm.assignedUser}
            onChange={handleChange}
            className="border p-2 rounded"
            >
            <option value="">-- Select User --</option>
            {users.map((user) => (
                <option key={user._id} value={user._id}>
                {user.name}
                </option>
            ))}
            </select>
       
        <input
          type="date"
          name="dueDate"
          value={taskForm.dueDate}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 col-span-full md:col-auto"
        >
          {editingTaskId ? 'Update Task' : 'Add Task'}
        </button>
      </form>
      </>

        )} 

<div className="mb-4">
        <label className="block text-gray-700 mb-2">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className="p-2 border rounded-lg w-full sm:w-auto"
        >
          <option value="">All</option>
          <option value="to-do">To-Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white border rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Priority</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Assigned User</th>
              <th className="border px-4 py-2">Due Date</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
          {tasks.length === 0 ? (
            <p className='text-center'>Data not found</p>
            ) : (
            tasks.map((task) => (
              <tr key={task._id}>
                <td className="border px-4 py-2">{task.title}</td>
                <td className="border px-4 py-2">{task.description}</td>
                <td className="border px-4 py-2 capitalize">{task.priority}</td>
                <td className="border px-4 py-2 capitalize">{task.status}</td>
                <td className="border px-4 py-2 capitalize">{task?.assignedUser?.name}</td>
                <td className="border px-4 py-2">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                </td>
                {task?.status !== 'done' && (
                <td className="border px-4 py-2 space-x-2">
                  <button onClick={() => handleEdit(task)} className="bg-yellow-500 text-white px-2 py-1 rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(task._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                    Delete
                  </button>
                </td>
                )}
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
