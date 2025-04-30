import { Handle, Position } from 'reactflow';

// custom node to include personalized styling and incnluding the predefined role along with the role name
export default function CustomRoleNode({ data }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <div className="font-bold text-gray-800">{data.label}</div>
      <div className="text-gray-500">{data.predefined_role}</div>

      <Handle
        type="target"
        position={Position.Top}
        className="!w-12 !bg-teal-500 !rounded-none"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-12 !bg-teal-500 !rounded-none"
      />

    </div>
  );
}
