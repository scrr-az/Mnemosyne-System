
import { useEffect, useRef, useState } from 'react';
const webgazer = window.webgazer;

interface GazePosition {
  x: number;
  y: number;
}

export default function EyeTracker() {
    const [isTracking, setIsTracking] = useState(false);
    const [gaze, setGaze] = useState<GazePosition | null>(null);

    const dotRef = useRef<HTMLDivElement>(null);
    const activeRef = useRef(false);

    const startTracking = async () => {
        webgazer.showVideoPreview(true);
        webgazer.showFaceOverlay(true);
        webgazer.showFaceFeedbackBox(true);
        webgazer.showPredictionPoints(true);

        try {
            webgazer.setGazeListener((data) => {
                if (!data) {
                    console.log("No gaze prediction");
                    return;
                }

                console.log("Gaze position:", data.x, data.y);

                if (dotRef.current) {
                    dotRef.current.style.left = `${data.x}px`;
                    dotRef.current.style.top = `${data.y}px`;
                }

                setGaze({ x: data.x, y: data.y });
            });

            webgazer.params.faceMeshSolutionPath =
                'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh';

            await webgazer.begin();
            console.log("WebGazer ready:", webgazer.isReady());
            console.log("Tracker:", webgazer.getTracker());
            console.log("Regression:", webgazer.getRegression());

            activeRef.current = true;
            setIsTracking(true);
        } catch (error) {
            console.error("Full error:", error);

            if (error instanceof Error) {
                console.error("Stack trace:", error.stack);
            }
        }
    };

    const stopTracking = () => {
        webgazer.end();
        webgazer.clearGazeListener();

        activeRef.current = false;
        setIsTracking(false);
        setGaze(null);
    };

    useEffect(() => {
        return () => {
        if (activeRef.current) {
            webgazer.end();
            webgazer.clearGazeListener();
        }
        };
    }, []);

    return (
        <div>
        <h1>Eye Tracking Demo</h1>

        <button
            onClick={isTracking ? stopTracking : startTracking}
        >
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
        </button>

        {isTracking && (
            <p>Eye tracking is active!</p>
        )}

        {gaze && (
            <p>
            X: {gaze.x.toFixed(0)} |
            Y: {gaze.y.toFixed(0)}
            </p>
        )}

        <div
            ref={dotRef}
            style={{
            position: 'fixed',
            left: -100,
            top: -100,
            width: '18px',
            height: '18px',
            backgroundColor: 'red',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 99999,
            }}
        />
        </div>
    );
}
