import React, { useMemo } from 'react';

const REVIEW_KEY = 'feynmanSessionReviews';

const summarizeGaps = (text) => {
  if (!text) return '';
  const cleaned = text.replace(/\s+/g, ' ').trim();
  const sentences = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean);
  return sentences.slice(0, 2).join(' ');
};

const extractNewInfo = (text) => {
  if (!text) return [];
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const bulletRegex = /^(\d+\.)|[-•*]\s+/;
  const bulletLines = lines.filter((line) => bulletRegex.test(line));
  if (bulletLines.length > 0) {
    return bulletLines
      .map((line) => line.replace(bulletRegex, '').trim())
      .filter(Boolean);
  }
  const sentences = text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  return sentences.slice(0, 4);
};

const Review = () => {
  const entries = useMemo(() => {
    try {
      const raw = localStorage.getItem(REVIEW_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('Failed to load review entries', error);
      return [];
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-3">
          Review Your Learning
        </h1>
        <p className="text-lg text-gray-600 dark:text-slate-200">
          Revisit past topics and refresh the gaps you identified.
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="card text-center">
          <p className="text-gray-600 dark:text-slate-300">
            No saved topics yet. Complete a learning session to build your review list.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.values(
            entries.reduce((accumulator, entry) => {
              const existing = accumulator[entry.topic];
              if (!existing || new Date(entry.createdAt) > new Date(existing.createdAt)) {
                accumulator[entry.topic] = entry;
              }
              return accumulator;
            }, {}),
          ).map((entry) => (
            <div key={entry.topic} className="card dark:bg-slate-900 dark:border-slate-800">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">
                  {entry.topic}
                </h2>
                <span className="text-sm text-gray-500 dark:text-slate-400">
                  {new Date(entry.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-600 dark:text-slate-300 mb-3">
                {summarizeGaps(entry.gaps)}
              </p>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
                  New information to review
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-slate-300">
                  {extractNewInfo(entry.gaps).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <details className="text-sm text-gray-600 dark:text-slate-300">
                <summary className="cursor-pointer font-medium text-gray-700 dark:text-slate-200">
                  View full gap notes
                </summary>
                <div className="mt-3 whitespace-pre-line">
                  {entry.gaps}
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Review;
