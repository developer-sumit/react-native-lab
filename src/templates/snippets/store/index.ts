export const StateManagementTemplates = {
  zustand: `import { create } from 'zustand';

interface AppState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useStore = create<AppState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
`,
  "redux-toolkit": `// Planned for later`,
};
