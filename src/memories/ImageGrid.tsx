
import { useEffect, useState } from "react";
import ImageMemory from "./ImageMemory";
import TextMemory from "./TextMemory";
import Overlay from "../common/Overlay";
import ReportQuiz from "./ReportQuiz";
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

/* TEXT ITEMS */
type TextSentence = {
  original: string;
  variations?: string[];
};

type TextMemoryData = {
  id: number;
  sentences: TextSentence[];
};

// + 10 if it is the second set of memories (love)
const textMemoryData: Record<number, TextMemoryData> = {
  2: {
    id: 2,
    sentences: [
      {original: "Hey you,\n\nI've been wanting to write this for a while, but I never really knew how to put it into words.\n\nI keep thinking about graduation night. You were wearing that "},
      {original: "dark blue dress ", variations:["red satin dress "]},
      {original: "(the one you said was a last-minute choice), and I had my "},
      {original: "stupid black suit with the slightly crooked tie. ", variations:["elegant white suit with a perfectly straight tie. "]},
      {original: "I still remember the little golden lights hanging above the dance floor and how cold it was outside compared to the crowded room.\n\nYou probably don't remember, but when we first started talking, you said, \""},
      {original: "I don't usually dance, but I guess tonight is an exception.\" ", variations:["I was secretly hoping you'd ask me to dance tonight.\" "]},
      {original: "I think about that sentence more often than I should.\n\nI remember us sitting by the "},
      {original: "staircase, ", variations:["balcony doors, "]},
      {original: "sharing a "},
      {original: "glass of lemonade, ", variations:["glass of orangeade, "]},
      {original: "while everyone else was taking pictures. You laughed at one of my terrible jokes, and honestly, I think that's when I started falling for you.\nIt's only been a few months, but somehow it feels like I've known you much longer.I don't want to make this complicated, so I'll just say it: I think I'm falling in love with you.And I hope you feel it too.\n\nYours,\nA."}
    ]
  }
}

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
  const [textMemories, setTextMemories] = useState<Record<number, string[]>>(
    () =>
      Object.fromEntries(
        Object.entries(textMemoryData).map(([id, memory]) => [
          Number(id),
          memory.sentences.map(sentence => sentence.original),
        ])
      )
  );
  const [changedSentences, setChangedSentences] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (
      !selectedMemory ||
      selectedMemory.type !== "text" ||
      !isActive
    ) return;

    const memoryKey = memoryIdx * 10 + selectedMemory.id;
    const originalMemory = textMemoryData[memoryKey];

    if (!originalMemory) return;

    const interval = setInterval(() => {

      // Find sentences that haven't changed yet
      const candidates = originalMemory.sentences
        .map((sentence, index) => ({
          sentence,
          index,
          key: `${memoryIdx}-${selectedMemory.id}-${index}`,
        }))
        .filter(item => !changedSentences.has(item.key));

      if (candidates.length === 0) return;

      // Select one random sentence
      const selected =
        candidates[Math.floor(Math.random() * candidates.length)];

      // Select one random variation
      const variations = selected.sentence.variations;

      if (!variations) return;

      const variation =
        variations[Math.floor(Math.random() * variations.length)];

      // Update only that sentence
      setTextMemories(previous => {
        const current = previous[memoryKey] ??
          originalMemory.sentences.map(s => s.original);

        const updated = [...current];
        updated[selected.index] = variation;

        return {
          ...previous,
          [memoryKey]: updated,
        };
      });

      // Remember that this sentence has changed
      setChangedSentences(previous =>
        new Set([...previous, selected.key])
      );

    }, 5000);

    return () => clearInterval(interval);

  }, [selectedMemory, memoryIdx, isActive, changedSentences]);

  // Reporting anomaly
  const [isSelectingQuizMemory, setIsSelectingQuizMemory] = useState(false);
  const [quizMemory, setQuizMemory] = useState<number | null>(null);

  function handleMemoryClick(image: PositionedImage) {
    if (isSelectingQuizMemory) {
      setQuizMemory(image.id + memoryIdx * 10);
      setIsSelectingQuizMemory(false);
      return;
    }
    setSelectedMemory(image);
  }

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
      {!quizMemory && (<Overlay
        onBackClick={onBackClick}
        selectedMemory={selectedMemory !== null}
        onReportClick={() => {
          setSelectedMemory(null);
          setIsSelectingQuizMemory(true);
        }}
      />)}

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
              className={`image-card ${isSelectingQuizMemory ? "quiz-selectable" : ""}`}
              style={{
                gridColumn: image.column,
                gridRow: image.row,
              }}
              onClick={() => handleMemoryClick(image)}
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
          className="memory-content"
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
              sentences={
                textMemories[selectedMemory.id + memoryIdx * 10] ?? []
              }
              onClose={() => setSelectedMemory(null)}
            />
          )}
        </div>
      )}
      {quizMemory && (
        <ReportQuiz
          memory={quizMemory}
          onClose={() => setQuizMemory(null)}
        />
      )}
    </div>
  );
}
