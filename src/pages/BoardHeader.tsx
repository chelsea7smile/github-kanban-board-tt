import React from "react";
import { Typography, Input, Button } from "antd";

const { Title } = Typography;

interface BoardHeaderProps {
  repoUrl: string;
  setRepoUrl: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  onLoadIssues: () => void;
  onResetBoard: () => void;
}

const BoardHeader: React.FC<BoardHeaderProps> = ({
  repoUrl,
  setRepoUrl,
  loading,
  onLoadIssues,
  onResetBoard
}) => {
  return (
    <div style={{ textAlign: "center", marginBottom: 20 }}>
      <Title level={2}>GitHub Kanban Board</Title>

      <Input
        data-cy="repo-url-input"
        placeholder="Enter GitHub repo URL (e.g. https://github.com/facebook/react)"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        style={{ marginBottom: 10 }}
      />

      <Button
        data-cy="load-issues-btn"
        type="primary"
        onClick={onLoadIssues}
        block
        loading={loading}
      >
        {loading ? "Loading..." : "Load Issues"}
      </Button>

      <Button
        data-cy="reset-board-btn"
        danger
        onClick={onResetBoard}
        block
        style={{ marginTop: 10 }}
      >
        Reset Board
      </Button>
    </div>
  );
};

export default BoardHeader;