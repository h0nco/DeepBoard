import { memo, useState, useRef, useEffect, useCallback } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';

const FloatingTextNode = ({ id, data, selected }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(data.content || 'Текст');
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

  const handleResize = useCallback((_: any, params: any) => {
    setFontSize(Math.max(12, params.width * 0.15));
  }, []);

  return (
    <div style={{ minWidth: 30, minHeight: 20, position: 'relative' }}>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={20}
        minHeight={20}
        onResize={handleResize}
        keepAspectRatio={false}
      />
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />

      {isEditing ? (
        <div>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
            style={{
              fontSize: `${fontSize}px`,
              fontFamily: data.fontFamily || 'Arial',
              fontWeight: data.fontWeight || 'normal',
              fontStyle: data.fontStyle || 'normal',
              textDecoration: data.textDecoration || 'none',
              color,
              width: '100%',
              border: 'none',
              outline: 'none',
              resize: 'none',
              padding: 0,
              background: 'transparent',
            }}
            className="bg-transparent"
          />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-5 h-5 mt-1"
          />
        </div>
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: data.fontFamily || 'Arial',
            fontWeight: data.fontWeight || 'normal',
            fontStyle: data.fontStyle || 'normal',
            textDecoration: data.textDecoration || 'none',
            color,
            padding: 0,
            cursor: 'text',
            background: 'transparent',
          }}
          className="whitespace-pre-wrap"
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default memo(FloatingTextNode);