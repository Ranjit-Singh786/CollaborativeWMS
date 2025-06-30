import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { showSuccessMessage } from '../../utils/SwalMessages';
import { useNavigate } from 'react-router-dom';

const Page = () => {
  const [users, setusers] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const token = localStorage.getItem('token'); // Retrieve token
  const [newuser, setNewuser] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editinguser, setEditinguser] = useState(null);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
const getusers =()=>{
    if (token) {
        const baseUrl = "https://collaborative-wms-bakend.vercel.app" || 'http://localhost:5000';
    axios
    .get(baseUrl+'/api/auth', {
      headers: {
        Authorization: `Bearer ${token}`, // Add token to header
      }
    })
    .then((response) => {
        console.log(response,'skjdfhjksdgf')
        setusers(response?.data?.result)
    
    })
    .catch((error) => console.error('Error fetching users:', error));
} else {
    console.log('No token found in localStorage');
  }
}
  useEffect(() => {
   
        getusers();
   
  }, []);

  


  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = "https://collaborative-wms-bakend.vercel.app" || 'http://localhost:5000';
      const response = await axios.post(baseUrl+'/api/auth/register', newuser,{ headers: {
        Authorization: `Bearer ${token}`, // Add token to header
      }
    });
      showSuccessMessage('User Created!', 'The user was added successfully.');
      console.log(response.data.status,'respsdjfjhjsdhf')
      if(response.data.status==201){
        setusers([newuser,...users]);
        setNewuser({
          name: '',
          email: '',
          password: '',
        });
      }
     
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setIsEditing(true);
    setEditinguser(user);
    setNewuser({
      ...user
    });
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = "https://collaborative-wms-bakend.vercel.app" || 'http://localhost:5000';
      const response = await axios.put(
        baseUrl+`/api/auth/${editinguser._id}`,
        newuser,
        {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      showSuccessMessage('user Updated!', 'The user was Updated successfully.');
      console.log(response,newuser)
      setusers(
        users?.map((user) =>
          user._id === editinguser._id ? response.data?.user : user
        )
      );
      setIsEditing(false);
      setNewuser({
        name: '',
        email: '',
        password: '',
      });
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      const baseUrl = "https://collaborative-wms-bakend.vercel.app" || 'http://localhost:5000';
      await axios.delete(baseUrl+`/api/auth/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setusers(users?.filter((user) => user._id !== id));
      showSuccessMessage('user Deleted!', 'The user was Deleted successfully.');
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
         {role !=="User" &&
         <>
      <h1 className="text-2xl font-semibold mb-4">{isEditing ? 'Edit User' : 'Create User'}</h1>
      
      <form onSubmit={isEditing ? handleUpdate : handleCreate} className="mb-4">
        <div className="mb-2">
          <label className="block text-gray-700">User Name</label>
          <input
            type="text"
            value={newuser.name}
            onChange={(e) => setNewuser({ ...newuser, name: e.target.value })}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        
        <div className="mb-2">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={newuser.email}
            onChange={(e) => setNewuser({ ...newuser, email: e.target.value })}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        
        <div className="mb-2">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={newuser.password}
            onChange={(e) => setNewuser({ ...newuser, password: e.target.value })}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          {isEditing ? 'Update user' : 'Create user'}
        </button>
      </form>
      </>
        }

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Role</th>
              {role !=="User" && 
              <th className="py-2 px-4 border">Action</th>
}
            </tr>
          </thead>
          <tbody>
            
            {users && users?.map((user) => (
              <tr key={user._id}>
                <td className="py-2 px-4 border text-center">{user.name}</td>
                <td className="py-2 px-4 border text-center">{user.email}</td>
                <td className="py-2 px-4 border text-center">{user.role}</td>
                  {role !=="User" &&  
                <td className="py-2 px-4 border text-center">
                 <>
                 <button
                    onClick={() => handleEdit(user)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded-lg mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-lg"
                  >
                    Delete
                  </button>
                  </>
                </td>
                  }
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    
    </div>
  );
};

export default Page;
