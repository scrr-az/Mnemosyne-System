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

  return (
    <EyeTrackingProvider>
      <Header onHistoryClick={() => setSelectedMemory(-2)} />

      <div style={{ display: selectedMemory >= 0 ? "block" : "none" }}>
        <ImageGrid
          isActive={selectedMemory >= 0}
          memoryIdx={selectedMemory}
          onBackClick={() => setSelectedMemory(-1)}
          setHistory={setHistory}
        />
      </div>

      {selectedMemory === -1 && (
        <MemoryGrid onMemoryClick={setSelectedMemory} />
      )}

      {selectedMemory === -2 && (
        <History
          entries={history}
          onBack={() => setSelectedMemory(-1)}
        />
      )}

    </EyeTrackingProvider>
  );
}

export default App;