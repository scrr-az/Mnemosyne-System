import './MemoryOverlay.css';

interface TextMemoryProps {
  sentences: string[];
  onClose: () => void;
}

export default function TextMemory({
  sentences,
  onClose
}: TextMemoryProps) {
  return (
    <div className="memory-overlay">
      <div className="memory-content-card">
        <button onClick={onClose} className='back-button-memories'>[x]</button>

        <p className="letter">
          {sentences.map((sentence, index) => (
            <span key={index}>
              {sentence}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}