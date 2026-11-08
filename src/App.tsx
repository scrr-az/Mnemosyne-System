import EyeTracker from './eyetracker/EyeTracker';
import ImageGrid from './memories/ImageGrid';
import Header from './Header';
import './App.css';

function App() {
  return (
    <>
    <Header />
      <div>
        <EyeTracker />
        <ImageGrid/>
      </div>
    </>
  );
}

export default App;