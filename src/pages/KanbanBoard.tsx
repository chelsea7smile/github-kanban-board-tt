import { useState } from 'react';
import { Input, Button, Layout, Typography } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;

const KanbanBoard = () => {
  const [repoUrl, setRepoUrl] = useState('');

  const handleLoadIssues = () => {
    console.log('Looading todos from:', repoUrl);
    // 
  };

  return (
    <Layout style={{ minHeight: '100vh', padding: '20px' }}>
      <Header style={{ background: '#fff', padding: '10px', textAlign: 'center' }}>
        <Title level={2}>GitHub Kanban Board</Title>
      </Header>

      <Content style={{ maxWidth: '800px', margin: '20px auto' }}>
        <Input
          placeholder="Enter GitHub repo URL (e.g. https://github.com/facebook/react)"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <Button type="primary" onClick={handleLoadIssues} block>
          Load Issues
        </Button>
      </Content>
    </Layout>
  );
};

export default KanbanBoard;