import { EyeTrackingProvider } from './eyetracker/EyeTracker';
import ImageGrid from './memories/ImageGrid';
import Header from './common/Header';
import MemoryGrid from './menus/MemoryGrid';
import './App.css';
import { useState } from 'react';
import Overlay from './common/Overlay';

function App() {

  const [selectedMemory, setSelectedMemory] = useState<number>(-1);
  console.log(selectedMemory)

  return (
    <EyeTrackingProvider>
      <Header onHistoryClick={() => setSelectedMemory(-2)} />

      <Overlay onBackClick={setSelectedMemory} selectedMemory={selectedMemory}/>

      <div style={{ display: selectedMemory < 0 ? "none" : "block"}}>
        <ImageGrid isActive={selectedMemory >= 0} memoryIdx={selectedMemory}/>
      </div>

      <div style={{ display: selectedMemory === -1 ? "block" : "none" }}>
        <MemoryGrid onMemoryClick={setSelectedMemory} />
      </div>
  
    </EyeTrackingProvider>
  );
}

export default App;