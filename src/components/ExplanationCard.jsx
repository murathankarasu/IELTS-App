export default function ExplanationCard({ isCorrect, correctSentence, explanation, band7, onNext, isLast }) {
  return (
    <div className={`rounded-2xl border-2 p-5 mt-4 ${isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
        <span className={`font-semibold text-lg ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
          {isCorrect ? 'Correct!' : 'Not quite — let\'s learn from this'}
        </span>
      </div>

      {correctSentence && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Correct Version</p>
          <p className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium italic">
            "{correctSentence}"
          </p>
        </div>
      )}

      {explanation && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Explanation</p>
          <p className="text-slate-700 text-sm leading-relaxed">{explanation}</p>
        </div>
      )}

      {band7 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-1">Band 7 Alternative</p>
          <p className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-blue-800 text-sm italic">
            "{band7}"
          </p>
        </div>
      )}

      <button
        onClick={onNext}
        className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-2.5 transition-colors"
      >
        {isLast ? 'See Results' : 'Next Question →'}
      </button>
    </div>
  );
}
