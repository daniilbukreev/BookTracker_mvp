import type { ReadingStatus } from "../features/books/types";
const labels: Record<ReadingStatus, string> = {
  want: "Хочу прочитать",
  reading: "Читаю",
  done: "Прочитано",
};
export function StatusBadge({ status }: { status: ReadingStatus }) {
  return <span className={`status status-${status}`}>{labels[status]}</span>;
}
