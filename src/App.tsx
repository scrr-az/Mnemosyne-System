import { EyeTrackingProvider } from './eyetracker/EyeTracker';
import ImageGrid from './memories/ImageGrid';
import Header from './Header';
import { useMemo } from "react";
import './App.css';

type MemoryItem = {
  id: number;
  src: string;
  alt: string;
  type: string;
};

const memories : MemoryItem[] = [
  { id: 1, src: "src/assets/mindefault.png", alt: "Memory 3", type: "none" },
  { id: 2, src: "src/assets/mindefault.png", alt: "Memory 3", type: "none" },
  { id: 3, src: "src/assets/mindefault.png", alt: "Memory 3", type: "none" },
  { id: 4, src: "src/assets/mindefault.png", alt: "Memory 3", type: "none" },
  { id: 5, src: "src/assets/mindefault.png", alt: "Memory 3", type: "none" },
  { id: 6, src: "src/assets/mindefault.png", alt: "Memory 3", type: "none" },
  { id: 7, src: "src/assets/mindefault.png", alt: "Memory 3", type: "none" },
  { id: 8, src: "src/assets/min1.png", alt: "Memory 1", type: "image" },
  { id: 9, src: "src/assets/min2.png", alt: "Memory 2", type: "image" },
]

const IMAGE_WIDTH = 340;
const IMAGE_HEIGHT = 236;

const PROTECTED_WIDTH = IMAGE_WIDTH / 2; // 170px
const PROTECTED_HEIGHT = 36;

const CONTAINER_WIDTH = 1910;
const CONTAINER_HEIGHT = 800;
const MAX_ATTEMPTS = 500;

function generatePositions(items: MemoryItem[]) {
  let seed = 2603;

  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const positions: (MemoryItem & {
    x: number;
    y: number;
    zIndex: number;
  })[] = [];

  for (const [index, item] of items.entries()) {
    let x = 0;
    let y = 0;
    let valid = false;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      x = random() * (CONTAINER_WIDTH - IMAGE_WIDTH);
      y = random() * (CONTAINER_HEIGHT - IMAGE_HEIGHT);

      valid = positions.every((other) => {
        // This image's full rectangle
        // must not intersect the protected area
        // of an existing image.
        const coversOtherProtectedArea =
          x < other.x + PROTECTED_WIDTH &&
          x + IMAGE_WIDTH > other.x &&
          y < other.y + PROTECTED_HEIGHT &&
          y + IMAGE_HEIGHT > other.y;

        // An existing image's full rectangle
        // must not intersect this image's protected area.
        const coversMyProtectedArea =
          other.x < x + PROTECTED_WIDTH &&
          other.x + IMAGE_WIDTH > x &&
          other.y < y + PROTECTED_HEIGHT &&
          other.y + IMAGE_HEIGHT > y;

        return !coversOtherProtectedArea && !coversMyProtectedArea;
      });

      if (valid) break;
    }

    positions.push({
      ...item,
      x,
      y,
      zIndex: index + 1,
    });
  }

  return positions;
}

function MemoryGrid(){
  const positions = useMemo(
    () => generatePositions(memories),
    []
  );

  const handleClick = (event) => {
    console.log("here")
  }

  return (
    <div
      className="memory-grid"
      style={{
        width: CONTAINER_WIDTH,
        height: CONTAINER_HEIGHT,
      }}
    >

      <div
        className="memory-layer"
      >
        {positions.map(image => (
          <div
            key={image.id}
            className="memory-card"
            style={{
              position: "absolute",
              left: image.x,
              top: image.y,
              zIndex: image.zIndex,
              cursor: 'pointer'
            }}
            onClick={handleClick}
          >
            <div className="memory-label">
              memory nr {String(image.id).padStart(3, "0")}
            </div>
            <img src={image.src} alt={image.alt} />
            </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <EyeTrackingProvider>
      <Header />
      <MemoryGrid />
    </EyeTrackingProvider>
  );
}

export default App;