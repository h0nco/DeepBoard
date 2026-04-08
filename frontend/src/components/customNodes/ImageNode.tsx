import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const ImageNode = ({ data }: NodeProps) => {
  return (
    <div className="bg-white border border-gray-300 rounded p-2 shadow-sm">
      <Handle type="target" position={Position.Top} />
      <div className="text-center text-gray-500">🖼️ Image placeholder</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(ImageNode);