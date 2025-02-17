import React from "react";
import { Card, Typography, Avatar, Button, theme } from "antd";
import { CommentOutlined } from "@ant-design/icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IssueCardProps } from "../types/IssueCardProps";

const { Title, Text } = Typography;

interface ExtendedIssueCardProps extends IssueCardProps {
  isOverlay?: boolean;
  style?: React.CSSProperties;
}

const IssueCard: React.FC<ExtendedIssueCardProps> = ({
  id,
  title,
  number,
  user,
  htmlUrl,
  columnId,
  comments,
  createdAt,
  isOverlay = false,
  style = {},
}) => {
  const { token } = theme.useToken();
  const sortable = !isOverlay
    ? useSortable({ id: id.toString(), data: { column: columnId } })
    : null;

  const cardStyle: React.CSSProperties = {
    ...style,
    position: "relative",
    transition: sortable?.transition || "transform 0.2s ease-in-out",
    marginBottom: "10px",
    opacity: sortable ? (sortable.isDragging ? 0.5 : 1) : 1,
    userSelect: "none",
  };

  if (sortable && sortable.transform) {
    cardStyle.transform = CSS.Transform.toString(sortable.transform);
  }

  const formattedDate = isNaN(Date.parse(createdAt))
    ? "Unknown"
    : new Date(createdAt).toLocaleDateString();

  return (
    <Card hoverable data-cy={`issue-${id}`} style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "stretch" }}>
        <div
          style={{ flex: 1, paddingRight: "10px", cursor: sortable ? "grab" : "default" }}
          ref={sortable ? sortable.setNodeRef : undefined}
          {...(sortable ? sortable.attributes : {})}
          {...(sortable ? sortable.listeners : {})}
        >
          <Title
            level={5}
            style={{
              marginBottom: "5px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span>#{number} {title}</span>
          </Title>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Avatar src={user.avatar_url} alt={user.login} />
            <Text>{user.login}</Text>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
            <CommentOutlined />
            <Text>{comments} Comments</Text>
            <Text type="secondary">Opened: {formattedDate}</Text>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "60px",
            color: "#fff",
          }}
        >
          <Button
            data-cy={`issue-link-${id}`}
            type="primary"
            style={{
              width: "40px",
              height: "100%",
              border: "1px solid " + (token?.colorPrimary || "#1890ff"),
              backgroundColor:"#001529",
              color: "#fff",
              padding: 0,
              borderRadius: "8px",
            }}
            draggable={false}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              window.open(htmlUrl, "_blank");
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: "rotate(-90deg)",
                whiteSpace: "nowrap",
              }}
            >
              Go to issue &gt;
            </span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default IssueCard;