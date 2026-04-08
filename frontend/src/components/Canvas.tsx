import { useCallback, useRef, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
  MarkerType,
  NodeTypes,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import TextNode from './customNodes/TextNode';
import ImageNode from './customNodes/ImageNode';
import FloatingTextNode from './customNodes/FloatingTextNode';
import { useHotkeys } from 'react-hotkeys-hook';
import { saveBoard, loadBoard } from '../api';
import { useBoardStore } from '../store/boardStore';
import CanvasContextMenu from './CanvasContextMenu';
import ThemeToggle from './ThemeToggle';
import { useThemeStore } from '../store/themeStore';

const nodeTypes: NodeTypes = {
  text: TextNode,
  image: ImageNode,
  floatingText: FloatingTextNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export default function Canvas() {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const [isSaving, setIsSaving] = useState(false);
  const { currentBoardId } = useBoardStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { actualTheme } = useThemeStore();

  // Загрузка доски при смене currentBoardId
  useEffect(() => {
    if (currentBoardId) {
      loadBoard(currentBoardId).then((data) => {
        if (data) {
          setNodes(data.nodes || []);
          setEdges(data.edges || []);
        }
      });
    }
  }, [currentBoardId, setNodes, setEdges]);

  // Автосохранение каждые 20 секунд, только если есть изменения
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentBoardId && (nodes.length > 0 || edges.length > 0)) {
        setIsSaving(true);
        saveBoard(currentBoardId, { nodes, edges }).finally(() => {
          setTimeout(() => setIsSaving(false), 2000);
        });
      }
    }, 20000);
    return () => clearInterval(interval);
  }, [nodes, edges, currentBoardId]);

  // Ручное сохранение Ctrl+S
  useHotkeys(
    'ctrl+s',
    (e) => {
      e.preventDefault();
      if (currentBoardId) {
        setIsSaving(true);
        saveBoard(currentBoardId, { nodes, edges }).finally(() => {
          setTimeout(() => setIsSaving(false), 2000);
        });
      }
    },
    [currentBoardId, nodes, edges]
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'default',
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          eds
        )
      ),
    [setEdges]
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const addTextNode = () => {
    const newNode: Node = {
      id: `text-${Date.now()}`,
      type: 'text',
      position: { x: 100, y: 100 },
      data: {
        content: 'Редактируемый текст',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const addFloatingTextNode = () => {
    const newNode: Node = {
      id: `floating-${Date.now()}`,
      type: 'floatingText',
      position: { x: 150, y: 150 },
      data: {
        content: 'Плавающий текст',
        fontSize: 20,
        fontFamily: 'Arial',
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  // Заглушки для функций контекстного меню
  const handlePasteImage = () => {
    // TODO: реализовать вставку изображения из буфера
    console.log('Вставка изображения (пока заглушка)');
  };

  const handleFreeDraw = () => {
    // TODO: включить режим рисования
    console.log('Свободное рисование (пока заглушка)');
  };

  return (
    <div
      ref={reactFlowWrapper}
      className="w-full h-full bg-canvas-light dark:bg-canvas-dark transition-colors"
    >
      <CanvasContextMenu
        onAddText={addFloatingTextNode}
        onPasteImage={handlePasteImage}
        onFreeDraw={handleFreeDraw}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          deleteKeyCode="Delete"
          multiSelectionKeyCode="Shift"
          selectionOnDrag
          panOnDrag
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={12}
            size={1}
            color={actualTheme === 'dark' ? '#4b5563' : '#d1d5db'}
          />
          <Controls />
        </ReactFlow>
      </CanvasContextMenu>

      <div className="absolute bottom-4 left-4 z-10 flex gap-2">
        <button
          onClick={addTextNode}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transition-colors"
        >
          + Текст с рамкой
        </button>
        <button
          onClick={addFloatingTextNode}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md shadow-md transition-colors"
        >
          + Плавающий текст
        </button>
        <ThemeToggle />
      </div>

      {isSaving && (
        <div className="absolute bottom-4 right-4 z-10 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm shadow-md transition-opacity">
          💾 Сохранено
        </div>
      )}
    </div>
  );
}