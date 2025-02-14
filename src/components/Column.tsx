import { Card, Typography } from 'antd';
import IssueCard from './IssueCard';

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
}

interface ColumnProps {
  title: string;
  issues: Issue[];
}

const Column: React.FC<ColumnProps> = ({ title, issues }) => {
  return (
    <Card
      title={
        <div style={{ textAlign: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>{title}</Title>
        </div>
      }
      style={{
        width: '100%',
        minHeight: '400px',
        background: '#f0f2f5',
        padding: '10px',
      }}
    >
      {issues.map((issue) => (
        <IssueCard
          key={issue.id}
          title={issue.title}
          number={issue.number}
          user={issue.user}
          url={issue.url}
        />
      ))}
    </Card>
  );
};

export default Column;