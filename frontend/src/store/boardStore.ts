import { create } from 'zustand';

interface Board {
  id: number;
  name: string;
  data: any;
}

interface BoardStore {
  boards: Board[];
  currentBoardId: number | null;
  setBoards: (boards: Board[]) => void;
  setCurrentBoardId: (id: number | null) => void;
  fetchBoards: () => Promise<void>;
}

export const useBoardStore = create<BoardStore>((set) => ({
  boards: [],
  currentBoardId: null,
  setBoards: (boards) => set({ boards }),
  setCurrentBoardId: (id) => set({ currentBoardId: id }),
  fetchBoards: async () => {
    const { getBoards } = await import('../api');
    const boards = await getBoards();
    set({ boards });
  },
}));