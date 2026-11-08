
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const webgazer = window.webgazer;


interface GazePosition {
  x: number;
  y: number;
}

interface EyeTrackingContextType {
  gaze: GazePosition | null;
  isTracking: boolean;
  restartTracking: () => Promise<void>;
  stopTracking: () => void;
}

const EyeTrackingContext =
  createContext<EyeTrackingContextType | null>(null);

export function EyeTrackingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [gaze, setGaze] = useState<GazePosition | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const startedRef = useRef(false);
  const startingRef = useRef(false);

  const startTracking = async () => {
    if (startingRef.current) return;

    startingRef.current = true;

    try {
      webgazer.showVideoPreview(false);
      webgazer.showFaceOverlay(false);
      webgazer.showFaceFeedbackBox(false);
      webgazer.showPredictionPoints(true);

      webgazer.params.faceMeshSolutionPath =
        "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh";

      webgazer.setGazeListener((data) => {
        if (!data) return;

        setGaze({
          x: data.x,
          y: data.y,
        });
      });

      if (startedRef.current) {
        await webgazer.end();
        startedRef.current = false;
      }

      await webgazer.begin();

      startedRef.current = true;
      setIsTracking(true);
    } catch (error) {
      console.error("WebGazer error:", error);
      setIsTracking(false);
    } finally {
      startingRef.current = false;
    }
  };

  const stopTracking = () => {
    if (!startedRef.current) return;

    webgazer.end();
    webgazer.clearGazeListener();

    startedRef.current = false;
    setIsTracking(false);
    setGaze(null);
  };

  const restartTracking = async () => {
    if (startingRef.current) return;

    if (startedRef.current) {
      await webgazer.end();
      startedRef.current = false;
      setIsTracking(false);
    }

    await startTracking();
  };

  useEffect(() => {
    startTracking();

    return () => {
      if (startedRef.current) {
        webgazer.end();
        webgazer.clearGazeListener();
        startedRef.current = false;
      }
    };
  }, []);

  return (
    <EyeTrackingContext.Provider
      value={{
        gaze,
        isTracking,
        restartTracking,
        stopTracking,
      }}
    >
      {children}

      <div
        style={{
          position: "fixed",
          left: gaze?.x ?? -100,
          top: gaze?.y ?? -100,
          width: 18,
          height: 18,
          backgroundColor: "red",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 99999,
        }}
      />
    </EyeTrackingContext.Provider>
  );
}

export function useEyeTracking() {
  const context = useContext(EyeTrackingContext);

  if (!context) {
    throw new Error(
      "useEyeTracking must be used inside EyeTrackingProvider"
    );
  }

  return context;
}
