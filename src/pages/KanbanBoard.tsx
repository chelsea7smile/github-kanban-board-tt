import { useState } from 'react';
import { Input, Button, Layout, Typography, Row, Col } from 'antd';
import Column from '../components/Column';

const { Header, Content } = Layout;
const { Title } = Typography;

const KanbanBoard = () => {
  const [repoUrl, setRepoUrl] = useState('');

  const handleLoadIssues = () => {
    console.log('Загружаем задачи из:', repoUrl);
    // API
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
          <Col span={8} style={{ minWidth: '300px', flex: 1 }}>
            <Column title="ToDo" />
          </Col>
          <Col span={8} style={{ minWidth: '300px', flex: 1 }}>
            <Column title="In Progress" />
          </Col>
          <Col span={8} style={{ minWidth: '300px', flex: 1 }}>
            <Column title="Done" />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default KanbanBoard;