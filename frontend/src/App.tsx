import { useEffect } from 'react';
import Canvas from './components/Canvas';
import BoardSidebar from './components/BoardSidebar';
import { useBoardStore } from './store/boardStore';
import { createBoard } from './api';

function App() {
  const { fetchBoards, setCurrentBoardId } = useBoardStore();

  useEffect(() => {
    fetchBoards().then(() => {
      // Создаём доску по умолчанию, если список пуст
      const { boards } = useBoardStore.getState();
      if (boards.length === 0) {
        createBoard('My First Board').then((board) => {
          setCurrentBoardId(board.id);
        });
      } else {
        setCurrentBoardId(boards[0].id);
      }
    });
  }, [fetchBoards, setCurrentBoardId]);

  return (
    <div className="flex h-screen w-screen">
      <BoardSidebar />
      <div className="flex-1">
        <Canvas />
      </div>
    </div>
  );
}

export default App;