import './Overlay.css'

interface OverlayProps {
  onBackClick: (type: string) => void;
  selectedMemory: string;
}

export default function Overlay({ onBackClick, selectedMemory } : OverlayProps){
    return (
    <div className="overlay">
        { selectedMemory === "none" ? null : <p className="back-button" onClick={() => onBackClick("none")}>Back</p> }
        {selectedMemory === "none" ? null : <p className='report-button'>Report an anomaly</p>}
    </div>)
}