import { useState } from 'react';
import ExplanationCard from './ExplanationCard';
import CategoryBadge from './CategoryBadge';

function MCQQuestion({ q, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (optId) => {
    if (revealed) return;
    setSelected(optId);
    setRevealed(true);
    onAnswer(optId === q.correct);
  };

  const optionClass = (optId) => {
    const base = 'w-full text-left border-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ';
    if (!revealed) return base + 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 cursor-pointer';
    if (optId === q.correct) return base + 'border-green-500 bg-green-50 text-green-800';
    if (optId === selected && optId !== q.correct) return base + 'border-red-400 bg-red-50 text-red-700';
    return base + 'border-slate-200 bg-white text-slate-400';
  };

  return (
    <>
      {q.sentence && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">Sentence</p>
          <p className="text-slate-800 font-medium italic">"{q.sentence}"</p>
        </div>
      )}
      <p className="text-slate-700 font-medium mb-3">{q.question}</p>
      <div className="flex flex-col gap-2">
        {q.options.map(opt => (
          <button key={opt.id} className={optionClass(opt.id)} onClick={() => handleSelect(opt.id)}>
            <span className="inline-flex items-center gap-3">
              <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold border-current flex-shrink-0">
                {opt.id}
              </span>
              {opt.text}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}

function FillBlankQuestion({ q, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (optId) => {
    if (revealed) return;
    setSelected(optId);
    setRevealed(true);
    onAnswer(optId === q.correct);
  };

  const optionClass = (optId) => {
    const base = 'w-full text-left border-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ';
    if (!revealed) return base + 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 cursor-pointer';
    if (optId === q.correct) return base + 'border-green-500 bg-green-50 text-green-800';
    if (optId === selected && optId !== q.correct) return base + 'border-red-400 bg-red-50 text-red-700';
    return base + 'border-slate-200 bg-white text-slate-400';
  };

  const displaySentence = q.sentence?.replace('_____', '______');

  return (
    <>
      <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
        <p className="text-slate-800 font-medium">{displaySentence}</p>
      </div>
      <p className="text-slate-600 text-sm mb-3">Choose the correct word or phrase:</p>
      <div className="flex flex-col gap-2">
        {q.options.map(opt => (
          <button key={opt.id} className={optionClass(opt.id)} onClick={() => handleSelect(opt.id)}>
            <span className="inline-flex items-center gap-3">
              <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold border-current flex-shrink-0">
                {opt.id}
              </span>
              {opt.text}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}

function RewriteQuestion({ q, onAnswer }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [selfGraded, setSelfGraded] = useState(null);

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;
    setRevealed(true);
  };

  const handleGrade = (correct) => {
    setSelfGraded(correct);
    onAnswer(correct);
  };

  return (
    <>
      <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">Incorrect Sentence</p>
        <p className="text-slate-800 font-medium italic">"{q.sentence}"</p>
      </div>
      <p className="text-slate-700 font-medium mb-2">Rewrite the sentence correctly:</p>
      <textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        disabled={revealed}
        placeholder="Type your corrected sentence here..."
        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 resize-none h-24 disabled:bg-slate-50"
      />
      {!revealed ? (
        <button
          onClick={handleSubmit}
          disabled={!userAnswer.trim()}
          className="mt-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-2.5 transition-colors"
        >
          Check Answer
        </button>
      ) : selfGraded === null ? (
        <div className="mt-3">
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-3">
            <p className="text-xs text-green-600 font-semibold uppercase mb-1">Correct Version</p>
            <p className="text-green-800 font-medium italic">"{q.correctSentence}"</p>
          </div>
          {q.band7 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 mb-3 text-sm">
              <span className="text-blue-600 font-semibold text-xs uppercase">Band 7: </span>
              <span className="text-blue-800 italic">"{q.band7}"</span>
            </div>
          )}
          {q.explanation && (
            <p className="text-slate-600 text-sm mb-3 leading-relaxed">{q.explanation}</p>
          )}
          <p className="text-slate-700 font-medium text-sm mb-2">How did you do?</p>
          <div className="flex gap-2">
            <button onClick={() => handleGrade(true)} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl py-2 text-sm transition-colors">
              My answer was correct ✓
            </button>
            <button onClick={() => handleGrade(false)} className="flex-1 bg-red-400 hover:bg-red-500 text-white font-semibold rounded-xl py-2 text-sm transition-colors">
              I made a mistake ✗
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default function QuestionCard({ question, questionNumber, totalQuestions, onNext, onAnswer }) {
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswer = (correct) => {
    setIsCorrect(correct);
    setAnswered(true);
    onAnswer(question.id, question.category, correct);
  };

  const isLast = questionNumber === totalQuestions;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <CategoryBadge categoryId={question.category} />
        <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
          {question.type === 'mcq' ? 'Multiple Choice' :
           question.type === 'rewrite' ? 'Rewrite' :
           question.type === 'fill_blank' ? 'Fill in the Blank' : 'Error Spot'}
        </span>
      </div>

      {question.type === 'mcq' && !answered && <MCQQuestion q={question} onAnswer={handleAnswer} />}
      {question.type === 'fill_blank' && !answered && <FillBlankQuestion q={question} onAnswer={handleAnswer} />}
      {question.type === 'rewrite' && <RewriteQuestion q={question} onAnswer={handleAnswer} />}

      {answered && question.type !== 'rewrite' && (
        <ExplanationCard
          isCorrect={isCorrect}
          correctSentence={question.correctSentence}
          explanation={question.explanation}
          band7={question.band7}
          onNext={onNext}
          isLast={isLast}
        />
      )}
      {answered && question.type === 'rewrite' && (
        <button
          onClick={onNext}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-2.5 transition-colors"
        >
          {isLast ? 'See Results' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}
