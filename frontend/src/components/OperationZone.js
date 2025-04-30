'use client';
import { useState, useCallback } from 'react';
import CustomRoleNode from './CustomRoleNode';
import ReactFlow, { 
  ReactFlowProvider,
  useReactFlow,
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  addEdge
} from 'reactflow';
import 'reactflow/dist/style.css';

function FlowComponent({ nodes, setNodes, edges, setEdges, draggedRoles, setDraggedRoles }) {
  // converts screen coordinates to canvas coordinates
  const { screenToFlowPosition } = useReactFlow();

  const nodeTypes = {
    role: CustomRoleNode,
  };

  // node position handler
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  // handle edges
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // drop handler with proper role ID binding
  const onDrop = useCallback((event) => {
    event.preventDefault();
    const role = JSON.parse(event.dataTransfer.getData('application/role'));
    // check if role has already been dragged
    if (draggedRoles.includes(role.id)) {
      return;
    }

    const bounds = event.target.getBoundingClientRect();
    
    const position = screenToFlowPosition({
      x: event.clientX ,
      y: event.clientY ,
    });

    setNodes((nds) => [
      ...nds, 
      {
        id: `node-${role.id}-${Date.now()}`,
        type: 'role',
        position, 
        data: {
          roleId: role.id,
          label: role.name,
          predefined_role: role.predefined_role,
        },
        className: '',
      }
    ]);
      setDraggedRoles((prevRoles) => [...prevRoles, role.id]);
  }, [screenToFlowPosition, setNodes, draggedRoles, setDraggedRoles]);

  return (
    <div className="h-full border-dashed border-2 border-gray-400 rounded-lg"
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        fitView
        nodesDraggable
        nodeTypes={nodeTypes}  
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default function OperationZone({ nodes, setNodes, edges, setEdges }) {
  const [showChat, setShowChat] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")
  const [message, setMessage] = useState("")
  const [conversations, setConversations] = useState({
    "Frontend Developer": [],
    "Backend Developer": [],
  });
  const [draggedRoles, setDraggedRoles] = useState([])

  
  const handleMessage = () => {
    if (selectedRole != "" && message != "") {
      const newMessage = {
        sender: 'Project Leader',
        receiver: selectedRole,
        message,
      };
  
      // update the conversation history for the selected role
      setConversations((prevConversations) => ({
        ...prevConversations,
        [selectedRole]: [...prevConversations[selectedRole], newMessage],
      }));
  
      console.log(`Message to ${selectedRole}: ${message}`);
  
      setMessage(''); // Clear the input field after sending
    } else {
      console.log('Please select a role and enter a message');
    }
  };
  
  return (
    <div className="relative h-full">
      <ReactFlowProvider>
        <FlowComponent
          nodes={nodes}
          setNodes={setNodes}
          edges={edges}
          setEdges={setEdges}
          draggedRoles={draggedRoles}
          setDraggedRoles={setDraggedRoles}
        />
      </ReactFlowProvider>
      {/* Chatbox implmentation*/}
      <button 
        className="bg-cyan-500 absolute bottom-5 left-1/2 w-22 h-10 rounded cursor-pointer"
        onClick={() => setShowChat(!showChat)}
      >
      💬 Chat
      </button>
      {showChat && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-80 h-110 bg-white shadow-lg rounded-lg p-4">
          {/* chat area -> select receiver and input message */}
          <input 
            type="text"
            className="w-full p-2 border rounded text-black mb-2"
            placeholder="Type your message here..."  
            onChange={(e) => setMessage(e.target.value)}
          />
          <select 
            onChange={(e) => setSelectedRole(e.target.value)} 
            className="w-full p-2 border rounded text-black"
          >
            <option value="">Select a Role</option>
            {["Frontend Developer", "Backend Developer"].map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <button
            className="bg-blue-500 rounded text-white w-1/2 mt-3 mb-3 relative left-19 cursor-pointer"
            onClick={handleMessage}
          >
            Send
          </button>
          {/* Output the chat history depending on the receiver*/}
          <h2 className="text-black">History</h2>
          <div className="overflow-y-auto h-64 mb-2">
            {conversations[selectedRole]?.map((msg,id) => (
              <div key={id} className="mb-2">
                <div className="text-sm text-gray-500">
                  <strong>Sender:</strong> {msg.sender} | <strong>Receiver:</strong> {msg.receiver}
                </div>
                <div className="font-semibold mt-1 text-black">{msg.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}