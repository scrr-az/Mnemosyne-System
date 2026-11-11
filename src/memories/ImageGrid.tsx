
import { useEffect, useState } from "react";
import ImageMemory from "./ImageMemory";
import TextMemory from "./TextMemory";
import Overlay from "../common/Overlay";
import "./ImageGrid.css";

interface ImageGridProps {
  isActive: boolean;
  memoryIdx: number;
  onBackClick: () => void;
}

type MemoryItem =
  | {
      id: number;
      type: "image";
      src: string;
      alt: string;
      variations?: string[];
    }
  | {
      id: number;
      type: "text";
      src: string;
      alt: string;
      variations?: string[]
    };

const images_graduation: MemoryItem[] = [
  { id: 1, src: "src/assets/graduation/1.png", alt: "Image 1",
    variations: ["src/assets/graduation/1-variation1.png", "src/assets/graduation/1-variation2.png", "src/assets/graduation/1-variation3.png"],
    type: "image"
  },
  { id: 2, src: "src/assets/graduation/2.png", alt: "Image 2",
    type: "text"
  },
  { id: 3, src: "src/assets/graduation/3.png", alt: "Image 3",
    type: "image"
  },
  { id: 4, src: "src/assets/graduation/4.png", alt: "Image 4",
    type: "image"
  },
  { id: 5, src: "src/assets/graduation/5.png", alt: "Image 5",
    type: "image"
  },
  { id: 6, src: "src/assets/graduation/6.png", alt: "Image 6",
    type: "image"
  },
  { id: 7, src: "src/assets/graduation/7.png", alt: "Image 7",
    type: "image"
  },
  { id: 8, src: "src/assets/graduation/8.png", alt: "Image 8",
    type: "image"
  },
];

const images_love: MemoryItem[] = [
  { id: 2, src: "src/assets/love/1.png", alt: "Image 2",
    variations: ["src/assets/love/1-variation1.png", "src/assets/graduation/1-variation2.png", "src/assets/graduation/1-variation3.png"],
    type: "image"
  },
  { id: 1, src: "src/assets/love/2.png", alt: "Image 1",
    type: "image"
  },
  { id: 3, src: "src/assets/love/3.png", alt: "Image 3",
    type: "image"
  },
  { id: 4, src: "src/assets/love/4.png", alt: "Image 4",
    type: "image"
  },
  { id: 5, src: "src/assets/love/5.png", alt: "Image 5",
    type: "image"
  },
  { id: 6, src: "src/assets/love/6.png", alt: "Image 6",
    type: "image"
  },
  { id: 7, src: "src/assets/love/7.png", alt: "Image 7",
    type: "image"
  },
  { id: 8, src: "src/assets/love/8.png", alt: "Image 8",
    type: "image"
  },
];

const memories: MemoryItem[][] = [
  images_graduation,
  images_love
];

const COLUMNS = 8;
const ROWS = 6;
const CELL_WIDTH = 100 + 10;
const IMAGE_SIZE = 100;
const LABEL_HEIGHT = 18;
const CELL_HEIGHT = IMAGE_SIZE + LABEL_HEIGHT + 10;

function generatePositions(items: MemoryItem[], initialSeed: number) {
  let seed = initialSeed;

  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const occupied = new Set<string>();

  return items.map((image) => {
    let column: number;
    let row: number;

    do {
      column = 1 + Math.floor(random() * COLUMNS);
      row = 1 + Math.floor(random() * ROWS);
    } while (occupied.has(`${column}-${row}`));

    occupied.add(`${column}-${row}`);

    return { ...image, column, row };
  });
}

type PositionedImage = MemoryItem & {
  column: number;
  row: number;
};

// generate positions of the images of each memory
const memoryPositions: PositionedImage[][] = memories.map(
  (memory, index) => generatePositions(memory, 2603 + index * 2000)
);

export default function ImageGrid({ isActive, memoryIdx, onBackClick } : ImageGridProps) {
  const [displayedSources, setDisplayedSources] = useState<Record<string, string>>({});
  const [selectedMemory, setSelectedMemory] = useState<PositionedImage | null>(null);
  const [changedImages, setChangedImages] = useState<Set<string>>(new Set());

  // Store the changes to the text memories
  const [textMemories, setTextMemories] = useState<Record<number, string>>({
    2: "My graduation memory...",
  });

  // Function to change the images
  useEffect(() => {
    // Reset when the overlay closes
    if (!selectedMemory || !isActive) {
      setChangedImages(new Set());
      return;
    }

    const interval = setInterval(() => {

      const candidates = memories[memoryIdx].filter(image => {
        // Only images with variations
        if (!image.variations?.length) return false;

        // Don't change the currently open image
        if (
          selectedMemory.type === "image" &&
          selectedMemory.id === image.id
        ) {
          return false;
        }

        // Don't change an image twice
        const key = `${memoryIdx}-${image.id}`;

        return !changedImages.has(key);
      });

      // No more eligible images
      if (candidates.length === 0) return;

      // Pick one random image
      const selected =
        candidates[Math.floor(Math.random() * candidates.length)];

      const sourceKey = `${memoryIdx}-${selected.id}`;

      // Get possible variations
      const options = [selected.src, ...selected.variations!];

      const current = displayedSources[sourceKey] ?? selected.src;

      const available = options.filter(src => src !== current);

      if (available.length === 0) return;

      const next = available[Math.floor(Math.random() * available.length)];

      // Change the image
      setDisplayedSources(previous => ({
        ...previous,
        [sourceKey]: next,
      }));

      // Mark it as already changed
      setChangedImages(previous => new Set([...previous, sourceKey]));

    }, 5000);

    return () => clearInterval(interval);

  }, [selectedMemory, memoryIdx, isActive, changedImages, displayedSources]);

  const positions = memoryPositions[memoryIdx] ?? [];

  const dots = Array.from(
    { length: (COLUMNS + 1) * (ROWS + 1) },
    (_, i) => ({
      id: i,
      x: (i % (COLUMNS + 1)) * CELL_WIDTH,
      y: Math.floor(i / (COLUMNS + 1)) * CELL_HEIGHT,
    })
  );

  return (
    <div
      className="image-grid"
      style={{
        width: COLUMNS * CELL_WIDTH,
        height: ROWS * CELL_HEIGHT,
      }}
    >
      <Overlay onBackClick={onBackClick} selectedMemory={selectedMemory !== null}/>

      {/* Dots */}
      <div className="dot-layer">
      {dots.map(dot => (
        <span
          key={dot.id}
          className="grid-dot"
          style={{
            left: dot.x,
            top: dot.y,
          }}
        />
      ))}
      </div>

      {/* Images */}
      <div
        className="image-layer"
        style={{
          gridTemplateColumns: `repeat(${COLUMNS}, ${CELL_WIDTH}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${CELL_HEIGHT}px)`,
        }}
      >
        {positions.map(image => {
          const sourceKey = `${memoryIdx}-${image.id}`;
          const displayedSrc = displayedSources[sourceKey] ?? image.src;

          return (
            <div
              key={image.id}
              className="image-card"
              style={{
                gridColumn: image.column,
                gridRow: image.row,
              }}
              onClick={() => setSelectedMemory(image)}
            >
              <div className="image-label">
                IMG-{String(image.id).padStart(3, "0")}
              </div>

              <img
                src={displayedSrc}
                alt={image.alt}
              />
            </div>
          );
        })}
      </div>
      {selectedMemory && (
      <div
        className="memory-overlay"
        onClick={() => setSelectedMemory(null)}
      >
        <div
          className="memory-content"
          onClick={(e) => e.stopPropagation()}
        >
          {selectedMemory.type === "image" && (
            <ImageMemory
              src={
                displayedSources[
                  `${memoryIdx}-${selectedMemory.id}`
                ] ?? selectedMemory.src
              }
              onClose={() => setSelectedMemory(null)}
            />
          )}

          {selectedMemory.type === "text" && (
            <TextMemory
              src={textMemories[selectedMemory.id + memoryIdx * 10] ?? ""}
              onClose={() => setSelectedMemory(null)}
            />
          )}
        </div>
      </div>
    )}
    </div>
  );
}
