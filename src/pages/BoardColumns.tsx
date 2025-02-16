import React, { useState, useEffect } from "react";
import { Row, Col, Select } from "antd";
import Column from "../components/Column";
import { Issue } from "../types/Issue";

const COLUMN_KEYS = ["todo", "inProgress", "done"] as const;
type ColumnKey = (typeof COLUMN_KEYS)[number];

interface BoardColumnsProps {
  issues: Record<ColumnKey, Issue[]>;
}

const BoardColumns: React.FC<BoardColumnsProps> = ({ issues }) => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const [selectedColumn, setSelectedColumn] = useState<ColumnKey>("todo");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <>
        <Select
          value={selectedColumn}
          onChange={(value) => setSelectedColumn(value as ColumnKey)}
          style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
        >
          <Select.Option value="todo">ToDo</Select.Option>
          <Select.Option value="inProgress">In Progress</Select.Option>
          <Select.Option value="done">Done</Select.Option>
        </Select>

        <Column
          title={
            selectedColumn === "todo"
              ? "ToDo"
              : selectedColumn === "inProgress"
              ? "In Progress"
              : "Done"
          }
          issues={issues[selectedColumn]}
          columnId={selectedColumn}
        />
      </>
    );
  }

  return (
    <Row gutter={8} style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}>
      <Col span={8} style={{ minWidth: "190px" }}>
        <Column title="ToDo" issues={issues.todo} columnId="todo" />
      </Col>
      <Col span={8} style={{ minWidth: "190px" }}>
        <Column title="In Progress" issues={issues.inProgress} columnId="inProgress" />
      </Col>
      <Col span={8} style={{ minWidth: "190px" }}>
        <Column title="Done" issues={issues.done} columnId="done" />
      </Col>
    </Row>
  );
};

export default BoardColumns;