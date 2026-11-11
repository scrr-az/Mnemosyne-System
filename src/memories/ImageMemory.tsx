import './MemoryOverlay.css';

interface ImageMemoryProps {
  src: string;
  onClose: () => void;
}

export default function ImageMemory({ src, onClose } : ImageMemoryProps) {
  return(
    <div className="memory-overlay">
      <div className='memory-card'>
        <p onClick={onClose}>[x]</p>
        <img src={src} alt="Memory Image" />
      </div>
    </div>
  )
}