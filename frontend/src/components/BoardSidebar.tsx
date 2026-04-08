import { useState } from 'react';
import { useBoardStore } from '../store/boardStore';
import { createBoard, deleteBoard } from '../api';

export default function BoardSidebar() {
  const { boards, currentBoardId, setCurrentBoardId, fetchBoards } = useBoardStore();
  const [isHovered, setIsHovered] = useState(false);

  const handleNewBoard = async () => {
    const name = prompt('Board name', `Board ${boards.length + 1}`);
    if (name) {
      const newBoard = await createBoard(name);
      await fetchBoards();
      setCurrentBoardId(newBoard.id);
    }
  };

  const handleDeleteBoard = async (id: number) => {
    if (confirm('Delete board?')) {
      await deleteBoard(id);
      await fetchBoards();
      if (currentBoardId === id) {
        const remaining = boards.filter(b => b.id !== id);
        setCurrentBoardId(remaining.length > 0 ? remaining[0].id : null);
      }
    }
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-canvas-light dark:bg-canvas-dark border-r border-border-light dark:border-border-dark transition-all duration-200 z-20 shadow-lg ${
        isHovered ? 'w-64' : 'w-12'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-2 h-full flex flex-col">
        {isHovered ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Boards</h2>
              <button
                onClick={handleNewBoard}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                title="New board"
              >
                + New
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {boards.map((board) => (
                <div
                  key={board.id}
                  className={`group flex items-center justify-between p-2 mb-1 rounded-lg cursor-pointer ${
                    currentBoardId === board.id
                      ? 'bg-blue-100 dark:bg-blue-900'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setCurrentBoardId(board.id)}
                >
                  <span className="truncate text-sm">{board.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBoard(board.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-4 mt-4">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              B
            </div>
          </div>
        )}
      </div>
    </div>
  );
}