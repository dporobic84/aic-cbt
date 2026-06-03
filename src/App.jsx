import React, { useMemo, useState } from "react";

const PASS_MARK = 80;
const VALID_ANSWERS = ["YES", "NO", "UNSURE"];

const APP_CSS = `
*{box-sizing:border-box}
html,body,#root{margin:0;min-height:100%;font-family:Arial,sans-serif;background:#061b33;color:white}
.app-shell,.training-shell,.result-shell{min-height:100vh;padding:32px;background:linear-gradient(135deg,#021024,#03203f)}
.login-layout,.start-layout{max-width:1200px;margin:auto;display:grid;grid-template-columns:1fr 420px;gap:40px;align-items:center;min-height:calc(100vh - 64px)}
.hero-panel h1{font-size:56px;line-height:1.05;margin:20px 0}
.hero-panel p{font-size:18px;line-height:1.5}
.eyebrow{font-weight:700;color:#cfe8ff}
.demo-box,.test-box{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:20px;padding:18px;margin-top:20px;display:grid;gap:8px}
.login-card,.profile-card,.result-card{background:white;color:#0f172a;border-radius:24px;padding:28px;box-shadow:0 20px 60px rgba(0,0,0,.25)}
label{display:block;font-weight:800;margin-top:14px}
input{width:100%;padding:14px;border:1px solid #cbd5e1;border-radius:14px;margin-top:8px}
.primary-btn,.primary-light-btn,.outline-btn,.secondary-btn,.danger-btn,.save-btn{border:0;border-radius:14px;padding:14px 22px;font-weight:900;cursor:pointer}
.primary-btn{background:#020617;color:white}
.primary-light-btn{background:white;color:#020617}
.outline-btn{background:rgba(255,255,255,.1);color:white;border:1px solid rgba(255,255,255,.25)}
.secondary-btn{background:white;color:#020617;border:1px solid #cbd5e1}
.danger-btn{background:#dc2626;color:white}
.button-row{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}
.badge-row{display:flex;gap:8px;flex-wrap:wrap}
.badge-row span{background:white;color:#0f172a;padding:8px 12px;border-radius:999px;font-size:13px;font-weight:800}
.profile-box{display:grid;gap:6px;background:#f1f5f9;padding:16px;border-radius:16px}
.success-box,.info-box{background:#ecfdf5;color:#065f46;border-radius:16px;padding:14px;margin-top:16px}
.error-box{background:#fee2e2;color:#991b1b;border-radius:14px;padding:12px;margin-top:12px}
.simple-list{padding-left:18px;line-height:1.8}
.training-container{max-width:1450px;margin:auto}
.training-header{background:#020617;border-radius:24px;padding:28px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 20px 60px rgba(0,0,0,.25)}
.training-header h1{font-size:44px;margin:0 0 12px}
.save-btn{background:transparent;color:white;border:1px solid rgba(255,255,255,.5);text-transform:uppercase}
.progress-track{height:8px;background:white;border-radius:999px;margin:20px 0;overflow:hidden}
.progress-track div{height:100%;background:#84cc16}
.training-card{background:white;color:#0f172a;border-radius:24px;padding:24px;display:grid;grid-template-columns:1fr 340px;gap:24px;box-shadow:0 20px 60px rgba(0,0,0,.25)}
.image-area{display:grid;grid-template-columns:1fr 80px 1fr;gap:20px;align-items:start}
.photo-title{background:#032b5b;color:white;text-align:center;font-size:24px;font-weight:900;padding:16px;border-radius:12px;margin-bottom:14px}
.photo-title span{display:block;font-size:16px;font-weight:600;margin-top:4px}
.photo-panel img{width:100%;height:430px;object-fit:cover;object-position:center top;border-radius:14px;border:1px solid #cbd5e1;display:block;background:#e2e8f0}
.image-path{font-size:11px;color:#64748b;margin-top:8px;word-break:break-all}
.vs-badge{width:70px;height:70px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:white;color:#032b5b;font-size:30px;font-weight:900;border:2px solid #cbd5e1;margin-top:185px}
.features-panel{border:1px solid #cbd5e1;border-radius:18px;overflow:hidden}
.features-title{background:#032b5b;color:white;font-weight:900;padding:18px;text-align:center}
.feature-row{display:grid;grid-template-columns:48px 1fr;gap:12px;padding:16px;border-bottom:1px solid #e2e8f0}
.feature-row:last-child{border-bottom:0}
.feature-icon{font-size:30px;text-align:center;color:#032b5b}
.feature-row strong{display:block;font-size:18px}
.feature-row span{display:block;color:#475569;margin-top:4px}
.question-panel{grid-column:1/2;background:#f8fafc;border:1px solid #e2e8f0;border-radius:18px;padding:22px;text-align:center}
.question-panel h2{font-size:30px;margin:0 0 18px}
.answer-row{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.answer{border:0;border-radius:14px;padding:20px;font-size:24px;font-weight:900;color:white;cursor:pointer}
.answer:disabled{opacity:.65;cursor:not-allowed}
.yes{background:#16a34a}
.no{background:#dc2626}
.unsure{background:#64748b}
.feedback{grid-column:1/-1;border-radius:18px;padding:18px}
.feedback.correct{background:#dcfce7;color:#166534}
.feedback.incorrect{background:#fee2e2;color:#991b1b}
.bottom-tip{text-align:center;font-size:20px;margin-top:18px}
.result-card{max-width:1000px;margin:auto}
.result-header{display:flex;justify-content:space-between;gap:20px}
.status-pass,.status-fail{border-radius:999px;padding:10px 16px;font-weight:900;height:max-content}
.status-pass{background:#dcfce7;color:#166534}
.status-fail{background:#fee2e2;color:#991b1b}
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:24px 0}
.stats-grid div{background:#f1f5f9;border-radius:18px;padding:24px;text-align:center}
.stats-grid strong{display:block;font-size:42px}
.stats-grid span{color:#64748b}
.review-row{display:block;border:1px solid #e2e8f0;border-radius:14px;padding:14px;margin-bottom:10px}
.review-row-header{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}
.review-row span{display:block;color:#64748b}
.failed-review{margin-top:14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:14px}
.failed-review h4{margin:0 0 10px;color:#991b1b}
.failed-review-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:12px}
.failed-review-panel strong{display:block;margin-bottom:8px;color:#0f172a}
.failed-review-panel img{width:100%;height:300px;object-fit:cover;object-position:center top;border-radius:12px;border:1px solid #cbd5e1;background:#e2e8f0}
.failed-review p{margin:12px 0 0;color:#334155;line-height:1.45}
.pass-text{color:#16a34a}
.fail-text{color:#dc2626}
.partial-text{color:#ca8a04}
.test-row{display:flex;justify-content:space-between}
@media(max-width:1100px){
.login-layout,.start-layout,.training-card,.image-area{grid-template-columns:1fr}
.features-panel{grid-row:auto}
.question-panel{grid-column:auto}
.vs-badge{margin:0 auto}
.answer-row,.stats-grid{grid-template-columns:1fr}
.hero-panel h1,.training-header h1{font-size:36px}
.photo-panel img{height:360px}
.failed-review-grid{grid-template-columns:1fr}
.failed-review-panel img{height:260px}
}
`;

const DEMO_USERS = [
  {
    id: "u001",
    name: "Officer Smith",
    email: "officer.smith@airport.local",
    password: "Training123",
    role: "Officer",
    department: "Staff Access Control",
  },
  {
    id: "u002",
    name: "Officer Murphy",
    email: "officer.murphy@airport.local",
    password: "Training123",
    role: "Officer",
    department: "Staff Access Control",
  },
  {
    id: "admin001",
    name: "Training Admin",
    email: "admin@airport.local",
    password: "Admin123",
    role: "Admin",
    department: "Security Training",
  },
];

const QUESTION_BANK = [
  ...Array.from({ length: 20 }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return {
      id: i + 1,
      category: "Easy YES",
      difficulty: "Easy",
      imageA: `/images/easy/yes/question-${n}-a.png`,
      imageB: `/images/easy/yes/question-${n}-b.png`,
      correct: "YES",
      explanation: "Correct answer: YES. Same person. Compare stable facial features.",
    };
  }),

  ...Array.from({ length: 20 }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return {
      id: i + 101,
      category: "Easy NO",
      difficulty: "Easy",
      imageA: `/images/easy/no/question-${n}-a.png`,
      imageB: `/images/easy/no/question-${n}-b.png`,
      correct: "NO",
      explanation: "Correct answer: NO. Different people. Compare eyes, nose, jawline and face shape.",
    };
  }),

  ...Array.from({ length: 21 }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return {
      id: i + 301,
      category: "Medium NO",
      difficulty: "Medium",
      imageA: `/images/medium/no/question-${n}-a.png`,
      imageB: `/images/medium/no/question-${n}-b.png`,
      correct: "NO",
      explanation: "Correct answer: NO. Similar appearance, but stable facial features differ.",
    };
  }),
];


function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function createRandomQuestions() {
  return shuffleArray(QUESTION_BANK).slice(0, 20);
}

const FEATURES = [
  { title: "Eyes", text: "Shape, size, eye spacing", icon: "◉" },
  { title: "Nose", text: "Shape, bridge, width", icon: "⌒" },
  { title: "Mouth", text: "Shape, lip thickness", icon: "═" },
  { title: "Jawline", text: "Shape, angle, definition", icon: "⌞⌟" },
  { title: "Ears", text: "Shape, size, position", icon: "☊" },
  { title: "Face Shape", text: "Overall structure", icon: "⬯" },
  { title: "Distinctive Marks", text: "Moles, scars, marks", icon: "•" },
];

function calculateAnswerPoints(answer) {
  if (answer.selected === answer.correct) {
    return 1;
  }

  if (answer.selected === "UNSURE" && answer.correct === "YES") {
    return 0.5;
  }

  if (answer.isCorrect) {
    return 1;
  }

  return 0;
}

function calculateScore(answers) {
  return answers.reduce((total, answer) => total + calculateAnswerPoints(answer), 0);
}

function calculatePercentage(score, total) {
  if (!total) return 0;
  return Number(((score / total) * 100).toFixed(1));
}

function displayAnswer(value) {
  return value === "UNSURE" ? "PIN CHECK" : value;
}

function formatScore(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function didPass(percentage) {
  return percentage >= PASS_MARK;
}

function authenticateUser(email, password) {
  return DEMO_USERS.find(
    (user) =>
      user.email.toLowerCase() === email.trim().toLowerCase() &&
      user.password === password
  );
}

function runSelfTests() {
  const demoAnswers = [
    { selected: "YES", correct: "YES" },
    { selected: "NO", correct: "YES" },
    { selected: "UNSURE", correct: "YES" },
    { selected: "UNSURE", correct: "NO" },
    { selected: "NO", correct: "NO" },
  ];

  const score = calculateScore(demoAnswers);

  return [
    { name: "Score gives full and partial credit correctly", pass: score === 2.5 },
    {
      name: "Percentage handles 2.5 out of 5 as 50%",
      pass: calculatePercentage(score, demoAnswers.length) === 50,
    },
    {
      name: "Zero total returns 0% safely",
      pass: calculatePercentage(1, 0) === 0,
    },
    {
      name: "80% is pass and 79% is fail",
      pass: didPass(80) === true && didPass(79) === false,
    },
    {
    name: "Question bank contains at least 20 questions",
  pass: QUESTION_BANK.length >= 20,
    },
    {
      name: "Random CBT session contains 20 questions",
      pass: createRandomQuestions().length === 20,
    },
    {
      name: "Every answer key is valid",
      pass: QUESTION_BANK.every((question) => VALID_ANSWERS.includes(question.correct)),
    },
    {
      name: "Every image path points to public/images",
      pass: QUESTION_BANK.every((question) => question.imageA.startsWith("/images/") && question.imageB.startsWith("/images/")),
    },
    {
      name: "Known demo user can log in",
      pass: Boolean(authenticateUser("officer.smith@airport.local", "Training123")),
    },
    {
      name: "Invalid password is rejected",
      pass: authenticateUser("officer.smith@airport.local", "wrong") === undefined,
    },
  ];
}

function ImageWithFallback({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        style={{
          height: 430,
          borderRadius: 14,
          background: "#fee2e2",
          color: "#991b1b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 20,
          fontWeight: 900,
        }}
      >
        Image not found:<br />{src}
      </div>
    );
  }

  return <img src={src} alt={alt} onError={() => setFailed(true)} />;
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState("officer.smith@airport.local");
  const [password, setPassword] = useState("Training123");
  const [loginError, setLoginError] = useState("");
  const [savedResults, setSavedResults] = useState([]);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [showTests, setShowTests] = useState(false);
  const [questions, setQuestions] = useState(() => createRandomQuestions());

  const current = questions[index];
  const selfTests = useMemo(() => runSelfTests(), []);
  const score = useMemo(() => calculateScore(answers), [answers]);
  const percentage =
    answers.length === questions.length
      ? calculatePercentage(score, questions.length)
      : 0;
  const pass = didPass(percentage);
  const userResults = currentUser
    ? savedResults.filter((result) => result.userId === currentUser.id)
    : [];

  function handleLogin(event) {
    event.preventDefault();

    const matchedUser = authenticateUser(email, password);

    if (!matchedUser) {
      setLoginError("Invalid email or password. Try the demo credentials shown on this screen.");
      return;
    }

    setCurrentUser(matchedUser);
    setLoginError("");
    setStarted(false);
    setFinished(false);
    setAnswers([]);
    setSelected(null);
    setIndex(0);
    setQuestions(createRandomQuestions());
  }

  function logout() {
    setCurrentUser(null);
    setStarted(false);
    setFinished(false);
    setAnswers([]);
    setSelected(null);
    setIndex(0);
    setLoginError("");
  }

  function startTraining() {
    setQuestions(createRandomQuestions());
    setStarted(true);
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
  }

  function answerQuestion(value) {
    if (selected) return;

    setSelected(value);

    setAnswers((previous) => [
      ...previous,
      {
        questionId: current.id,
        selected: value,
        correct: current.correct,
        isCorrect: value === current.correct,
        category: current.category,
        imageA: current.imageA,
        imageB: current.imageB,
        explanation: current.explanation,
        points:
          value === current.correct
            ? 1
            : value === "UNSURE" && current.correct === "YES"
              ? 0.5
              : 0,
      },
    ]);
  }

  function nextQuestion() {
    if (index + 1 >= questions.length) {
      const finalScore = calculateScore(answers);
      const finalPercentage = calculatePercentage(finalScore, questions.length);

      setSavedResults((previous) => [
        {
          id: `result-${Date.now()}`,
          userId: currentUser?.id || "unknown",
          userName: currentUser?.name || "Unknown User",
          email: currentUser?.email || "unknown",
          completedAt: new Date().toLocaleString(),
          score: finalScore,
          total: questions.length,
          percentage: finalPercentage,
          pass: didPass(finalPercentage),
        },
        ...previous,
      ]);

      setFinished(true);
      return;
    }

    setIndex((previous) => previous + 1);
    setSelected(null);
  }

  if (!currentUser) {
    return (
      <>
        <style>{APP_CSS}</style>
        <main className="app-shell">
          <section className="login-layout">
            <div className="hero-panel">
              <div className="eyebrow">◆ Personalised Officer CBT</div>
              <h1>AIC Facial Comparison Training</h1>
              <p>
                Login allows the CBT to record each officer's individual score,
                completion date, pass/fail status and training history.
              </p>

              <div className="demo-box">
                <strong>Demo login credentials</strong>
                <span>Officer: officer.smith@airport.local / Training123</span>
                <span>Officer: officer.murphy@airport.local / Training123</span>
                <span>Admin: admin@airport.local / Admin123</span>
              </div>
            </div>

            <form className="login-card" onSubmit={handleLogin}>
              <h2>Officer Login</h2>
              <p>Enter your email and password to start personalised training.</p>

              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />

              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              {loginError && <div className="error-box">{loginError}</div>}

              <button className="primary-btn" type="submit">
                Login
              </button>

              <div className="info-box">
                <strong>Future live version:</strong> connect this login to an
                independent user database, admin dashboard and officer training records.
              </div>
            </form>
          </section>
        </main>
      </>
    );
  }

  if (!started) {
    return (
      <>
        <style>{APP_CSS}</style>
        <main className="app-shell">
          <section className="start-layout">
            <div className="hero-panel">
              <div className="eyebrow">◆ Staff Access Officer CBT</div>
              <h1>AIC Facial Comparison Training</h1>
              <p>
                Welcome, <strong>{currentUser.name}</strong>. This personalised
                CBT records your individual result, completion date and pass/fail status.
              </p>

              <div className="badge-row">
                <span>{currentUser.role}</span>
                <span>{currentUser.department}</span>
                <span>{currentUser.email}</span>
              </div>

              <div className="button-row">
                <button className="primary-light-btn" onClick={startTraining}>
                  Start CBT
                </button>
                <button className="outline-btn" onClick={logout}>
                  Log Out
                </button>
                <button
                  className="outline-btn"
                  onClick={() => setShowTests((previous) => !previous)}
                >
                  {showTests ? "Hide Tests" : "Show Tests"}
                </button>
              </div>

              {showTests && (
                <div className="test-box">
                  <h3>Built-in logic tests</h3>
                  {selfTests.map((test) => (
                    <div className="test-row" key={test.name}>
                      <span>{test.name}</span>
                      <strong className={test.pass ? "pass-text" : "fail-text"}>
                        {test.pass ? "PASS" : "FAIL"}
                      </strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="profile-card">
              <h2>Officer profile</h2>

              <div className="profile-box">
                <strong>{currentUser.name}</strong>
                <span>{currentUser.email}</span>
                <span>Role: {currentUser.role}</span>
                <span>Department: {currentUser.department}</span>
              </div>

              {userResults.length > 0 && (
                <div className="success-box">
                  <strong>Previous result:</strong> {userResults[0].percentage}% —{" "}
                  {userResults[0].pass ? "PASS" : "RETAKE REQUIRED"}
                </div>
              )}

              <h2>Officer comparison checklist</h2>
              <ul className="simple-list">
                {FEATURES.map((feature) => (
                  <li key={feature.title}>
                    ✓ {feature.title}: {feature.text}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>
      </>
    );
  }

  if (finished) {
    return (
      <>
        <style>{APP_CSS}</style>
        <main className="result-shell">
          <section className="result-card">
            <div className="result-header">
              <div>
                <h1>★ CBT Result</h1>
                <p>AIC Facial Comparison Training completed by {currentUser.name}.</p>
              </div>

              <div className={pass ? "status-pass" : "status-fail"}>
                {pass ? "PASS" : "RETAKE REQUIRED"}
              </div>
            </div>

            <div className="stats-grid">
              <div>
                <strong>{percentage}%</strong>
                <span>Final score</span>
              </div>
              <div>
                <strong>
                  {formatScore(score)}/{questions.length}
                </strong>
                <span>Correct answers</span>
              </div>
              <div>
                <strong>{PASS_MARK}%</strong>
                <span>Pass mark</span>
              </div>
            </div>

            <div className="review-list">
              {answers.map((answer, answerIndex) => (
                <div className="review-row" key={`${answer.questionId}-${answerIndex}`}>
                  <div className="review-row-header">
                    <div>
                      <strong>Question {answerIndex + 1}</strong>
                      <span>
                        Selected: {displayAnswer(answer.selected)} | Correct: {answer.correct} | Points: {formatScore(answer.points ?? calculateAnswerPoints(answer))}
                      </span>
                    </div>

                    <b
                      className={
                        (answer.points ?? calculateAnswerPoints(answer)) === 1
                          ? "pass-text"
                          : (answer.points ?? calculateAnswerPoints(answer)) === 0.5
                            ? "partial-text"
                            : "fail-text"
                      }
                    >
                      {(answer.points ?? calculateAnswerPoints(answer)) === 1
                        ? "✓"
                        : (answer.points ?? calculateAnswerPoints(answer)) === 0.5
                          ? "½"
                          : "✕"}
                    </b>
                  </div>

                  {(answer.points ?? calculateAnswerPoints(answer)) < 1 && (
                    <div className="failed-review">
                      <h4>{(answer.points ?? calculateAnswerPoints(answer)) === 0.5 ? "Review PIN CHECK decision" : "Review incorrect decision"}</h4>

                      <div className="failed-review-grid">
                        <div className="failed-review-panel">
                          <strong>Image A — AIC / ID Photo</strong>
                          <img src={answer.imageA} alt={`Question ${answerIndex + 1} AIC review`} />
                        </div>

                        <div className="failed-review-panel">
                          <strong>Image B — Live / Person Photo</strong>
                          <img src={answer.imageB} alt={`Question ${answerIndex + 1} live review`} />
                        </div>
                      </div>

                      <p>{answer.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="button-row">
              <button className="primary-btn" onClick={startTraining}>
                ↻ Restart Training
              </button>
              <button
                className="secondary-btn"
                onClick={() => {
                  setStarted(false);
                  setFinished(false);
                }}
              >
                Back to Profile
              </button>
              <button className="danger-btn" onClick={logout}>
                Log Out
              </button>
            </div>
          </section>
        </main>
      </>
    );
  }

  const isCorrect = selected === current.correct;
  const isPartial = selected === "UNSURE" && current.correct === "YES";
  const progress = Math.round(((index + (selected ? 1 : 0)) / questions.length) * 100);

  return (
    <>
      <style>{APP_CSS}</style>

      <main className="training-shell">
        <section className="training-container">
          <header className="training-header">
            <div>
              <h1>AIC Facial Comparison Training</h1>
              <p>
                {currentUser.name} | Question {index + 1} of {questions.length}
              </p>
            </div>

            <button className="save-btn" onClick={() => setStarted(false)}>
              Save & Exit
            </button>
          </header>

          <div className="progress-track">
            <div style={{ width: `${progress}%` }} />
          </div>

          <div className="training-card">
            <div className="image-area">
              <div className="photo-panel">
                <div className="photo-title">
                  IMAGE A <span>AIC / ID PHOTO</span>
                </div>
                <ImageWithFallback src={current.imageA} alt="AIC comparison example" />
             
              </div>

              <div className="vs-badge">VS</div>

              <div className="photo-panel">
                <div className="photo-title">
                  IMAGE B <span>LIVE / PERSON PHOTO</span>
                </div>
                <ImageWithFallback src={current.imageB} alt="Live environment comparison" />
                
              </div>
            </div>

            <aside className="features-panel">
              <div className="features-title">KEY FEATURES TO COMPARE</div>

              {FEATURES.map((feature) => (
                <div className="feature-row" key={feature.title}>
                  <div className="feature-icon">{feature.icon}</div>
                  <div>
                    <strong>{feature.title}</strong>
                    <span>{feature.text}</span>
                  </div>
                </div>
              ))}
            </aside>

            <div className="question-panel">
              <h2>IS THIS THE SAME PERSON?</h2>

              <div className="answer-row">
                <button
                  className="answer yes"
                  disabled={Boolean(selected)}
                  onClick={() => answerQuestion("YES")}
                >
                  ✓ YES
                </button>

                <button
                  className="answer no"
                  disabled={Boolean(selected)}
                  onClick={() => answerQuestion("NO")}
                >
                  ✕ NO
                </button>

                <button
                  className="answer unsure"
                  disabled={Boolean(selected)}
                  onClick={() => answerQuestion("UNSURE")}
                >
                  🔎 PIN CHECK
                </button>
              </div>
            </div>

            {selected && (
              <div className={isCorrect || isPartial ? "feedback correct" : "feedback incorrect"}>
                <strong>
                  {isCorrect
                    ? "✓ Correct — 1 point"
                    : isPartial
                      ? "🔎 PIN CHECK — 0.5 point"
                      : "✕ Incorrect — 0 points"}
                </strong>
                <p>{current.explanation}</p>

                <button className="primary-btn" onClick={nextQuestion}>
                  {index + 1 >= questions.length ? "Finish CBT" : "Next Question"}
                </button>
              </div>
            )}
          </div>

          <div className="bottom-tip">
            💡 Focus on stable facial features. Do not rely on hair, facial hair,
            glasses, clothing or lighting.
            </div>
            
             
       
        </section>
      </main>
    </>
  );
}

export default App;
