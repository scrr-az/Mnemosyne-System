import { EyeTrackingProvider } from './eyetracker/EyeTracker';
import ImageGrid from './memories/ImageGrid';
import Header from './common/Header';
import MemoryGrid from './menus/MemoryGrid';
import './App.css';
import { useState } from 'react';
import Overlay from './common/Overlay';

function App() {

  const [selectedMemory, setSelectedMemory] = useState<string>("none");

  let content;

  switch (selectedMemory) {
    case "image":
      content = <ImageGrid />;
      break;

    default:
      content = (
        <MemoryGrid
          onMemoryClick={setSelectedMemory}
        />
      );
      break;
  }

  return (
    <EyeTrackingProvider>
      <Header onHistoryClick={setSelectedMemory} />
      <Overlay onBackClick={setSelectedMemory} selectedMemory={selectedMemory}/>
      {content}
  
    </EyeTrackingProvider>
  );
}

export default App;