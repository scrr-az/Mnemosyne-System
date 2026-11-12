import { useState } from 'react';
import { EyeTrackingProvider } from './eyetracker/EyeTracker';
import ImageGrid from './memories/ImageGrid';
import Header from './common/Header';
import MemoryGrid from './menus/MemoryGrid';
import History from './menus/History';
import type { HistoryEntry } from './common/HistoryTypes';
import './App.css';

function App() {
  const [selectedMemory, setSelectedMemory] = useState<number>(-1);

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [resetMemories, setResetMemories] = useState<boolean>(false);

  function handleHistoryClick () {
    if(selectedMemory === -2){
      setSelectedMemory(-1);
      setHistory([]);
      setResetMemories(true);
      return;
    }
    setSelectedMemory(-2);
  }

  return (
    <EyeTrackingProvider>
      <Header onHistoryClick={handleHistoryClick} isHistoryPage={selectedMemory === -2}/>

      <div style={{ display: selectedMemory >= 0 ? "block" : "none" }}>
        <ImageGrid
          isActive={selectedMemory >= 0}
          memoryIdx={selectedMemory}
          onBackClick={() => setSelectedMemory(-1)}
          setHistory={setHistory}
          resetMemories={resetMemories}
          setResetMemories={setResetMemories}
        />
      </div>

      {selectedMemory === -1 && (
        <MemoryGrid onMemoryClick={setSelectedMemory} />
      )}

      {selectedMemory === -2 && (
        <History
          entries={history}
        />
      )}

    </EyeTrackingProvider>
  );
}

export default App;