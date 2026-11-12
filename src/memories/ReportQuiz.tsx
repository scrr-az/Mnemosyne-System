
import { useState } from "react";
import './MemoryOverlay.css';

interface ReportQuizProps {
  memory: number;
  onClose: () => void;
  onSubmitAnswer: (correct: boolean) => void;
}

type QuizItem = {
  id: number;
  question: string;
  answers: string[];
  correctIdx: number;
}

// 1 to 10 is graduation
// 11 to 20 is love
// 21 to 30 is grandma
const quizes: QuizItem[] = [
  {
    id: 1,
    question: "What color was the hat originally?",
    answers: ["Black", "Blue", "Red"],
    correctIdx: 0
  },
  {
    id: 2,
    question: "In class, how many people were in front of you?",
    answers: ["1 student", "2 students", "2 students and 1 teacher"],
    correctIdx: 1
  },
  {
    id: 11,
    question: "What piece of jewellery was originally shown in the photo?",
    answers: ["Bracelet", "Ring", "Earring"],
    correctIdx: 1
  },
  {
    id: 12,
    question: "What item was originally on the table?",
    answers: ["Plant", "Candle", "Nothing"],
    correctIdx: 2
  },
  {
    id: 24,
    question: "Who was originally shown in the photo?",
    answers: ["Maria", "St. Antonio", "Teresinha"],
    correctIdx: 0
  },
  {
    id: 26,
    question: "What amount was originally shown on the bill?",
    answers: ["10 euros", "20 euros", "50 euros"],
    correctIdx: 0
  },
];

export default function ReportQuiz({
    memory,
    onClose,
    onSubmitAnswer
}: ReportQuizProps) {

    const quiz = quizes.find(q => q.id === memory);

    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);


    if (!quiz) {
        return (
        <div className="memory-overlay">
            <div className="quiz-card">
                <button onClick={onClose} className="back-button-memory">[x]</button>
                <p>No anomaly found in this memory.</p>
            </div>
        </div>
        );
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (selectedAnswer === null) return;

        const isCorrect = selectedAnswer === quiz?.correctIdx;

        setSubmitted(true);
        onSubmitAnswer(isCorrect);
    }

    return (
        <div className="memory-overlay">
            <div className="quiz-card">

                <h2>
                The fragment was reported. To restore it,
                answer the following question.
                </h2>

                <p className="question">{quiz.question}</p>

                <form onSubmit={handleSubmit}>
                    {quiz.answers.map((answer, index) => (
                        <div key={index}>
                            <input
                                type="radio"
                                id={`answer-${index}`}
                                name="quiz-answer"
                                value={index}
                                checked={selectedAnswer === index}
                                onChange={() => setSelectedAnswer(index)}
                                disabled={submitted}
                            />

                            <label htmlFor={`answer-${index}`}>
                                {answer}
                            </label>
                        </div>
                    ))}

                    <div className="buttons">
                        <button onClick={onClose}>[cancel report]</button>

                        {!submitted && (
                            <button type="submit" disabled={selectedAnswer === null}>
                            [restore fragment]
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
