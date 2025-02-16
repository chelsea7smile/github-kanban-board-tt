import { Issue } from "./Issue";

export interface ColumnProps {
  title: string;
  issues: Issue[];
  columnId: string;
}