import { memo, useState } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';

const ImageNode = ({ id, data, selected }: NodeProps) => {
  const [dimensions, setDimensions] = useState({ width: data.width || 200, height: data.height || 150 });
  const [error, setError] = useState(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="relative bg-node-light dark:bg-node-dark border border-border-light dark:border-border-dark rounded-md shadow-sm overflow-hidden"
      style={{ width: dimensions.width, height: dimensions.height }}
      onContextMenu={handleContextMenu}
    >
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={50}
        minHeight={50}
        onResize={(_, params) => {
          setDimensions({ width: params.width, height: params.height });
          data.width = params.width;
          data.height = params.height;
        }}
        keepAspectRatio={false}
      />
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Top} id="top-source" />
      <Handle type="target" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Bottom} id="bottom-source" />
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Left} id="left-source" />
      <Handle type="target" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Right} id="right-source" />

      {error ? (
        <div className="flex items-center justify-center h-full text-red-500 text-sm">
          Failed to load image
        </div>
      ) : (
        <img
          src={data.src}
          alt=""
          className="w-full h-full object-cover"
          onError={() => setError(true)}
          draggable={false}
        />
      )}
    </div>
  );
};

export default memo(ImageNode);