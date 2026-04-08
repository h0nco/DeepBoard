import { memo, useState, useRef, useEffect, useCallback } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';

const TextNode = ({ id, data, selected }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(data.content);
  const [fontSize, setFontSize] = useState(data.fontSize || 16);
  const [fontFamily, setFontFamily] = useState(data.fontFamily || 'Arial');
  const [fontWeight, setFontWeight] = useState(data.fontWeight || 'normal');
  const [fontStyle, setFontStyle] = useState(data.fontStyle || 'normal');
  const [textDecoration, setTextDecoration] = useState(data.textDecoration || 'none');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Обновление данных узла при изменении стилей
  useEffect(() => {
    data.content = content;
    data.fontSize = fontSize;
    data.fontFamily = fontFamily;
    data.fontWeight = fontWeight;
    data.fontStyle = fontStyle;
    data.textDecoration = textDecoration;
  }, [content, fontSize, fontFamily, fontWeight, fontStyle, textDecoration, data]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // Автоматическая высота textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content, isEditing]);

  const handleResize = useCallback((_: any, params: any) => {
    // Можно позже привязать изменение размера шрифта к размерам узла
    // Пока просто разрешаем ресайз
  }, []);

  return (
    <div
      className="relative bg-white border border-gray-300 rounded shadow-sm"
      style={{ minWidth: 100, minHeight: 40 }}
    >
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={50}
        minHeight={30}
        onResize={handleResize}
        keepAspectRatio={false}
      />
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Left} />

      {isEditing ? (
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
            width: '100%',
            border: 'none',
            outline: 'none',
            resize: 'none',
            padding: '4px',
          }}
          className="bg-transparent"
        />
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          style={{
            fontSize: `${fontSize}px`,
            fontFamily,
            fontWeight,
            fontStyle,
            textDecoration,
            padding: '4px',
            cursor: 'text',
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default memo(TextNode);