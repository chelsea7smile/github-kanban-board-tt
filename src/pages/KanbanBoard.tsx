import { useState } from 'react';
import { Input, Button, Layout, Typography, Row, Col, message } from 'antd';
import { DndContext, closestCorners, DragOverlay } from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import Column from '../components/Column';
import IssueCard from '../components/IssueCard';
import { fetchIssues } from '../api/github';

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

const KanbanBoard = () => {
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [issues, setIssues] = useState<Record<string, Issue[]>>({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);

  const handleLoadIssues = async () => {
    if (!repoUrl.trim()) {
      message.error('Please enter a GitHub repo URL');
      return;
    }

    setLoading(true);
    try {
      const data = await fetchIssues(repoUrl);

      const sortedIssues = {
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

  const handleDragStart = (event: any) => {
    const { active } = event;
    const columnId = active.data.current?.column;
    if (!columnId) return;

    const issue = issues[columnId].find((issue) => issue.id.toString() === active.id);
    setActiveIssue(issue || null);
  };

  const handleDragEnd = (event: any) => {
    setActiveIssue(null);
    const { active, over } = event;
    if (!over) return;

    const sourceColumnId = active.data.current?.column;
    const destinationColumnId = over.data.current?.column;

    if (!sourceColumnId || !destinationColumnId || sourceColumnId === destinationColumnId) return;

    setIssues((prevIssues) => {
      const updatedIssues = { ...prevIssues };
      const movedIssueIndex = updatedIssues[sourceColumnId].findIndex((issue) => issue.id.toString() === active.id);
      if (movedIssueIndex === -1) return prevIssues;

      const [movedIssue] = updatedIssues[sourceColumnId].splice(movedIssueIndex, 1);
      updatedIssues[destinationColumnId].push(movedIssue);

      return updatedIssues;
    });
  };

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

        <DndContext 
          collisionDetection={closestCorners} 
          onDragStart={handleDragStart} 
          onDragEnd={handleDragEnd}
        >
          <Row gutter={16} style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <Col span={8}>
              <Column title="ToDo" issues={issues.todo} columnId="todo" />
            </Col>
            <Col span={8}>
              <Column title="In Progress" issues={issues.inProgress} columnId="inProgress" />
            </Col>
            <Col span={8}>
              <Column title="Done" issues={issues.done} columnId="done" />
            </Col>
          </Row>

          {createPortal(
            <DragOverlay>
              {activeIssue ? (
                <IssueCard
                  id={activeIssue.id}
                  title={activeIssue.title}
                  number={activeIssue.number}
                  user={activeIssue.user}
                  url={activeIssue.url}
                  columnId=""
                />
              ) : null}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </Content>
    </Layout>
  );
};

export default KanbanBoard;