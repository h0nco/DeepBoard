import { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const FloatingTextNode = ({ id, data, selected }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(data.content || 'Text');
  const [fontSize, setFontSize] = useState(data.fontSize || 20);
  const [color, setColor] = useState(data.color || '#111827');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    data.content = content;
    data.fontSize = fontSize;
    data.color = color;
  }, [content, fontSize, color, data]);

  const handleDoubleClick = () => setIsEditing(true);
  const handleBlur = () => setIsEditing(false);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content, isEditing]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div style={{ position: 'relative' }} onContextMenu={handleContextMenu}>
      <Handle type="target" position={Position.Top} id="top" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Top} id="top-source" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Bottom} id="bottom" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} id="bottom-source" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} id="left" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left} id="left-source" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Right} id="right" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} id="right-source" style={{ opacity: 0 }} />

      {isEditing ? (
        <div className="flex flex-col gap-1">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
            style={{
              fontSize: `${fontSize}px`,
              fontFamily: data.fontFamily || 'Arial',
              color,
              width: 'auto',
              minWidth: '50px',
              border: 'none',
              outline: 'none',
              resize: 'none',
              padding: 0,
              background: 'transparent',
            }}
            className="bg-transparent"
          />
          <div className="flex items-center gap-1">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-5 h-5"
            />
            <input
              type="range"
              min="8"
              max="72"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-xs">{fontSize}px</span>
          </div>
        </div>
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: data.fontFamily || 'Arial',
            color,
            cursor: 'text',
            background: 'transparent',
            whiteSpace: 'pre-wrap',
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default memo(FloatingTextNode);