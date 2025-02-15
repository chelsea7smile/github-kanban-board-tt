import { Card, Typography } from 'antd';
import { useDroppable } from '@dnd-kit/core';
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
  columnId: string;
}

const Column: React.FC<ColumnProps> = ({ title, issues, columnId }) => {
  const { setNodeRef } = useDroppable({ id: columnId, data: { column: columnId } });

  return (
    <Card
      ref={setNodeRef}
      title={
        <div style={{ textAlign: 'center', gap: '4px' }}>
          <Title level={4} style={{ margin: 0 }}>{title}</Title>
        </div>
      }
      bodyStyle={{ padding: '16px' }}
      style={{
        width: '100%',
        minHeight: '400px',
        background: '#f0f2f5',
        padding: '0px',
      }}
    >
      {issues.map((issue) => (
        <IssueCard
          key={issue.id}
          id={issue.id}
          title={issue.title}
          number={issue.number}
          user={issue.user}
          url={issue.url}
          columnId={columnId}
        />
      ))}
    </Card>
  );
};

export default Column;