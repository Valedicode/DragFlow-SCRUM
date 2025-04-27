'use client';
import { useEffect, useState } from 'react';
import { getRoles, updateRole, deleteRole, createRole } from '../lib/api';

export default function RoleList({ onRoleUpdate, onRoleDelete }) {
  const [roles, setRoles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  // for making the form visible or not
  const [showAddForm, setShowAddForm] = useState(false); 
  const [newRoleData, setNewRoleData] = useState({
    predefined_role: '',
    name: '',
    description: '',
  });

  useEffect(() => {
    async function fetchData() {
      const data = await getRoles();
      setRoles(Object.values(data));
    }
    fetchData();
  }, []);

  // marks the current role as editing and save the role data into formData
  const handleEdit = (role) => {
    setEditingId(role.id);
    setFormData({ ...role });
  };

  // update the role information
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // submit the updated role to backend
  const handleUpdate = async () => {
    const updatedRole = await updateRole(editingId, formData);
    onRoleUpdate(updatedRole); 
    const data = await getRoles();
    setRoles(Object.values(data));
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    await deleteRole(id);
    onRoleDelete(id);
    const data = await getRoles();
    setRoles(Object.values(data));
  };

  // handle changes of "add new role" formula
  const handleNewRoleChange = (e) => {
    setNewRoleData({ ...newRoleData, [e.target.name]: e.target.value });
  };

  // creates a new role by request to backend
  const handleAddRole = async () => {
    await createRole(newRoleData);
    const data = await getRoles();
    setRoles(Object.values(data));
    setShowAddForm(false); 
    // reset state 
    setNewRoleData({
      predefined_role: '',
      name: '',
      description: '',
    });
  };

  return (
    <div className="p-4 text-black">
      {/* "Add Role" Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 cursor-pointer"
      >
        {/* conditionally render cancel during add new role process */}
        {showAddForm ? 'Cancel' : 'Add New Role'}
      </button>

      {/* Add Role Form -> conditionally render form only if add role button is clicked*/}
      {showAddForm && (
        <div className="bg-gray-100 p-4 rounded shadow mb-4">
          <h3 className="text-lg font-bold">Add New Role</h3>
          <input
            type="text"
            name="predefined_role"
            value={newRoleData.predefined_role}
            onChange={handleNewRoleChange}
            placeholder="Predefined Role"
            className="p-2 border rounded w-full mb-2"
          />
          <input
            type="text"
            name="name"
            value={newRoleData.name}
            onChange={handleNewRoleChange}
            placeholder="Role Name"
            className="p-2 border rounded w-full mb-2"
          />
          <input
            type="text"
            name="description"
            value={newRoleData.description}
            onChange={handleNewRoleChange}
            placeholder="Description"
            className="p-2 border rounded w-full mb-2"
          />
          <button
            onClick={handleAddRole}
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            Add Role
          </button>
        </div>
      )}

      {/* Curent Role List */}
      <ul className="space-y-3">
        {roles.map((role) => (
          <li 
            key={role.id} 
            className="bg-gray-100 p-4 rounded shadow cursor-grab" 
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(
                'application/role', 
                JSON.stringify({
                  name: role.name,
                  id: role.id,
                  description: role.description,
                  predefined_role: role.predefined_role
                })
              );
            }}
          >
            {/* render save and cancel if current role is edited*/}
            {editingId === role.id ? (
              <div className="space-y-2">
                <input
                  className="p-2 border rounded w-full"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                />
                <input
                  className="p-2 border rounded w-full"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : 
            //else render basic information
            (
              <div className="flex justify-between items-center">
                <div>
                  <strong>{role.predefined_role}</strong>: {role.name} – {role.description}
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(role)}
                    className="bg-yellow-400 text-white px-3 py-2 m-2 rounded cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(role.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
