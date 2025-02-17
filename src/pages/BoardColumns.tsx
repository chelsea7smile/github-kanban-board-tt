import React, { useState, useEffect } from "react";
import { Row, Col, Select } from "antd";
import Column from "../components/Column";
import { Issue } from "../types/Issue";
import { ColumnKey, getColumnTitle } from "../types/ColumnEnums";
import { MOBILE_BREAKPOINT } from "../constants/constants";

const { Option } = Select;

interface BoardColumnsProps {
  issues: Record<ColumnKey, Issue[]>;
}

const BoardColumns: React.FC<BoardColumnsProps> = ({ issues }) => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= MOBILE_BREAKPOINT);
  const [selectedColumn, setSelectedColumn] = useState<ColumnKey>(ColumnKey.ToDo);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
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
          {Object.values(ColumnKey).map((key) => (
            <Option key={key} value={key}>
              {getColumnTitle(key)}
            </Option>
          ))}
        </Select>

        <Column
          title={getColumnTitle(selectedColumn)}
          issues={issues[selectedColumn]}
          columnId={selectedColumn}
        />
      </>
    );
  }

  return (
    <Row
      gutter={8}
      style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}
    >
      {Object.values(ColumnKey).map((key) => (
        <Col key={key} span={8} style={{ minWidth: "190px" }}>
          <Column title={getColumnTitle(key)} issues={issues[key]} columnId={key} />
        </Col>
      ))}
    </Row>
  );
};

export default BoardColumns;