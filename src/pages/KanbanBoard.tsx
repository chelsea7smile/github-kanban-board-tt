import React, { useEffect, useState, useCallback } from "react";
import {
  DndContext,
  closestCorners,
  DragOverlay,
  DragStartEvent,
  DragEndEvent
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import { Layout, message } from "antd";
import { fetchIssues } from "../api/github";
import { useIssueStore } from "../store/useIssueStore";
import { Issue } from "../types/Issue";
import BoardHeader from "./BoardHeader";
import BoardColumns from "./BoardColumns";
import IssueCard from "../components/IssueCard";

const { Content } = Layout;
const COLUMN_KEYS = ["todo", "inProgress", "done"] as const;
type ColumnKey = (typeof COLUMN_KEYS)[number];
const STORAGE_KEY_REPO = "kanban_repo_url";

const arrayMove = <T,>(array: T[], fromIndex: number, toIndex: number): T[] => {
  const newArray = [...array];
  const [movedItem] = newArray.splice(fromIndex, 1);
  newArray.splice(toIndex, 0, movedItem);
  return newArray;
};

const KanbanBoard: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState<string>(
    () => localStorage.getItem(STORAGE_KEY_REPO) || ""
  );
  const [loading, setLoading] = useState(false);
  const [activeIssueId, setActiveIssueId] = useState<number | null>(null);
  const [dragOverlaySize, setDragOverlaySize] = useState<{ width: number; height: number } | null>(null);
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
        createdAt: issue.created_at
      }));
      const sorted: Record<ColumnKey, Issue[]> = {
        todo: transformed.filter(issue => !issue.assignee && issue.state === "open"),
        inProgress: transformed.filter(issue => issue.assignee && issue.state === "open"),
        done: transformed.filter(issue => issue.state === "closed")
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

  const handleDragStart = (e: DragStartEvent) => {
    setActiveIssueId(Number(e.active.id));
    const node = document.querySelector(`[data-cy="issue-${e.active.id}"]`) as HTMLElement;
    if (node) {
      const rect = node.getBoundingClientRect();
      setDragOverlaySize({
        width: rect.width,
        height: rect.height,
      });
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveIssueId(null);
    setDragOverlaySize(null);
    if (!e.over) return;
    
    const activeId = Number(e.active.id);
    const source = e.active.data.current?.column as ColumnKey;
    const destination = e.over.data.current?.column as ColumnKey;
    if (!source || !destination) return;
    
    if (source === destination) {
      const currentColumn = issues[source];
      const fromIndex = currentColumn.findIndex(issue => issue.id === activeId);
      const toIndex =
        e.over && e.over.id
          ? currentColumn.findIndex(issue => issue.id === Number(e.over!.id))
          : currentColumn.length - 1;
      if (fromIndex === -1 || toIndex === -1) return;
      const newColumn = arrayMove(currentColumn, fromIndex, toIndex);
      const newIssues: Record<ColumnKey, Issue[]> = {
        ...issues,
        [source]: newColumn
      };
      setIssues(newIssues, repoUrl);
      return;
    }
    
    const updated: Record<ColumnKey, Issue[]> = {
      todo: [...issues.todo],
      inProgress: [...issues.inProgress],
      done: [...issues.done]
    };
    const idx = updated[source].findIndex(issue => issue.id === activeId);
    if (idx === -1) return;
    const [moved] = updated[source].splice(idx, 1);
    updated[destination] = [moved, ...updated[destination]];
    setIssues(updated, repoUrl);
  };

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
                    height: dragOverlaySize?.height
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