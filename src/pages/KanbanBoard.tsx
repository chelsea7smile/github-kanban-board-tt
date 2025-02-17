import React, { useEffect, useState, useCallback } from "react";
import { DndContext, closestCorners, DragOverlay } from "@dnd-kit/core";
import { createPortal } from "react-dom";
import { Layout, message } from "antd";
import { fetchIssues } from "../api/github";
import { useIssueStore } from "../store/useIssueStore";
import { Issue } from "../types/Issue";
import BoardHeader from "./BoardHeader";
import BoardColumns from "./BoardColumns";
import IssueCard from "../components/IssueCard";
import { useDragDrop } from "../hooks/useDragDrop";
import { STORAGE_KEY_REPO } from "../constants/constants";

const { Content } = Layout;

const KanbanBoard: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState<string>(
    () => localStorage.getItem(STORAGE_KEY_REPO) || ""
  );
  const [loading, setLoading] = useState(false);
  const { issues, setIssues, loadIssuesFromStorage } = useIssueStore();

  useEffect(() => {
    if (repoUrl) {
      loadIssuesFromStorage(repoUrl);
    }
  }, [repoUrl, loadIssuesFromStorage]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REPO, repoUrl);
  }, [repoUrl]);

  const loadIssues = useCallback(async () => {
    if (!repoUrl.trim()) {
      return message.error("Please enter a GitHub repo URL");
    }
    setLoading(true);
    try {
      const data: Issue[] = await fetchIssues(repoUrl);
      const transformed = data.map(issue => ({
        ...issue,
        createdAt: issue.created_at,
      }));
      const sorted = {
        todo: transformed.filter(issue => !issue.assignee && issue.state === "open"),
        inProgress: transformed.filter(issue => issue.assignee && issue.state === "open"),
        done: transformed.filter(issue => issue.state === "closed"),
      };
      setIssues(sorted, repoUrl);
    } catch {
      message.error("Failed to load issues");
    }
    setLoading(false);
  }, [repoUrl, setIssues]);

  const resetBoard = () => {
    localStorage.removeItem(repoUrl ? `kanban_issues_${repoUrl.replace("https://github.com/", "")}` : "");
    setRepoUrl("");
    setIssues({ todo: [], inProgress: [], done: [] }, repoUrl);
    message.success("Board has been reset.");
  };

  const { activeIssueId, dragOverlaySize, handleDragStart, handleDragEnd } = useDragDrop({
    issues,
    setIssues,
    repoUrl,
  });

  const activeIssue: Issue | null =
    issues.todo.find(issue => issue.id === activeIssueId) ||
    issues.inProgress.find(issue => issue.id === activeIssueId) ||
    issues.done.find(issue => issue.id === activeIssueId) ||
    null;

  return (
    <Layout>
      <Content style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <BoardHeader
          repoUrl={repoUrl}
          setRepoUrl={setRepoUrl}
          loading={loading}
          onLoadIssues={loadIssues}
          onResetBoard={resetBoard}
        />

        <DndContext
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <BoardColumns issues={issues} />

          {createPortal(
            <DragOverlay adjustScale={false}>
              {activeIssue && (
                <IssueCard
                  isOverlay
                  style={{
                    width: dragOverlaySize?.width,
                    height: dragOverlaySize?.height,
                  }}
                  id={activeIssue.id}
                  title={activeIssue.title}
                  number={activeIssue.number}
                  user={activeIssue.user}
                  htmlUrl={activeIssue.html_url}
                  columnId=""
                  comments={activeIssue.comments}
                  createdAt={activeIssue.createdAt || activeIssue.created_at}
                />
              )}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </Content>
    </Layout>
  );
};

export default KanbanBoard;