import { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';

const ImageNode = ({ id, data, selected }: NodeProps) => {
  const [dimensions, setDimensions] = useState({ width: data.width || 200, height: data.height || 150 });
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    data.width = dimensions.width;
    data.height = dimensions.height;
  }, [dimensions, data]);

  return (
    <div
      className="relative bg-node-light dark:bg-node-dark border border-border-light dark:border-border-dark rounded-md shadow-sm overflow-hidden"
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={50}
        minHeight={50}
        onResize={(_, params) => {
          setDimensions({ width: params.width, height: params.height });
        }}
        keepAspectRatio={false}
      />
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Left} />
      <img
        ref={imgRef}
        src={data.src}
        alt=""
        className="w-full h-full object-cover"
        draggable={false}
      />
    </div>
  );
};

export default memo(ImageNode);