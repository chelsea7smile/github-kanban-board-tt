import { useEffect, useState } from "react";
import {
  Input,
  Button,
  Layout,
  Typography,
  Row,
  Col,
  message,
  Select
} from "antd";
import {
  DndContext,
  closestCorners,
  DragOverlay,
  DragStartEvent,
  DragEndEvent
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import Column from "../components/Column";
import IssueCard from "../components/IssueCard";
import { fetchIssues } from "../api/github";
import { useIssueStore } from "../store/useIssueStore";
import { Issue } from "../types/Issue";

const { Content } = Layout;
const { Title } = Typography;

const COLUMN_KEYS = ["todo", "inProgress", "done"] as const;
type ColumnKey = (typeof COLUMN_KEYS)[number];

const STORAGE_KEY_REPO = "kanban_repo_url";

const KanbanBoard = () => {
  const [repoUrl, setRepoUrl] = useState<string>(
    () => localStorage.getItem(STORAGE_KEY_REPO) || ""
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [activeIssueId, setActiveIssueId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const [selectedColumn, setSelectedColumn] = useState<ColumnKey>("todo");

  const { issues, setIssues, loadIssuesFromStorage } = useIssueStore();

  useEffect(() => {
    loadIssuesFromStorage();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REPO, repoUrl);
  }, [repoUrl]);

  const handleLoadIssues = async () => {
    if (!repoUrl.trim()) {
      message.error("Please enter a GitHub repo URL");
      return;
    }

    setLoading(true);
    try {
      const data: Issue[] = await fetchIssues(repoUrl);
      console.log("Raw issues from API:", data);

      const transformedIssues = data.map((issue) => ({
        ...issue,
        createdAt: issue.created_at
      }));
      console.log("Transformed issues:", transformedIssues);

      const sortedIssues: Record<ColumnKey, Issue[]> = {
        todo: transformedIssues.filter(
          (issue) => !issue.assignee && issue.state === "open"
        ),
        inProgress: transformedIssues.filter(
          (issue) => issue.assignee && issue.state === "open"
        ),
        done: transformedIssues.filter((issue) => issue.state === "closed")
      };

      setIssues(sortedIssues);
    } catch (error) {
      message.error("Failed to load issues");
    }
    setLoading(false);
  };

  const handleResetBoard = () => {
    localStorage.removeItem(STORAGE_KEY_REPO);
    setRepoUrl("");

    setIssues({
      todo: [],
      inProgress: [],
      done: []
    });

    message.success("Board has been reset.");
  };

  // DnD
  const handleDragStart = (event: DragStartEvent) => {
    setActiveIssueId(Number(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveIssueId(null);
    if (!event.over) return;

    const activeId = Number(event.active.id);
    const sourceColumnId = event.active.data.current?.column as ColumnKey;
    const destinationColumnId = event.over.data.current?.column as ColumnKey;

    if (!sourceColumnId || !destinationColumnId || sourceColumnId === destinationColumnId)
      return;

    const updatedIssues: Record<ColumnKey, Issue[]> = {
      todo: [...issues.todo],
      inProgress: [...issues.inProgress],
      done: [...issues.done]
    };

    const movedIssueIndex = updatedIssues[sourceColumnId].findIndex(
      (issue) => issue.id === activeId
    );
    if (movedIssueIndex === -1) return;

    const [movedIssue] = updatedIssues[sourceColumnId].splice(movedIssueIndex, 1);
    updatedIssues[destinationColumnId] = [
      movedIssue,
      ...updatedIssues[destinationColumnId]
    ];

    setIssues(updatedIssues);
  };

  const activeIssue: Issue | null =
    issues.todo.find((issue) => issue.id === activeIssueId) ||
    issues.inProgress.find((issue) => issue.id === activeIssueId) ||
    issues.done.find((issue) => issue.id === activeIssueId) ||
    null;

  return (
    <Layout>
      <Content style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <Title level={2} style={{ textAlign: "center" }}>
          GitHub Kanban Board
        </Title>

        <Input
          data-cy="repo-url-input"
          placeholder="Enter GitHub repo URL (e.g. https://github.com/facebook/react)"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          style={{ marginBottom: "10px" }}
        />

        <Button
          data-cy="load-issues-btn"
          type="primary"
          onClick={handleLoadIssues}
          block
          loading={loading}
        >
          {loading ? "Loading..." : "Load Issues"}
        </Button>

        <Button
          data-cy="reset-board-btn"
          danger
          onClick={handleResetBoard}
          block
          style={{ marginTop: "10px" }}
        >
          Reset Board
        </Button>

        <DndContext
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {isMobile ? (
            <>
              <Select
                value={selectedColumn}
                onChange={(value) => setSelectedColumn(value)}
                style={{ width: "100%", marginTop: "20px", marginBottom: "20px" }}
              >
                <Select.Option value="todo">ToDo</Select.Option>
                <Select.Option value="inProgress">In Progress</Select.Option>
                <Select.Option value="done">Done</Select.Option>
              </Select>
              <Column
                title={
                  selectedColumn === "todo"
                    ? "ToDo"
                    : selectedColumn === "inProgress"
                    ? "In Progress"
                    : "Done"
                }
                issues={issues[selectedColumn]}
                columnId={selectedColumn}
              />
            </>
          ) : (
            <Row
              gutter={8}
              style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}
            >
              <Col span={8} style={{ minWidth: "190px" }}>
                <Column title="ToDo" issues={issues.todo} columnId="todo" />
              </Col>
              <Col span={8} style={{ minWidth: "190px" }}>
                <Column title="In Progress" issues={issues.inProgress} columnId="inProgress" />
              </Col>
              <Col span={8} style={{ minWidth: "190px" }}>
                <Column title="Done" issues={issues.done} columnId="done" />
              </Col>
            </Row>
          )}

          {createPortal(
            <DragOverlay>
              {activeIssue && (
                <IssueCard
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