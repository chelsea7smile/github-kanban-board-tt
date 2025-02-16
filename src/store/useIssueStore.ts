import { create } from 'zustand';
import { Issue } from '../types/Issue';

interface IssueState {
  issues: Record<'todo' | 'inProgress' | 'done', Issue[]>;
  setIssues: (newIssues: Record<'todo' | 'inProgress' | 'done', Issue[]>, repoUrl: string) => void;
  loadIssuesFromStorage: (repoUrl: string) => void;
}

const getStorageKey = (repoUrl: string) => {
  const repoPath = repoUrl.replace("https://github.com/", "");
  return `kanban_issues_${repoPath}`;
};

export const useIssueStore = create<IssueState>((set) => ({
  issues: { todo: [], inProgress: [], done: [] },

  setIssues: (newIssues, repoUrl) => {
    set({ issues: newIssues });
    const key = getStorageKey(repoUrl);
    localStorage.setItem(key, JSON.stringify(newIssues));
  },

  loadIssuesFromStorage: (repoUrl) => {
    const key = getStorageKey(repoUrl);
    const savedIssues = localStorage.getItem(key);
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