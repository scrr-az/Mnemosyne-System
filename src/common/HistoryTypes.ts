export interface HistoryEntry {
  id: number;

  // Main memory collection
  memoryIdx: number;
  memoryName: string;

  // Individual memory inside the collection
  itemId: number;
  itemType: "image" | "text";

  // For text changes, identifies the sentence/fragment
  fragmentIndex?: number;

  // Original and modified content
  originalContent: string;
  changedContent: string;

  // Whether the change has been recovered
  recovered: boolean;

  // When the change occurred
  timestamp: Date;
}