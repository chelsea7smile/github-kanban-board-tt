import { Card, Typography } from 'antd';

const { Title } = Typography;

interface ColumnProps {
  title: string;
  children?: React.ReactNode;
}

const Column: React.FC<ColumnProps> = ({ title, children }) => {
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
      {children}
    </Card>
  );
};

export default Column;