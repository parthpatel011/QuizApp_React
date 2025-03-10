import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";

export function Quiz() {
  const [questions, setQuestions] = useState([]);
  const location = useLocation();
  const userId = location.state?.userId;
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [submittedQuestions, setSubmittedQuestions] = useState({}); // e.g., { [questionId]: { isCorrect: boolean } }
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/getQuestions");
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setFetchError("Failed to load quizzes");
      } finally {
        setIsLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Handle error state
  if (fetchError) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{fetchError}</div>
      </div>
    );
  }

  // If no questions are fetched
  if (!questions || questions.length === 0) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">No quizzes available at the moment</div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isCurrentSubmitted = submittedQuestions[currentQuestion.id];

  const handleOptionChange = (questionId, optionId) => {
    if (!submittedQuestions[questionId]) {
      setSelectedOptions({ ...selectedOptions, [questionId]: optionId });
    }
  };

  const handleQuestionSubmit = () => {
    if (submittedQuestions[currentQuestion.id]) return;

    const selectedOptionId = selectedOptions[currentQuestion.id];
    if (!selectedOptionId) return; 

    const selectedOption = currentQuestion.options.find(
      (opt) => opt.id === selectedOptionId
    );

    if (selectedOption && selectedOption.isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
    setSubmittedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: { isCorrect: selectedOption ? selectedOption.isCorrect : false },
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!submittedQuestions[currentQuestion.id] && selectedOptions[currentQuestion.id]) {
      handleQuestionSubmit();
    }
    
    const quizData = {
      userId: userId,
      quizTitle: "Sample Quiz",
      score: score,
      currentDate: new Date().toISOString(),
      totalQuestions: questions.length,
    };
    console.log(quizData);
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/quizData", quizData);
      console.log("Quiz submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
    
    setIsQuizCompleted(true);
  };
  

  const handleHome = () => {
    if (!isQuizCompleted) {
      const confirmLeave = window.confirm(
        "You have not submitted the quiz yet. If you go to the dashboard now, you will have to restart the quiz. Do you wish to continue?"
      );
      if (confirmLeave) {
        navigate("/dashboard");
      }
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="container mt-4 text-start">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Quiz</h1>
        <button type="button" className="btn btn-warning" onClick={handleHome}>
          Home
        </button>
      </div>

      <div className="alert alert-info">Score: {score}</div>

      <p className="fw-bold">
        Question {currentIndex + 1} of {questions.length}
      </p>

      {!isQuizCompleted ? (
        <form onSubmit={handleQuizSubmit}>
          <div className="mb-4">
            <h5>{currentQuestion.question}</h5>
            {currentQuestion.options.map((option) => (
              <div className="form-check" key={option.id}>
                <input
                  className="form-check-input"
                  type="radio"
                  name={`question_${currentQuestion.id}`}
                  id={`question_${currentQuestion.id}_option_${option.id}`}
                  value={option.id}
                  checked={selectedOptions[currentQuestion.id] === option.id}
                  onChange={() => handleOptionChange(currentQuestion.id, option.id)}
                  disabled={!!submittedQuestions[currentQuestion.id]}
                />
                <label
                  className="form-check-label"
                  htmlFor={`question_${currentQuestion.id}_option_${option.id}`}
                >
                  {option.text}
                </label>
              </div>
            ))}
          </div>

          {submittedQuestions[currentQuestion.id] &&
            !submittedQuestions[currentQuestion.id].isCorrect && (
              <div className="alert alert-danger">Wrong answer</div>
            )}

          <div className="d-flex justify-content-between align-items-center">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              Previous
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleQuestionSubmit}
              disabled={!!submittedQuestions[currentQuestion.id]}
            >
              Submit Answer
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-success"
                disabled={!submittedQuestions[currentQuestion.id]}
              >
                Submit Quiz
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="alert alert-success mt-4">
          <h4>Quiz Completed!</h4>
          <p>Your final score is: {score} / {questions.length}</p>
        </div>
      )}
    </div>
  );
}
