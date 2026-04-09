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
  ConnectionLineType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import TextNode from './customNodes/TextNode';
import ImageNode from './customNodes/ImageNode';
import FloatingTextNode from './customNodes/FloatingTextNode';
import { useHotkeys } from 'react-hotkeys-hook';
import { saveBoard, loadBoard, uploadImage } from '../api';
import { useBoardStore } from '../store/boardStore';
import CanvasContextMenu from './CanvasContextMenu';
import ThemeToggle from './ThemeToggle';
import { useThemeStore } from '../store/themeStore';

const nodeTypes: NodeTypes = {
  text: TextNode,
  image: ImageNode,
  floatingText: FloatingTextNode,
};

export default function Canvas() {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const { currentBoardId } = useBoardStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { actualTheme } = useThemeStore();

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

  useHotkeys('ctrl+s', (e) => {
    e.preventDefault();
    if (currentBoardId) {
      setIsSaving(true);
      saveBoard(currentBoardId, { nodes, edges }).finally(() => {
        setTimeout(() => setIsSaving(false), 2000);
      });
    }
  }, [currentBoardId, nodes, edges]);

  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            try {
              const imageUrl = await uploadImage(file);
              addImageNode(imageUrl, { x: 100, y: 100 });
            } catch (err) {
              console.error('Failed to upload image', err);
            }
          }
          break;
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep', // гибкие линии
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 10,
              height: 10,
              color: actualTheme === 'dark' ? '#9ca3af' : '#4b5563',
            },
            style: {
              strokeWidth: 2,
              stroke: actualTheme === 'dark' ? '#9ca3af' : '#4b5563',
            },
          },
          eds
        )
      ),
    [setEdges, actualTheme]
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
        content: 'Edit me',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        color: actualTheme === 'dark' ? '#f3f4f6' : '#111827',
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
        content: 'Floating text',
        fontSize: 20,
        fontFamily: 'Arial',
        color: actualTheme === 'dark' ? '#f3f4f6' : '#111827',
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const addImageNode = (imageUrl: string, position: { x: number; y: number }) => {
    const newNode: Node = {
      id: `image-${Date.now()}`,
      type: 'image',
      position,
      data: { src: imageUrl, width: 200, height: 150 },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const handlePasteImage = () => {
    alert('Use Ctrl+V to paste image from clipboard');
  };

  const handleFreeDraw = () => {
    setIsDrawingMode((prev) => !prev);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file).then((url) => {
        addImageNode(url, { x: 200, y: 200 });
      });
    }
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
          nodesDraggable={!isDrawingMode}
          nodesConnectable={!isDrawingMode}
          elementsSelectable={!isDrawingMode}
          connectionLineType={ConnectionLineType.SmoothStep}
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

      <div className="absolute bottom-4 left-16 z-10 flex gap-2">
        <button
          onClick={addTextNode}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-full shadow-md text-sm transition-colors"
        >
          Text box
        </button>
        <button
          onClick={addFloatingTextNode}
          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded-full shadow-md text-sm transition-colors"
        >
          Floating text
        </button>
        <label className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-full shadow-md text-sm transition-colors cursor-pointer">
          Image
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </label>
        <button
          onClick={handleFreeDraw}
          className={`px-3 py-1.5 rounded-full shadow-md text-sm transition-colors ${
            isDrawingMode
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-purple-500 hover:bg-purple-600 text-white'
          }`}
        >
          {isDrawingMode ? 'Drawing (on)' : 'Drawing'}
        </button>
        <ThemeToggle />
      </div>

      {isSaving && (
        <div className="absolute bottom-4 right-4 z-10 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm shadow-md transition-opacity">
          Saved
        </div>
      )}

      {isDrawingMode && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-4 py-1 rounded-full text-sm shadow-md z-10">
          Drawing mode enabled (lines not saved yet)
        </div>
      )}
    </div>
  );
}