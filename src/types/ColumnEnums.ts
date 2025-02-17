export enum ColumnKey {
  ToDo = "todo",
  InProgress = "inProgress",
  Done = "done",
}

export enum ColumnTitle {
  ToDo = "ToDo",
  InProgress = "In Progress",
  Done = "Done",
}

export const getColumnTitle = (key: ColumnKey): string => {
  switch (key) {
    case ColumnKey.ToDo:
      return ColumnTitle.ToDo;
    case ColumnKey.InProgress:
      return ColumnTitle.InProgress;
    case ColumnKey.Done:
      return ColumnTitle.Done;
    default:
      return key;
  }
};