import { create } from 'zustand';
import { Issue } from '../types/Issue';

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
        const transformedIssues: Record<'todo' | 'inProgress' | 'done', Issue[]> = {
          todo: parsedIssues.todo.map(issue => ({
            ...issue,
            createdAt: issue.created_at,
          })),
          inProgress: parsedIssues.inProgress.map(issue => ({
            ...issue,
            createdAt: issue.created_at,
          })),
          done: parsedIssues.done.map(issue => ({
            ...issue,
            createdAt: issue.created_at,
          })),
        };
        set({ issues: transformedIssues });
      } catch (error) {
        console.error('Failed to parse stored issues:', error);
      }
    }
  },
}));