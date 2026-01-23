
export type Subject = 'Psychology' | 'Accounting' | 'General' | 'Professional' | string;
export type ThemeMode = 'pink' | 'rose' | 'orange' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'default';
export type UserRole = 'student' | 'worker';

export interface SourceDocument {
  id: string;
  title: string;
  content: string;
}

export interface ModuleVisibility {
  accounting: boolean;
  psychology: boolean;
  personal: boolean; // Group toggle
  budget: boolean;
  fitness: boolean;
  nutrition: boolean;
  calendar: boolean;
  utilities: boolean;
  emailEditor: boolean;
  docDrafter: boolean;
  studentMode: boolean;
  careerMode: boolean;
  taMode: boolean;
  visionAide: boolean;
  hearingAide: boolean;
  cognitiveAide: boolean;
  dyslexiaMode: boolean;
  colorFilters: boolean;
  screenReaderOpt: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  picture: string;
  isLoggedIn: boolean;
  theme: ThemeMode;
  role: UserRole;
  field: string;
  selectedMajors: string[];
  selectedCareers: string[];
  customTASubject: string;
  taKnowledgeBase: SourceDocument[];
  linkedApps: {
    calendar: boolean;
    keep: boolean;
  };
  moduleVisibility: ModuleVisibility;
  dashboardOrder?: string[];
}

export interface BudgetEntry {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

export interface ExerciseEntry {
  id: string;
  type: string;
  duration: number;
  intensity: 'Low' | 'Moderate' | 'High';
  date: string;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  summary: string;
  flashcards: Flashcard[];
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  description: string;
  type: string;
}

export interface GradingResult {
  score: string;
  feedback: string;
  criteriaMet: string[];
}

export interface KnowledgeStore {
  psychology: {
    lectures: string;
    readings: string;
    textbook: string;
    [key: string]: string;
  };
  accounting: {
    concepts: string;
    rules: string;
    practice: string;
    [key: string]: string;
  };
}
