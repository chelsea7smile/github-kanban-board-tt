import { useState } from 'react';
import { Input, Button, Layout, Typography, Row, Col, message } from 'antd';
import Column from '../components/Column';
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
  const [repoUrl, setRepoUrl] = useState('');
  const [issues, setIssues] = useState<{ todo: Issue[]; inProgress: Issue[]; done: Issue[] }>({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [loading, setLoading] = useState(false);

  const issuesMock = [
    {
      id: 1,
      title: 'Fix login bug',
      number: 101,
      user: { login: 'octocat', avatar_url: 'https://github.com/octocat.png' },
      url: 'https://github.com/facebook/react/issues/101',
    },
    {
      id: 2,
      title: 'Improve UI layout',
      number: 102,
      user: { login: 'john-doe', avatar_url: 'https://github.com/john-doe.png' },
      url: 'https://github.com/facebook/react/issues/102',
    },
  ];

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

        <Row gutter={16} style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <Col span={8}>
            <Column title="ToDo" issues={issues.todo.length ? issues.todo : issuesMock} />
          </Col>
          <Col span={8}>
            <Column title="In Progress" issues={issues.inProgress} />
          </Col>
          <Col span={8}>
            <Column title="Done" issues={issues.done} />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default KanbanBoard;