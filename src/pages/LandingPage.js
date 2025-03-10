export function LandingPage() {
  return (
    <div className="landing-page">
      <h1>Welcome to the Quiz App</h1>
      <p>Test your knowledge with our quiz!</p>
      <Link to="/dashboard">
        <button className="start-button">Start Quiz</button>
      </Link>
    </div>
  );
}
