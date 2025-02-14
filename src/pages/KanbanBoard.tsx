import { useState } from 'react';
import { Input, Button, Layout, Typography, Row, Col } from 'antd';
import Column from '../components/Column';

const { Header, Content } = Layout;
const { Title } = Typography;

const KanbanBoard = () => {
  const [repoUrl, setRepoUrl] = useState('');

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

  const handleLoadIssues = () => {
    console.log('Загружаем задачи из:', repoUrl);
    //    API
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
        <Button type="primary" onClick={handleLoadIssues} block>
          Load Issues
        </Button>

        <Row gutter={16} style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <Col span={8}>
            <Column title="ToDo" issues={issuesMock} />
          </Col>
          <Col span={8}>
            <Column title="In Progress" issues={[]} />
          </Col>
          <Col span={8}>
            <Column title="Done" issues={[]} />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default KanbanBoard;