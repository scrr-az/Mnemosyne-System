import './Overlay.css'

interface OverlayProps {
  onBackClick: () => void;
  selectedMemory: boolean;
  onReportClick: () => void;
  isSelectingQuiz: boolean;
  integrity: number;
}

export default function Overlay({ onBackClick, selectedMemory, onReportClick, isSelectingQuiz, integrity } : OverlayProps){
    return (
    <div className={isSelectingQuiz? "overlay choosing" : "overlay"}>
        { selectedMemory || isSelectingQuiz ? null : <p className="back-button" onClick={onBackClick}>[back]</p> }
        <div className='bottom-part'>
            { isSelectingQuiz ? null: <p className='integrity-info'>Integrity: {integrity}%</p> }
            { isSelectingQuiz ? <p className='integrity-info'>Click on the memory fragment where you noticed a change.</p> : null}
            <p className='report-button' onClick={onReportClick}>{isSelectingQuiz ? "[cancel report]" : "[report an anomaly]"}</p>
        </div>
    </div>)
}