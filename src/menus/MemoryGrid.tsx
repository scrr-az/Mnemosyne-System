import { useMemo } from "react";
import './MemoryGrid.css';

interface MemoryGridProps {
  onMemoryClick: (type: number) => void;
}

type MemoryItem = {
  id: number;
  src: string;
  alt: string;
  index: number;
};

const memories : MemoryItem[] = [
  { id: 1, src: "src/assets/mindefault.png", alt: "Memory 3", index: -1 },
  { id: 2, src: "src/assets/mindefault.png", alt: "Memory 3", index: -1 },
  { id: 3, src: "src/assets/mindefault.png", alt: "Memory 3", index: -1 },
  { id: 4, src: "src/assets/mindefault.png", alt: "Memory 3", index: -1 },
  { id: 5, src: "src/assets/mindefault.png", alt: "Memory 3", index: -1 },
  { id: 6, src: "src/assets/mindefault.png", alt: "Memory 3", index: -1 },
  { id: 7, src: "src/assets/minGrandma.png", alt: "Memory 7", index: 2 },
  { id: 8, src: "src/assets/minLove.png", alt: "Memory 8", index: 1 },
  { id: 9, src: "src/assets/minGraduation.png", alt: "Memory 9", index: 0 },
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

export default function MemoryGrid({ onMemoryClick }: MemoryGridProps){
  const positions = useMemo(
    () => generatePositions(memories),
    []
  );

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
              zIndex: image.zIndex
            }}
            onClick={ () => onMemoryClick(image.index)}
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