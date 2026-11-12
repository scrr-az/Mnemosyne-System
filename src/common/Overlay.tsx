import './Overlay.css'

interface OverlayProps {
  onBackClick: () => void;
  selectedMemory: boolean;
  onReportClick: () => void;
}

export default function Overlay({ onBackClick, selectedMemory, onReportClick } : OverlayProps){
    return (
    <div className="overlay">
        { selectedMemory ? null : <p className="back-button" onClick={onBackClick}>[back]</p> }
        <p className='report-button' onClick={onReportClick}>[report an anomaly]</p>
    </div>)
}