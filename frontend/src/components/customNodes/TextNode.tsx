import { memo, useState, useRef, useEffect, useCallback } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';

const TextNode = ({ id, data, selected }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(data.content || 'Text');
  const [fontSize, setFontSize] = useState(data.fontSize || 16);
  const [fontFamily, setFontFamily] = useState(data.fontFamily || 'Arial');
  const [fontWeight, setFontWeight] = useState(data.fontWeight || 'normal');
  const [fontStyle, setFontStyle] = useState(data.fontStyle || 'normal');
  const [textDecoration, setTextDecoration] = useState(data.textDecoration || 'none');
  const [color, setColor] = useState(data.color || '#111827');
  const [borderRadius, setBorderRadius] = useState(8);
  const nodeRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    data.content = content;
    data.fontSize = fontSize;
    data.fontFamily = fontFamily;
    data.fontWeight = fontWeight;
    data.fontStyle = fontStyle;
    data.textDecoration = textDecoration;
    data.color = color;
  }, [content, fontSize, fontFamily, fontWeight, fontStyle, textDecoration, color, data]);

  useEffect(() => {
    if (!nodeRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const minDim = Math.min(width, height);
      const newRadius = Math.min(32, Math.max(4, minDim * 0.1));
      setBorderRadius(newRadius);
    });
    observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, []);

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
    const newSize = Math.max(12, Math.min(72, params.width * 0.12));
    setFontSize(newSize);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      ref={nodeRef}
      className="relative bg-node-light dark:bg-node-dark border border-border-light dark:border-border-dark shadow-sm transition-colors"
      style={{ borderRadius: `${borderRadius}px`, minWidth: 80, minHeight: 40 }}
      onContextMenu={handleContextMenu}
    >
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={50}
        minHeight={30}
        onResize={handleResize}
        keepAspectRatio={false}
      />
      {/* 4 стандартные точки подключения */}
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Top} id="top-source" />
      <Handle type="target" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Bottom} id="bottom-source" />
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Left} id="left-source" />
      <Handle type="target" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Right} id="right-source" />

      {isEditing ? (
        <div className="p-1">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
            style={{
              fontSize: `${fontSize}px`,
              fontFamily,
              fontWeight,
              fontStyle,
              textDecoration,
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
          <div className="flex gap-1 mt-1">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-5 h-5 p-0 border-0"
            />
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="text-xs border rounded"
            >
              <option value="Arial">Arial</option>
              <option value="Roboto">Roboto</option>
              <option value="monospace">Monospace</option>
            </select>
          </div>
        </div>
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          style={{
            fontSize: `${fontSize}px`,
            fontFamily,
            fontWeight,
            fontStyle,
            textDecoration,
            color,
            padding: '4px',
            cursor: 'text',
          }}
          className="whitespace-pre-wrap break-words"
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default memo(TextNode);