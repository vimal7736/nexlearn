'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/src/store';
import {
  fetchQuestions,
  submitAnswers,
  setAnswer,
  toggleMarkForReview,
  setCurrentQuestionIndex,
  nextQuestion,
  previousQuestion,
  startTimer,
  decrementTimer,
} from '@/src/store/examSlice';

import Modal from '@/src/components/ui/Modal';
import { Clock, FileCheck, AlertCircle, Timer, Menu, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@/src/context/ToastContext';
import LoadingScreen from '@/src/components/common/LoadingScreen';

export default function ExamPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { showToast } = useToast();
  const {
    questions,
    answers,
    questionStatuses,
    currentQuestionIndex,
    timeRemaining,
    isTimerRunning,
    loading,
    error,
  } = useSelector((state: RootState) => state.exam);

  const [toasts, setToasts] = useState<
    { id: string; message: string; type: 'success' | 'error' | 'info' }[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showQuestionSheet, setShowQuestionSheet] = useState(false);

  const fallbackImage = {
    src: '/que_image.png',
    alt: 'question',
  };

  useEffect(() => {
    dispatch(fetchQuestions())
      .unwrap()
      .then(() => {
        dispatch(startTimer());
      })
      .catch((err) => {
        showToast('Failed to load questions. Please try again.', 'error');
        router.push('/');
      });
  }, [dispatch]);

  useEffect(() => {
    if (!isTimerRunning || loading) return;

    if (timeRemaining <= 0) {
      handleSubmitClick();
      return;
    }

    const timer = setInterval(() => {
      dispatch(decrementTimer());
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isTimerRunning, loading, dispatch]);

  const openComprehensiveModal = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const currentComprehension = currentQuestion?.comprehension;

    if (!currentComprehension || currentComprehension.trim() === '') {
      showToast('No comprehensive paragraph available for this question.', 'info');
      return;
    }

    setModalContent(currentComprehension);
    setShowModal(true);
  };

  const handleSelectOption = (optionId: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    dispatch(
      setAnswer({
        questionId: currentQuestion.question_id,
        optionId,
      })
    );
  };

  const handleMarkForReview = () => {
    const currentQuestion = questions[currentQuestionIndex];
    dispatch(toggleMarkForReview(currentQuestion.question_id));
  };

  const goToQuestion = (index: number) => {
    dispatch(setCurrentQuestionIndex(index));
    setShowQuestionSheet(false);
  };

  const handleSubmitClick = () => {
    setShowSubmitModal(true);
  };

  const confirmSubmit = async () => {
    try {
      const formattedAnswers = questions.map((q) => ({
        question_id: q.question_id,
        selected_option_id: answers[q.question_id] ?? null,
      }));

      const result = await dispatch(submitAnswers(formattedAnswers)).unwrap();
      sessionStorage.setItem('examResults', JSON.stringify(result));
      router.push('/results');
    } catch (err: any) {
      console.error('Submit error:', err);
      setShowSubmitModal(false);
      showToast('Failed to submit exam. Please try again.', 'error');
    }
  };

  const getAnswerStats = () => {
    let answered = 0;
    let markedForReview = 0;

    questions.forEach((q) => {
      const status = questionStatuses[q.question_id];
      if (status?.answered) answered++;
      if (status?.markedForReview) markedForReview++;
    });

    return { answered, markedForReview };
  };

  const getQuestionStatus = (questionId: number): string => {
    const status = questionStatuses[questionId];
    const hasAnswer = answers[questionId] !== undefined && answers[questionId] !== null;

    if (!status?.visited) return 'not_visited';

    if (hasAnswer && status.markedForReview) return 'answered_and_review';

    if (status.markedForReview) return 'review';

    if (hasAnswer) return 'answered';

    if (status.visited) return 'not_answered';

    return 'not_visited';
  };

  const getStatusColor = (questionId: number, isCurrent: boolean) => {
    const status = getQuestionStatus(questionId);

    if (isCurrent) {
      switch (status) {
        case 'answered':
          return 'bg-green-600 text-white ring-2 ring-green-600 ring-offset-2';
        case 'not_answered':
          return 'bg-red-700 text-white ring-2 ring-red-700 ring-offset-2';
        case 'review':
          return 'bg-[#800080] text-white ring-2 ring-[#800080] ring-offset-2';
        case 'answered_and_review':
          return 'bg-[#800080] text-white ring-2 ring-[#800080] ring-offset-2';
        default:
          return 'bg-white text-gray-800 ring-2 ring-gray-400 ring-offset-2';
      }
    }

    switch (status) {
      case 'answered':
        return 'bg-green-600 text-white';
      case 'not_answered':
        return 'bg-red-700 text-white';
      case 'review':
        return 'bg-purple-600 text-white';
      case 'answered_and_review':
        return 'bg-purple-800 text-white';
      default:
        return 'bg-white text-gray-800 border border-gray-300';
    }
  };

  if (loading) return <div className="p-10"><LoadingScreen /></div>;
  if (error) return <div className="p-10 text-red-600">Error: {error}</div>;
  if (questions.length === 0) return <div className="p-10">No questions available</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const stats = getAnswerStats();
  const currentAnswer = answers[currentQuestion.question_id];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header with Timer and Menu */}
      <div className="lg:hidden sticky top-0 z-50 bg-[#f4fcff] border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h2 className="text-xs sm:text-sm text-gray-900 font-medium">Ancient Indian History MCQ</h2>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 bg-gray-900 text-white px-2 py-1 rounded-full">
            <Timer className="w-3 h-3" />
            <span className="text-[10px] font-semibold">
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <button
            onClick={() => setShowQuestionSheet(!showQuestionSheet)}
            className="p-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors"
          >
            {showQuestionSheet ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Question Sheet Overlay */}
      {showQuestionSheet && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowQuestionSheet(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-900">Question No. Sheet</h3>
                <button onClick={() => setShowQuestionSheet(false)} className="p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 mb-4">
                {questions.map((q, i) => {
                  const isCurrent = i === currentQuestionIndex;
                  return (
                    <button
                      key={i}
                      onClick={() => goToQuestion(i)}
                      className={`aspect-square rounded text-xs font-semibold transition-all ${getStatusColor(
                        q.question_id,
                        isCurrent
                      )}`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-600 rounded flex-shrink-0"></div>
                  <span className="text-gray-800">Attended</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-red-700 rounded flex-shrink-0"></div>
                  <span className="text-gray-800">Not Attended</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#800080] rounded flex-shrink-0"></div>
                  <span className="text-gray-800">Mark for Review</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-800 rounded flex-shrink-0"></div>
                  <span className="text-gray-800">Ans + Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-2 sm:p-4 bg-[#f4fcff]">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* LEFT SECTION - Main Content */}
          <div className="flex-1">
            <h2 className="hidden lg:block text-sm text-gray-900 mb-2">Ancient Indian History MCQ</h2>

            <div className="bg-white p-3 sm:p-4 rounded shadow-sm mb-4">
              <div className="py-1">
                <button
                  onClick={openComprehensiveModal}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#177a9c] text-white px-3 sm:px-4 py-2 rounded hover:bg-teal-800 transition-colors text-xs font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                  </svg>
                  <span className="hidden sm:inline">Read Comprehensive Paragraph</span>
                  <span className="sm:hidden">Read Paragraph</span>
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Comprehensive Paragraph"
                size="xl"
              >
                <p className="text-gray-700 text-xs sm:text-sm">
                  {modalContent || 'No comprehensive paragraph available.'}
                </p>
              </Modal>

              <Modal
                isOpen={showSubmitModal}
                onClose={() => setShowSubmitModal(false)}
                title="Are you sure you want to submit the test?"
                size="md"
                 showCloseButton={true}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">Remaining Time:</span>
                    </div>
                    <span className="text-gray-900 font-bold text-lg">
                      {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileCheck className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">Total Questions:</span>
                    </div>
                    <span className="text-gray-900 font-bold text-lg">{questions.length}</span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileCheck className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">Questions Answered:</span>
                    </div>
                    <span className="text-gray-900 font-bold text-lg">{stats.answered.toString().padStart(3, '0')}</span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">Marked for review:</span>
                    </div>
                    <span className="text-gray-900 font-bold text-lg">{stats.markedForReview.toString().padStart(3, '0')}</span>
                  </div>

                  <button
                    onClick={confirmSubmit}
                    className="w-full mt-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors font-medium"
                  >
                    Submit Test
                  </button>
                </div>
              </Modal>
              <h3 className="text-xs sm:text-sm font-normal text-gray-900 mb-1 mt-2 leading-relaxed">
                {currentQuestionIndex + 1}. {currentQuestion.question}
              </h3>

              <div className="px-0 sm:px-2">
                <img
                  src={currentQuestion.image || fallbackImage.src}
                  className="rounded w-full max-w-full sm:max-w-[260px] h-auto"
                  alt="Question illustration"
                />
              </div>
            </div>

            <div className="mb-2">
              <p className="text-xs text-gray-600 mb-2">Choose the answer:</p>

              <div className="space-y-2">
                {currentQuestion.options.map((opt: any, idx: number) => {
                  const isSelected = currentAnswer === opt.id;

                  return (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-lg border border-gray-200 cursor-pointer transition-colors bg-white 
                      ${isSelected ? 'bg-gray-50 border-teal-500' : 'hover:bg-gray-50'}`}
                    >
                      <div className='flex justify-between w-full items-center'>
                        <div className='flex gap-2 flex-1 min-w-0'>
                          <span className="font-semibold text-gray-900 text-xs flex-shrink-0">
                            {String.fromCharCode(65 + idx)}.
                          </span>

                          <span className="text-gray-900 text-xs break-words">{opt.option}</span>
                        </div>

                        <input
                          type="radio"
                          checked={isSelected}
                          onChange={() => handleSelectOption(opt.id)}
                          className="w-4 h-4 cursor-pointer flex-shrink-0 ml-2"
                          style={{
                            accentColor: isSelected ? '#0f766e' : '#d1d5db',
                          }}
                        />
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="py-1">
              <div className="flex gap-2">
                <button
                  onClick={handleMarkForReview}
                  className="flex-1 py-2 bg-[#800080] text-white rounded hover:bg-purple-800 transition-colors font-medium text-xs"
                >
                  Mark for review
                </button>

                {currentQuestionIndex > 0 && (
                  <button
                    onClick={() => dispatch(previousQuestion())}
                    className="flex-1 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors font-medium text-xs"
                  >
                    Previous
                  </button>
                )}

                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    onClick={() => dispatch(nextQuestion())}
                    className="flex-1 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors font-medium text-xs"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitClick}
                    className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-medium text-xs"
                  >
                    Submit Exam
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SECTION - Desktop Only */}
          <div className="hidden lg:block w-[420px] border-l border-gray-200">
            <div className="px-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs text-gray-900">Question No. Sheet:</h3>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-700">Remaining:</span>

                  <div className="flex items-center gap-1 bg-gray-900 text-white px-2 py-1 rounded-full">
                    <Timer className="w-3 h-3" />
                    <span className="text-[10px] font-semibold">
                      {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-10 gap-1.5 mb-4">
                {questions.map((q, i) => {
                  const isCurrent = i === currentQuestionIndex;
                  return (
                    <button
                      key={i}
                      onClick={() => goToQuestion(i)}
                      className={`aspect-square rounded text-[10px] font-semibold transition-all ${getStatusColor(
                        q.question_id,
                        isCurrent
                      )}`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-4 gap-x-1 gap-y-2 text-[9px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-green-600 rounded flex-shrink-0"></div>
                  <span className="text-gray-800">Attended</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-red-700 rounded flex-shrink-0"></div>
                  <span className="text-gray-800">Not Attended</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-[#800080] rounded flex-shrink-0"></div>
                  <span className="text-gray-800">Mark for Review</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-green-800 rounded flex-shrink-0"></div>
                  <span className="text-gray-800 leading-none">Ans + Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}