import './MemoryOverlay.css';

interface TextMemoryProps {
  src: string;
  onClose: () => void;
}

export default function TextMemory({ src, onClose } : TextMemoryProps){
    return(
        <div className="memory-overlay">
            <div className='memory-card'>
                <p onClick={onClose}>[x]</p>
                <p className='letter'>{src}</p>
            </div>
        </div>
    )
}