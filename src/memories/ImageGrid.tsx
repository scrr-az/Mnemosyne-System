
import { useMemo } from "react";
import "./ImageGrid.css";

type ImageItem = {
  id: number;
  src: string;
  alt: string;
};

const images: ImageItem[] = [
  { id: 1, src: "src/assets/1.png", alt: "Image 1" },
  { id: 2, src: "src/assets/2.png", alt: "Image 2" },
  { id: 3, src: "src/assets/3.png", alt: "Image 3" },
  { id: 4, src: "src/assets/4.png", alt: "Image 4" },
  { id: 5, src: "src/assets/5.png", alt: "Image 5" },
  { id: 6, src: "src/assets/6.png", alt: "Image 6" },
  { id: 7, src: "src/assets/7.png", alt: "Image 7" },
  { id: 8, src: "src/assets/8.png", alt: "Image 8" },
];

const COLUMNS = 8;
const ROWS = 5;
const CELL_WIDTH = 100 + 10;
const IMAGE_SIZE = 100;
const LABEL_HEIGHT = 18;
const CELL_HEIGHT = IMAGE_SIZE + LABEL_HEIGHT + 10;

function generatePositions(items: ImageItem[]) {
  let seed = 2603;

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

export default function ImageGrid() {
  const positions = useMemo(
    () => generatePositions(images),
    []
  );

  const rows = Math.max(...positions.map(p => p.row));

    const dots = Array.from(
    { length: (COLUMNS + 1) * (rows + 1) },
    (_, i) => ({
        id: i,
        x: (i % (COLUMNS + 1)) * CELL_WIDTH,
        y: Math.floor(i / (COLUMNS + 1)) * CELL_HEIGHT,
    })
    );

    return (
    <div
        className="archive-grid"
        style={{
        width: COLUMNS * CELL_WIDTH,
        height: rows * CELL_HEIGHT,
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
            gridTemplateRows: `repeat(${rows}, ${CELL_HEIGHT}px)`,
        }}
        >
        {positions.map(image => (
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
            <img src={image.src} alt={image.alt} />
            </div>
        ))}
        </div>
    </div>
    );
}
