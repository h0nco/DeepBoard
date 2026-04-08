import { useCallback, useRef, useEffect } from 'react';
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
import { useHotkeys } from 'react-hotkeys-hook';
import { saveBoard, loadBoard } from '../api';
import { useBoardStore } from '../store/boardStore';

const nodeTypes: NodeTypes = {
  text: TextNode,
  image: ImageNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export default function Canvas() {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const { currentBoardId } = useBoardStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

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

  // Автосохранение каждые 30 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentBoardId) {
        saveBoard(currentBoardId, { nodes, edges });
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [nodes, edges, currentBoardId]);

  // Ручное сохранение Ctrl+S
  useHotkeys(
    'ctrl+s',
    (e) => {
      e.preventDefault();
      if (currentBoardId) {
        saveBoard(currentBoardId, { nodes, edges });
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
        content: 'Edit me',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  // TODO: добавить загрузку изображений (вставка из буфера, выбор файла)

  return (
    <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
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
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
      </ReactFlow>
      <div style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 10 }}>
        <button
          onClick={addTextNode}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          + Add Text
        </button>
      </div>
    </div>
  );
}