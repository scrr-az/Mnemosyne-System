import './MemoryOverlay.css';

interface ImageMemoryProps {
  src: string;
  onClose: () => void;
}

export default function ImageMemory({ src, onClose } : ImageMemoryProps) {
  return(
    <div className="memory-overlay">
      <div className='memory-content-card'>
        <button onClick={onClose} className='back-button-memories'>[x]</button>
        <img src={src} alt="Memory Image" />
      </div>
    </div>
  )
}