import './Overlay.css'

interface OverlayProps {
  onBackClick: () => void;
  selectedMemory: boolean;
}

export default function Overlay({ onBackClick, selectedMemory } : OverlayProps){
    return (
    <div className="overlay">
        { selectedMemory ? null : <p className="back-button" onClick={() => onBackClick()}>[back]</p> }
        <p className='report-button'>[report an anomaly]</p>
    </div>)
}