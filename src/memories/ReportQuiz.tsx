
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

const quizes: QuizItem[] = [
  {
    id: 1,
    question: "Question for the first memory",
    answers: ["answer 1", "answer 2", "answer 3", "answer 4"],
    correctIdx: 1
  },
  {
    id: 2,
    question: "Question for the second memory",
    answers: ["answer 1", "answer 2", "answer 3", "answer 4"],
    correctIdx: 1
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
            <p>No quiz found for this memory.</p>
            <button onClick={onClose}>Close</button>
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

                <button onClick={onClose}>[cancel report]</button>

                {!submitted && (
                    <button type="submit" disabled={selectedAnswer === null}>
                    [restore fragment]
                    </button>
                )}
                </form>
            </div>
        </div>
    );
}
