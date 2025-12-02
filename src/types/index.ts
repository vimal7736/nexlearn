export interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  qualification: string;
  profile_image: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AuthState {
  user: User | null;
  tokens: Tokens | null;
  mobile: string;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface Option {
  id: number;
  option_text: string;
  question_id: number;
}

export interface Question {
  id: number;
  question_text: string;
  question_image: string | null;
  comprehension_paragraph: string | null;
   question_id: number;
  question: string;
  image: string | null;
  comprehension: string | null;
  options: Option[];
}

export interface ExamMetadata {
  questions_count: number;
  total_marks: number;
  total_time: number;
  time_for_each_question: number;
  mark_per_each_answer: number;
  instruction: string;
}

export interface Answer {
  question_id: number;
  selected_option_id: number | null;
}

export interface QuestionStatus {
  visited: boolean;
  answered: boolean;
  markedForReview: boolean;
}

export interface ExamState {
  questions: Question[];
  metadata: ExamMetadata | null;
  answers: Record<number, number | null>; 
  questionStatuses: Record<number, QuestionStatus>;
  currentQuestionIndex: number;
  timeRemaining: number; 
  isTimerRunning: boolean;
  loading: boolean;
  error: string | null;
}

export interface ExamResult {
  exam_history_id: string;
  score: number;
  correct: number;
  wrong: number;
  not_attended: number;
  submitted_at: string;
  details: Array<{
    question_id: number;
    is_correct: boolean;
    selected_option_id: number | null;
    correct_option_id: number;
  }>;
}

export interface ResultState {
  result: ExamResult | null;
  loading: boolean;
  error: string | null;
}