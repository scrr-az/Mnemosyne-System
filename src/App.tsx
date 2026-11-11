import { EyeTrackingProvider } from './eyetracker/EyeTracker';
import ImageGrid from './memories/ImageGrid';
import Header from './common/Header';
import MemoryGrid from './menus/MemoryGrid';
import './App.css';
import { useState } from 'react';

function App() {

  const [selectedMemory, setSelectedMemory] = useState<number>(-1);

  return (
    <EyeTrackingProvider>
      <Header onHistoryClick={() => setSelectedMemory(-2)} />

      <div style={{ display: selectedMemory < 0 ? "none" : "block"}}>
        <ImageGrid isActive={selectedMemory >= 0} memoryIdx={selectedMemory} onBackClick={() => setSelectedMemory(-1)}/>
      </div>

      <div style={{ display: selectedMemory === -1 ? "block" : "none" }}>
        <MemoryGrid onMemoryClick={setSelectedMemory} />
      </div>
  
    </EyeTrackingProvider>
  );
}

export default App;