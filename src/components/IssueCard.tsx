import { Card, Typography, Avatar } from 'antd';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const { Title, Text } = Typography;

interface IssueCardProps {
  id: number;
  title: string;
  number: number;
  user: {
    login: string;
    avatar_url: string;
  };
  url: string;
  columnId: string;
}

const IssueCard: React.FC<IssueCardProps> = ({ id, title, number, user, url, columnId }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: id.toString(),
    data: { column: columnId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 0.2s ease-in-out',
    marginBottom: '10px',
    cursor: 'grab',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      hoverable
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      onClick={() => window.open(url, '_blank')}
    >
      <Title level={5} style={{ marginBottom: '5px' }}>
        #{number} {title}
      </Title>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Avatar src={user.avatar_url} alt={user.login} />
        <Text>{user.login}</Text>
      </div>
    </Card>
  );
};

export default IssueCard;