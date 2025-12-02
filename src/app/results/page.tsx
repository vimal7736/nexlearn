'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { clearResult } from '@/src/store/resultSlice';
import { resetExam } from '@/src/store/examSlice';

export default function ResultsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { result, loading, error } = useSelector((state: any) => state.result);

  useEffect(() => {
    if (!loading && !result) {
      router.push('/instructions');
    }
  }, [result, loading, router]);

  const handleDone = () => {
    dispatch(clearResult());
    dispatch(resetExam());
    router.push('/instructions');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-600 text-sm">Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4 text-sm">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const totalQuestions = result.correct + result.wrong + result.not_attended;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center  px-4 py-1 sm:py-8">
        <div className="w-full max-w-md">
          
          <div className="bg-gradient-to-br from-[#2c6b7f] to-[#1e5164] rounded-2xl sm:rounded-3xl px-6 sm:px-8 py-4 sm:py-5 text-center shadow-xl mb-3 sm:mb-4">
            <p className="text-white text-xs sm:text-sm font-medium mb-1 sm:mb-2 opacity-90">
              Marks Obtained:
            </p>
            <p className="text-white text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              {result.score} / {totalQuestions}
            </p>
          </div>

          <div className="space-y-2">
            
            <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-gray-800 font-medium text-xs sm:text-sm">Total Questions:</span>
              </div>
              <span className="text-gray-900 font-bold text-sm sm:text-base">{totalQuestions}</span>
            </div>

            <div className="flex items-center justify-between rounded-xl px-3 sm:px-4 py-2 sm:py-2.5">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-gray-800 font-medium text-xs sm:text-sm">Correct Answers:</span>
              </div>
              <span className="text-gray-900 font-bold text-sm sm:text-base">{result.correct.toString().padStart(3, '0')}</span>
            </div>

            <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-gray-800 font-medium text-xs sm:text-sm">Incorrect Answers:</span>
              </div>
              <span className="text-gray-900 font-bold text-sm sm:text-base">{result.wrong.toString().padStart(3, '0')}</span>
            </div>

            {/* Not Attended */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-gray-800 font-medium text-xs sm:text-sm">Not Attended Questions:</span>
              </div>
              <span className="text-gray-900 font-bold text-sm sm:text-base">{result.not_attended.toString().padStart(3, '0')}</span>
            </div>

          </div>

          <button
            onClick={handleDone}
            className="w-full mt-3 sm:mt-4 py-2 sm:py-2.5 bg-[#2c3e50] text-white rounded-xl hover:bg-[#1a252f] transition-colors font-semibold text-sm sm:text-base shadow-md"
          >
            Done
          </button>

        </div>
      </div>
    </div>
  );
}