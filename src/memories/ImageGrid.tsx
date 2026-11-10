
import { useEffect, useState } from "react";
import "./ImageGrid.css";

interface ImageGridProps {
  isActive: boolean;
  memoryIdx: number;
}

type ImageItem = {
  id: number;
  src: string;
  alt: string;
  variations?: string[];
};

const images_graduation: ImageItem[] = [
  { id: 1, src: "src/assets/graduation/1.png", alt: "Image 1", variations: ["src/assets/graduation/1-variation1.png", "src/assets/graduation/1-variation2.png", "src/assets/graduation/1-variation3.png"] },
  { id: 2, src: "src/assets/graduation/2.png", alt: "Image 2" },
  { id: 3, src: "src/assets/graduation/3.png", alt: "Image 3" },
  { id: 4, src: "src/assets/graduation/4.png", alt: "Image 4" },
  { id: 5, src: "src/assets/graduation/5.png", alt: "Image 5" },
  { id: 6, src: "src/assets/graduation/6.png", alt: "Image 6" },
  { id: 7, src: "src/assets/graduation/7.png", alt: "Image 7" },
  { id: 8, src: "src/assets/graduation/8.png", alt: "Image 8" },
];

const images_love: ImageItem[] = [
  { id: 2, src: "src/assets/love/1.png", alt: "Image 2", variations: ["src/assets/love/1-variation1.png", "src/assets/graduation/1-variation2.png", "src/assets/graduation/1-variation3.png"] },
  { id: 1, src: "src/assets/love/2.png", alt: "Image 1" },
  { id: 3, src: "src/assets/love/3.png", alt: "Image 3" },
  { id: 4, src: "src/assets/love/4.png", alt: "Image 4" },
  { id: 5, src: "src/assets/love/5.png", alt: "Image 5" },
  { id: 6, src: "src/assets/love/6.png", alt: "Image 6" },
  { id: 7, src: "src/assets/love/7.png", alt: "Image 7" },
  { id: 8, src: "src/assets/love/8.png", alt: "Image 8" },
];

const memories: ImageItem[][] = [
  images_graduation,
  images_love
];

const COLUMNS = 8;
const ROWS = 6;
const CELL_WIDTH = 100 + 10;
const IMAGE_SIZE = 100;
const LABEL_HEIGHT = 18;
const CELL_HEIGHT = IMAGE_SIZE + LABEL_HEIGHT + 10;

function generatePositions(items: ImageItem[], initialSeed: number) {
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

type PositionedImage = ImageItem & {
  column: number;
  row: number;
};

// generate positions of the images of each memory
const memoryPositions: PositionedImage[][] = memories.map(
  (memory, index) => generatePositions(memory, 2603 + index * 2000)
);

export default function ImageGrid({ isActive, memoryIdx } : ImageGridProps) {
  const [displayedSources, setDisplayedSources] = useState<Record<string, string>>({});

  // Function to change the images
  useEffect(() => {

    // If it is not showing this memory, do not change images
    if (!isActive) return;

    const interval = setInterval(() => {
      setDisplayedSources((previous) => {
        // Only images that have variations
        const candidates = memories[memoryIdx].filter(
          (image) => image.variations && image.variations.length > 0
        );

        if (candidates.length === 0) return previous;

        // Pick a random image
        const selected =
          candidates[Math.floor(Math.random() * candidates.length)];

        // Get all possible versions of that image
        const options = [selected.src, ...selected.variations!];

        // Current version
        const sourceKey = `${memoryIdx}-${selected.id}`;
        const current = previous[sourceKey] ?? selected.src;

        // Avoid selecting the same version
        const available = options.filter((src) => src !== current);

        const next = available[Math.floor(Math.random() * available.length)];

        return {
          ...previous,
          [sourceKey]: next,
        };
      });
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [isActive, memoryIdx]);

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

          return (
            <div
              key={image.id}
              className="image-card"
              style={{
                gridColumn: image.column,
                gridRow: image.row,
              }}
            >
              <div className="image-label">
                IMG-{String(image.id).padStart(3, "0")}
              </div>

              <img
                src={displayedSources[sourceKey] ?? image.src}
                alt={image.alt}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
