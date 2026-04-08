import { useEffect } from 'react';
import Canvas from './components/Canvas';
import BoardSidebar from './components/BoardSidebar';
import { useBoardStore } from './store/boardStore';
import { createBoard } from './api';

function App() {
  const { fetchBoards, setCurrentBoardId, boards } = useBoardStore();

  useEffect(() => {
    fetchBoards().then(() => {
      const { boards } = useBoardStore.getState();
      if (boards.length === 0) {
        createBoard('Моя первая доска').then((board) => {
          setCurrentBoardId(board.id);
        });
      } else {
        setCurrentBoardId(boards[0].id);
      }
    });
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <BoardSidebar />
      <div className="flex-1 relative">
        <Canvas />
      </div>
    </div>
  );
}

export default App;