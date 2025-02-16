export interface BoardHeaderProps {
  repoUrl: string;
  setRepoUrl: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  onLoadIssues: () => void;
  onResetBoard: () => void;
}