import { Card, Typography, Avatar } from 'antd';

const { Title, Text } = Typography;

interface IssueCardProps {
  title: string;
  number: number;
  user: {
    login: string;
    avatar_url: string;
  };
  url: string;
}

const IssueCard: React.FC<IssueCardProps> = ({ title, number, user, url }) => {
  return (
    <Card
      hoverable
      style={{ marginBottom: '10px' }}
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