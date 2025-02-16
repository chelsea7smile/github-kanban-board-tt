export interface Issue {
  createdAt: string;
  created_at: string;
  comments: number;
  id: number;
  title: string;
  number: number;
  user: {
    login: string;
    avatar_url: string;
  };
  url: string;
  html_url: string;
  assignee: null | { login: string };
  state: 'open' | 'closed';
}