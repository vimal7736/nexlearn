import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ExamState, Question, Answer, QuestionStatus } from '@/src/types';
import axiosInstance from '../lib/axios';

const initialState: ExamState = {
  questions: [],
  metadata: null,
  answers: {},
  questionStatuses: {},
  currentQuestionIndex: 0,
  timeRemaining: 0,
  isTimerRunning: false,
  loading: false,
  error: null,
};

export const fetchQuestions = createAsyncThunk(
  'exam/fetchQuestions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/question/list');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch questions');
    }
  }
);

export const submitAnswers = createAsyncThunk(
  'exam/submitAnswers',
  async (answers: Answer[], { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('answers', JSON.stringify(answers));

      const response = await axiosInstance.post('/answers/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit answers');
    }
  }
);

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    setAnswer: (
      state,
      action: PayloadAction<{ questionId: number; optionId: number | null }>
    ) => {
      const { questionId, optionId } = action.payload;
      state.answers[questionId] = optionId;
      
      if (!state.questionStatuses[questionId]) {
        state.questionStatuses[questionId] = {
          visited: true,
          answered: false,
          markedForReview: false,
        };
      }
      state.questionStatuses[questionId].answered = optionId !== null;
    },
    
    toggleMarkForReview: (state, action: PayloadAction<number>) => {
      const questionId = action.payload;
      if (!state.questionStatuses[questionId]) {
        state.questionStatuses[questionId] = {
          visited: true,
          answered: false,
          markedForReview: false,
        };
      }
      state.questionStatuses[questionId].markedForReview =
        !state.questionStatuses[questionId].markedForReview;
    },
    
    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
      
      const currentQuestion = state.questions[action.payload];
      // FIXED: Use question_id instead of id
      if (currentQuestion && !state.questionStatuses[currentQuestion.question_id]) {
        state.questionStatuses[currentQuestion.question_id] = {
          visited: true,
          answered: false,
          markedForReview: false,
        };
      } else if (currentQuestion) {
        state.questionStatuses[currentQuestion.question_id].visited = true;
      }
    },
    
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
        
        const currentQuestion = state.questions[state.currentQuestionIndex];
        // FIXED: Use question_id instead of id
        if (currentQuestion && !state.questionStatuses[currentQuestion.question_id]) {
          state.questionStatuses[currentQuestion.question_id] = {
            visited: true,
            answered: false,
            markedForReview: false,
          };
        } else if (currentQuestion) {
          state.questionStatuses[currentQuestion.question_id].visited = true;
        }
      }
    },
    
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
        
        const currentQuestion = state.questions[state.currentQuestionIndex];
        // FIXED: Use question_id instead of id
        if (currentQuestion) {
          if (!state.questionStatuses[currentQuestion.question_id]) {
            state.questionStatuses[currentQuestion.question_id] = {
              visited: true,
              answered: false,
              markedForReview: false,
            };
          } else {
            state.questionStatuses[currentQuestion.question_id].visited = true;
          }
        }
      }
    },
    
    startTimer: (state) => {
      state.isTimerRunning = true;
    },
    
    stopTimer: (state) => {
      state.isTimerRunning = false;
    },
    
    decrementTimer: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      } else {
        state.isTimerRunning = false;
      }
    },
    
    resetExam: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload.questions;
        state.metadata = {
          questions_count: action.payload.questions_count,
          total_marks: action.payload.total_marks,
          total_time: action.payload.total_time,
          time_for_each_question: action.payload.time_for_each_question,
          mark_per_each_answer: action.payload.mark_per_each_answer,
          instruction: action.payload.instruction,
        };
        state.timeRemaining = action.payload.total_time * 60; 
        
        // FIXED: Use question_id instead of id
        if (state.questions.length > 0) {
          state.questionStatuses[state.questions[0].question_id] = {
            visited: true,
            answered: false,
            markedForReview: false,
          };
        }
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(submitAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitAnswers.fulfilled, (state) => {
        state.loading = false;
        state.isTimerRunning = false;
      })
      .addCase(submitAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setAnswer,
  toggleMarkForReview,
  setCurrentQuestionIndex,
  nextQuestion,
  previousQuestion,
  startTimer,
  stopTimer,
  decrementTimer,
  resetExam,
} = examSlice.actions;

export default examSlice.reducer;