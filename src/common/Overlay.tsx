import './Overlay.css'

interface OverlayProps {
  onBackClick: () => void;
  selectedMemory: boolean;
  onReportClick: () => void;
  integrity: number;
}

export default function Overlay({ onBackClick, selectedMemory, onReportClick, integrity } : OverlayProps){
    return (
    <div className="overlay">
        { selectedMemory ? null : <p className="back-button" onClick={onBackClick}>[back]</p> }
        <p className='integrity-info'>Integrity: {integrity}%</p>
        <p className='report-button' onClick={onReportClick}>[report an anomaly]</p>
    </div>)
}