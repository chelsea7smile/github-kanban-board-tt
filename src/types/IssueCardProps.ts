export interface IssueCardProps {
  id: number;
  title: string;
  number: number;
  user: {
    login: string;
    avatar_url: string;
  };
  htmlUrl: string;
  columnId: string;
  comments: number;
  createdAt: string;
}