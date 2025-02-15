import { useEffect, useState } from 'react';
import { Input, Button, Layout, Typography, Row, Col, message } from 'antd';
import { DndContext, closestCorners, DragOverlay, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import Column from '../components/Column';
import IssueCard from '../components/IssueCard';
import { fetchIssues } from '../api/github';
import { useIssueStore } from '../store/useIssueStore';

const { Header, Content } = Layout;
const { Title } = Typography;

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

const COLUMN_KEYS = ['todo', 'inProgress', 'done'] as const;
type ColumnKey = (typeof COLUMN_KEYS)[number];

const STORAGE_KEY_REPO = 'kanban_repo_url';

const KanbanBoard = () => {
  const [repoUrl, setRepoUrl] = useState<string>(() => localStorage.getItem(STORAGE_KEY_REPO) || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [activeIssueId, setActiveIssueId] = useState<number | null>(null);

  const { issues, setIssues, loadIssuesFromStorage } = useIssueStore();

  useEffect(() => {
    loadIssuesFromStorage();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REPO, repoUrl);
  }, [repoUrl]);

  const handleLoadIssues = async () => {
    if (!repoUrl.trim()) {
      message.error('Please enter a GitHub repo URL');
      return;
    }

    setLoading(true);
    try {
      const data: Issue[] = await fetchIssues(repoUrl);

      const sortedIssues: Record<ColumnKey, Issue[]> = {
        todo: data.filter((issue: Issue) => !issue.assignee && issue.state === 'open'),
        inProgress: data.filter((issue: Issue) => issue.assignee && issue.state === 'open'),
        done: data.filter((issue: Issue) => issue.state === 'closed'),
      };

      setIssues(sortedIssues);
    } catch (error) {
      message.error('Failed to load issues');
    }
    setLoading(false);
  };

  const handleResetBoard = () => {
    localStorage.removeItem(STORAGE_KEY_REPO);
    setRepoUrl('');

    setIssues({
      todo: [],
      inProgress: [],
      done: [],
    });

    message.success('Board has been reset.');
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveIssueId(Number(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveIssueId(null);
    if (!event.over) return;
  
    const activeId = Number(event.active.id);
    const sourceColumnId = event.active.data.current?.column as ColumnKey;
    const destinationColumnId = event.over.data.current?.column as ColumnKey;
  
    if (!sourceColumnId || !destinationColumnId || sourceColumnId === destinationColumnId) return;
  
    const updatedIssues: Record<ColumnKey, Issue[]> = {
      todo: [...issues.todo],
      inProgress: [...issues.inProgress],
      done: [...issues.done],
    };
  
    const movedIssueIndex = updatedIssues[sourceColumnId].findIndex((issue) => issue.id === activeId);
    if (movedIssueIndex === -1) return;
  
    const [movedIssue] = updatedIssues[sourceColumnId].splice(movedIssueIndex, 1);
    updatedIssues[destinationColumnId] = [...updatedIssues[destinationColumnId], movedIssue];
  
    setIssues(updatedIssues);
  };

  const activeIssue: Issue | null =
    issues.todo.find((issue: Issue) => issue.id === activeIssueId) ||
    issues.inProgress.find((issue: Issue) => issue.id === activeIssueId) ||
    issues.done.find((issue: Issue) => issue.id === activeIssueId) ||
    null;

  return (
    <Layout style={{ minHeight: '100vh', padding: '20px' }}>
      <Header style={{ background: '#fff', padding: '10px', textAlign: 'center' }}>
        <Title level={2}>GitHub Kanban Board</Title>
      </Header>

      <Content style={{ maxWidth: '1400px', margin: '20px auto' }}>
        <Input
          placeholder="Enter GitHub repo URL (e.g. https://github.com/facebook/react)"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <Button type="primary" onClick={handleLoadIssues} block loading={loading}>
          {loading ? 'Loading...' : 'Load Issues'}
        </Button>

        <Button 
          danger 
          onClick={handleResetBoard} 
          block 
          style={{ marginTop: '10px' }}
        >
          Reset Board
        </Button>

        <DndContext 
          collisionDetection={closestCorners} 
          onDragStart={handleDragStart} 
          onDragEnd={handleDragEnd}
        >
          <Row gutter={8} style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <Col span={8} style={{ minWidth: '190px' }}>
              <Column title="ToDo" issues={issues.todo} columnId="todo" />
            </Col>
            <Col span={8} style={{ minWidth: '190px' }}>
              <Column title="In Progress" issues={issues.inProgress} columnId="inProgress" />
            </Col>
            <Col span={8} style={{ minWidth: '190px' }}>
              <Column title="Done" issues={issues.done} columnId="done" />
            </Col>
          </Row>

          {createPortal(
            <DragOverlay>
              {activeIssue && (
                <IssueCard
                  id={activeIssue.id}
                  title={activeIssue.title}
                  number={activeIssue.number}
                  user={activeIssue.user}
                  url={activeIssue.url}
                  columnId=""
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