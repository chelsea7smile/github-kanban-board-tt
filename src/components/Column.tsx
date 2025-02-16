import { Card, Typography } from 'antd';
import { useDroppable } from '@dnd-kit/core';
import IssueCard from './IssueCard';
import { ColumnProps } from '../types/ColumnProps';

const { Title } = Typography;

const Column: React.FC<ColumnProps> = ({ title, issues, columnId }) => {
  const { setNodeRef } = useDroppable({ id: columnId, data: { column: columnId } });

  return (
    <Card
      ref={setNodeRef}
      data-cy={`column-${columnId}`}
      title={
        <div style={{ textAlign: 'center', gap: '4px' }}>
          <Title level={4} style={{ margin: 0 }}>{title}</Title>
        </div>
      }
      styles={{ body: { padding: '16px' } }}
      style={{
        width: '100%',
        minHeight: '400px',
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
          htmlUrl={issue.html_url}
          columnId={columnId} 
          comments={issue.comments}
          createdAt={issue.createdAt || issue.created_at}
        />
      ))}
    </Card>
  );
};

export default Column;