import { EyeTrackingProvider } from './eyetracker/EyeTracker';
import ImageGrid from './memories/ImageGrid';
import Header from './common/Header';
import MemoryGrid from './menus/MemoryGrid';
import './App.css';
import { useState } from 'react';
import Overlay from './common/Overlay';

function App() {

  const [selectedMemory, setSelectedMemory] = useState<string>("none");

  return (
    <EyeTrackingProvider>
      <Header onHistoryClick={setSelectedMemory} />

      <Overlay onBackClick={setSelectedMemory} selectedMemory={selectedMemory}/>

      <div style={{ display: selectedMemory === "image" ? "block" : "none" }}>
        <ImageGrid isActive={selectedMemory === "image"}/>
      </div>

      <div style={{ display: selectedMemory === "image" ? "none" : "block" }}>
        <MemoryGrid onMemoryClick={setSelectedMemory} />
      </div>
  
    </EyeTrackingProvider>
  );
}

export default App;