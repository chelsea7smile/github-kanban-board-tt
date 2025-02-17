import { useState, useCallback } from "react";
import { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { Issue } from "../types/Issue";

export type ColumnKey = "todo" | "inProgress" | "done";

const arrayMove = <T,>(array: T[], fromIndex: number, toIndex: number): T[] => {
  const newArray = [...array];
  const [movedItem] = newArray.splice(fromIndex, 1);
  newArray.splice(toIndex, 0, movedItem);
  return newArray;
};

interface UseDragDropReturn {
  activeIssueId: number | null;
  dragOverlaySize: { width: number; height: number } | null;
  handleDragStart: (e: DragStartEvent) => void;
  handleDragEnd: (e: DragEndEvent) => void;
}

interface DragDropProps {
  issues: Record<ColumnKey, Issue[]>;
  setIssues: (newIssues: Record<ColumnKey, Issue[]>, repoUrl: string) => void;
  repoUrl: string;
}

export const useDragDrop = ({ issues, setIssues, repoUrl }: DragDropProps): UseDragDropReturn => {
  const [activeIssueId, setActiveIssueId] = useState<number | null>(null);
  const [dragOverlaySize, setDragOverlaySize] = useState<{ width: number; height: number } | null>(null);

  const handleDragStart = useCallback((e: DragStartEvent) => {
    setActiveIssueId(Number(e.active.id));
    const node = document.querySelector(`[data-cy="issue-${e.active.id}"]`) as HTMLElement;
    if (node) {
      const rect = node.getBoundingClientRect();
      setDragOverlaySize({ width: rect.width, height: rect.height });
    }
  }, []);

  const handleDragEnd = useCallback((e: DragEndEvent) => {
    setActiveIssueId(null);
    setDragOverlaySize(null);
    if (!e.over) return;

    const activeId = Number(e.active.id);
    const source = e.active.data.current?.column as ColumnKey;
    const destination = e.over.data.current?.column as ColumnKey;
    if (!source || !destination) return;

    if (source === destination) {
      const currentColumn = issues[source];
      const fromIndex = currentColumn.findIndex(issue => issue.id === activeId);
      const toIndex = e.over && e.over.id 
        ? currentColumn.findIndex(issue => issue.id === Number(e.over!.id))
        : currentColumn.length - 1;
      if (fromIndex === -1 || toIndex === -1) return;
      const newColumn = arrayMove(currentColumn, fromIndex, toIndex);
      const newIssues = { ...issues, [source]: newColumn };
      setIssues(newIssues, repoUrl);
      return;
    }

    const updated = {
      todo: [...issues.todo],
      inProgress: [...issues.inProgress],
      done: [...issues.done],
    };
    const idx = updated[source].findIndex(issue => issue.id === activeId);
    if (idx === -1) return;
    const [moved] = updated[source].splice(idx, 1);
    updated[destination] = [moved, ...updated[destination]];
    setIssues(updated, repoUrl);
  }, [issues, setIssues, repoUrl]);

  return { activeIssueId, dragOverlaySize, handleDragStart, handleDragEnd };
};