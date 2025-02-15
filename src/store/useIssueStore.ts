import { create } from 'zustand';

interface Issue {
  id: number;
  title: string;
  number: number;
  user: {
    login: string;
    avatar_url: string;
  };
  url: string;
  assignee: null | { login: string };
  state: 'open' | 'closed';
}

interface IssueState {
  issues: Record<'todo' | 'inProgress' | 'done', Issue[]>;
  setIssues: (newIssues: Record<'todo' | 'inProgress' | 'done', Issue[]>) => void;
  loadIssuesFromStorage: () => void;
}

const STORAGE_KEY = 'kanban_issues';

export const useIssueStore = create<IssueState>((set) => ({
  issues: { todo: [], inProgress: [], done: [] },

  setIssues: (newIssues) => {
    set({ issues: newIssues });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newIssues));
  },

  loadIssuesFromStorage: () => {
    const savedIssues = localStorage.getItem(STORAGE_KEY);
    if (savedIssues) {
      try {
        const parsedIssues: Record<'todo' | 'inProgress' | 'done', Issue[]> = JSON.parse(savedIssues);
        set({ issues: parsedIssues });
      } catch (error) {
        console.error('Failed to parse stored issues:', error);
      }
    }
  },
}));