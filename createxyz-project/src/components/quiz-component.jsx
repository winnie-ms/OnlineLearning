"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ quizId, title, questions = [], onSubmit }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);

  const handleOptionSelect = (questionIndex, option) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length !== questions.length) {
      setError("Please answer all questions before submitting");
      return;
    }

    try {
      const answers = questions.map((_, index) => selectedAnswers[index]);
      const response = await fetch("/api/quiz-operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "submit",
          quizId,
          answers
        })
      });

      if (!response.ok) {
        throw new Error("Failed to submit quiz");
      }

      const result = await response.json();
      setScore(result.score);
      setSubmitted(true);
      onSubmit?.(result);
    } catch (err) {
      setError("Failed to submit quiz. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6">
      {title && (
        <h2 className="text-2xl font-semibold font-inter text-gray-800 mb-6">{title}</h2>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {error}
        </div>
      )}

      {submitted && score !== null ? (
        <div className="text-center p-6 bg-blue-50 rounded-xl">
          <div className="text-4xl font-bold text-blue-600 mb-2">{score}%</div>
          <p className="text-gray-700">Quiz completed! Your score has been recorded.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-800 mb-3">
                {index + 1}. {question.question}
              </p>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    onClick={() => handleOptionSelect(index, option)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedAnswers[index] === option
                        ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
                        : "bg-white hover:bg-gray-100 text-gray-700 border-2 border-gray-200"
                    }`}
                  >
                    <i className={`far fa-${selectedAnswers[index] === option ? "check-circle" : "circle"} mr-2`}></i>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Submit Quiz
          </button>
        </div>
      )}
    </div>
  );
}

function StoryComponent() {
  const sampleQuestions = [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
    }
  ];

  const longQuiz = [
    {
      question: "What is JavaScript?",
      options: ["A programming language", "A type of coffee", "A text editor", "An operating system"],
    },
    {
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Hyper Transfer Markup Logic",
        "Home Tool Markup Language"
      ],
    },
    {
      question: "Which of these is a CSS framework?",
      options: ["React", "Tailwind", "Python", "Java"],
    }
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen space-y-12">
      <div>
        <h2 className="text-xl font-bold mb-4 font-inter">Basic Quiz</h2>
        <MainComponent
          quizId={1}
          title="Geography Quiz"
          questions={sampleQuestions}
          onSubmit={(result) => console.log("Quiz submitted:", result)}
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 font-inter">Longer Programming Quiz</h2>
        <MainComponent
          quizId={2}
          title="Programming Fundamentals"
          questions={longQuiz}
          onSubmit={(result) => console.log("Quiz submitted:", result)}
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 font-inter">Empty Quiz</h2>
        <MainComponent
          quizId={3}
          title="No Questions Available"
          questions={[]}
        />
      </div>
    </div>
  );
});
}