import { EyeTrackingProvider } from './eyetracker/EyeTracker';
import ImageGrid from './memories/ImageGrid';
import Header from './Header';
import './App.css';

function App() {
  return (
    <EyeTrackingProvider>
      <Header />
      <ImageGrid/>
    </EyeTrackingProvider>
  );
}

export default App;