import { EyeTrackingProvider } from './eyetracker/EyeTracker';
import ImageGrid from './memories/ImageGrid';
import Header from './Header';
import MemoryGrid from './MemoryGrid';
import './App.css';
import { useState } from 'react';

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
      <Header />
      
      {content}
  
    </EyeTrackingProvider>
  );
}

export default App;