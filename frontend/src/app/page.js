'use client';
import { useState } from 'react';
import RoleList from "@/components/RoleList";
import OperationZone from "@/components/OperationZone";
import '@/app/globals.css'; 


export default function Home() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // handle role updates from sidebar
  const handleRoleUpdate = (updatedRole) => {
    setNodes(prevNodes => prevNodes.map(node => {
      if (node.data.roleId === updatedRole.id) {
        return {
          // use spread-operator to leave the existing nodes unchanged
          ...node,
          data: {
            ...node.data,
            label: updatedRole.name,
            description: updatedRole.description
          }
        };
      }
      return node;
    }));
  };

  // Handle role deletions from sidebar
  const handleRoleDelete = (deletedRoleId) => {
    setNodes(prevNodes => 
      prevNodes.filter(node => node.data.roleId !== deletedRoleId)
    );
  };

 

  return (
    <main className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <h1 className="text-black text-2xl font-bold mb-4 p-6 border-b border-gray-300">
        🤖 DragFlow - Scrum Development
      </h1>
  
      {/* Layout: Sidebar + Main Area */}
      <div className="grid grid-cols-4 flex-1">
        {/* Sidebar */}
        <aside className="col-span-1 bg-gray-100 p-6 border-r border-gray-300 flex flex-col space-y-4">
          {/* RoleList from the backend */}
          <h3 className="text-lg font-semibold text-black mt-2">Current Roles</h3>
          <RoleList 
            onRoleUpdate={handleRoleUpdate}
            onRoleDelete={handleRoleDelete}
          />
  
          {/* List of Predefined Roles */}
          <h2 className="text-lg font-semibold text-black">Available predefined roles</h2>
          <ul className="flex flex-col flex-1 space-y-1 overflow-y-auto text-black">
            {["Scrum Master", "Product Owner", "Developer", "Tester"].map((role) => (
              <li key={role} className="p-2 bg-white rounded shadow-sm">{role}</li>
            ))}
          </ul>
        </aside>
  
        {/* Operation Zone (Drag & Drop via React Flow) */}
        <section className="col-span-3 p-6 bg-gray-50">
          <OperationZone 
            nodes={nodes}
            setNodes={setNodes}
            edges={edges}
            setEdges={setEdges}
          />
        </section>
      </div>
    </main>
  );  
}
