import './Overlay.css'

interface OverlayProps {
  onBackClick: (type: number) => void;
  selectedMemory: number;
}

export default function Overlay({ onBackClick, selectedMemory } : OverlayProps){
    return (
    <div className="overlay">
        { selectedMemory < 0 ? null : <p className="back-button" onClick={() => onBackClick(-1)}>Back</p> }
        { selectedMemory < 0 ? null : <p className='report-button'>Report an anomaly</p>}
    </div>)
}