import { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';

const FloatingTextNode = ({ id, data, selected }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(data.content || 'Текст');
  const [fontSize, setFontSize] = useState(data.fontSize || 16);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    data.content = content;
    data.fontSize = fontSize;
  }, [content, fontSize, data]);

  const handleDoubleClick = () => setIsEditing(true);
  const handleBlur = () => setIsEditing(false);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content, isEditing]);

  return (
    <div style={{ minWidth: 50, minHeight: 30, position: 'relative' }}>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={30}
        minHeight={20}
        onResize={(_, params) => {
          // Можно привязать изменение fontSize к ширине, если нужно
          // setFontSize(Math.max(12, params.width * 0.15));
        }}
        keepAspectRatio={false}
      />
      {/* Хендлы невидимые, но нужны для соединений */}
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />

      {isEditing ? (
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
            width: '100%',
            border: 'none',
            outline: 'none',
            resize: 'none',
            padding: 0,
            background: 'transparent',
            color: 'inherit',
          }}
          className="bg-transparent"
        />
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: data.fontFamily || 'Arial',
            fontWeight: data.fontWeight || 'normal',
            fontStyle: data.fontStyle || 'normal',
            textDecoration: data.textDecoration || 'none',
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