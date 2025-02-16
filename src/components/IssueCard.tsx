import React from "react";
import { Card, Typography, Avatar } from "antd";
import { ArrowRightOutlined, CommentOutlined } from "@ant-design/icons";
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
  const sortable = !isOverlay
    ? useSortable({ id: id.toString(), data: { column: columnId } })
    : null;

  const cardStyle: React.CSSProperties = {
    ...style, 
    transition: sortable?.transition || "transform 0.2s ease-in-out",
    marginBottom: "10px",
    opacity: sortable?.isDragging ? 0.5 : 1,
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
      <Title
        level={5}
        style={{
          marginBottom: "5px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {sortable ? (
          <span
            ref={sortable.setNodeRef}
            {...sortable.attributes}
            {...sortable.listeners}
            className="drag-handle"
            style={{ cursor: "grab" }}
          >
            #{number} {title}
          </span>
        ) : (
          <span style={{ cursor: "default" }}>
            #{number} {title}
          </span>
        )}

        <a
          data-cy={`issue-link-${id}`}
          href={htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            window.open(htmlUrl, "_blank");
          }}
          style={{ marginLeft: "8px" }}
        >
          <ArrowRightOutlined />
        </a>
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
    </Card>
  );
};

export default IssueCard;