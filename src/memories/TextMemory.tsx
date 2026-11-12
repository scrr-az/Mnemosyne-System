import { useState } from "react";
import './MemoryOverlay.css';

interface TextMemoryProps {
  sentences: string[];
  onClose: () => void;
  reportMode: boolean;
  onSentenceReport: (index: number, answer: string) => void;
  onCancelReport: () => void;
}

export default function TextMemory({
  sentences,
  onClose,
  reportMode,
  onSentenceReport,
  onCancelReport
}: TextMemoryProps) {

  const [selectedSentence, setSelectedSentence] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (selectedSentence === null || !answer.trim()) return;

    onSentenceReport(selectedSentence, answer);
    setSelectedSentence(null);
    setAnswer("");
  }

  return (
    <div className="memory-overlay">
      <div className="memory-content-card">

        <button
          onClick={reportMode ? onCancelReport : onClose}
          className="back-button-memories"
        >
          [x]
        </button>

        {reportMode && (
          <p>
            Select the sentence you believe has been altered.
          </p>
        )}

        <p className="letter">
          {sentences.map((sentence, index) => (
            <span
              key={index}
              onClick={() => {
                if (reportMode) {
                  setSelectedSentence(index);
                  setAnswer("");
                }
              }}
              className={
                reportMode
                  ? selectedSentence === index
                    ? "sentence-selected"
                    : "sentence-selectable"
                  : ""
              }
              data-sentence-index={index}
            >
              {sentence}
            </span>
          ))}
        </p>

        {reportMode && selectedSentence !== null && (
          <form onSubmit={handleSubmit} className="sentence-report-form">

            <p>
              Rewrite the original sentence:
            </p>

            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Write the original sentence here..."
              rows={4}
              autoFocus
            />

            <button
              type="submit"
              disabled={!answer.trim()}
            >
              [restore sentence]
            </button>

          </form>
        )}

      </div>
    </div>
  );
}