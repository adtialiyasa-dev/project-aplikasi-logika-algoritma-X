export type NavigationTab = 
  | 'dashboard' 
  | 'modules' 
  | 'visualizer' 
  | 'codelab' 
  | 'quiz' 
  | 'projects' 
  | 'teacher';

export type QuestionCategory = 
  | 'konsep' 
  | 'penerapan' 
  | 'analisis' 
  | 'debugging' 
  | 'hots';

export interface QuizQuestion {
  id: number;
  category: QuestionCategory;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  indicator: string;
  topic: string;
  question: string;
  codeSnippet?: string;
  options: [string, string, string, string, string]; // A, B, C, D, E
  correctIndex: number; // 0 for A, 1 for B, 2 for C, 3 for D, 4 for E
  explanation: string;
  whyCorrect: string;
  distractorExplanations: [string, string, string, string]; // Explanation for the 4 wrong options
}

export interface LearningModule {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  duration: string; // e.g. "2 JP (90 Menit)"
  description: string;
  objectives: string[];
  keyTerms: string[];
  sections: {
    title: string;
    content: string; // Markdown or rich text
    codeExample?: string;
    flowchartId?: string;
    interactiveType?: 'pilar_ct' | 'trace_demo' | 'flowchart_compare' | 'syntax_anatomy';
  }[];
  realWorldCases: {
    title: string;
    problem: string;
    algorithmSteps: string[];
    expectedResult: string;
    logicalExplanation: string;
  }[];
  mindfulReflection: {
    question: string;
    promptText: string;
  };
}

export interface LabExercise {
  id: string;
  title: string;
  difficulty: 'Dasar' | 'Menengah' | 'Lanjutan';
  category: 'Sekuensial' | 'Percabangan' | 'Perulangan' | 'Kombinasi';
  description: string;
  inputSpecification: string;
  outputSpecification: string;
  initialCode: string;
  solutionCode: string;
  sampleInput: string;
  sampleOutput: string;
  hint: string;
  testCases: {
    input: string;
    expectedOutput: string;
    description: string;
  }[];
}

export interface FlowchartNode {
  id: string;
  type: 'terminator' | 'process' | 'io' | 'decision' | 'connector';
  label: string;
  description: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  nextTrue?: string;
  nextFalse?: string;
  next?: string;
}

export interface FlowchartDiagram {
  id: string;
  title: string;
  description: string;
  problem: string;
  pseudocode: string;
  cppCode: string;
  nodes: FlowchartNode[];
}

export interface CapstoneProject {
  id: string;
  title: string;
  description: string;
  objective: string;
  inputOutputRequirements: string[];
  algorithmSteps: string[];
  pseudocode: string;
  flowchartSummary: string;
  referenceCppCode: string;
  testScenarios: {
    scenario: string;
    input: string;
    expectedOutput: string;
  }[];
  rubric: {
    criteria: string;
    weight: number;
    description: string;
    levelExcellent: string;
    levelGood: string;
    levelDeveloping: string;
  }[];
}

export interface Badge {
  id: string;
  name: string;
  category: 'modul' | 'lab' | 'kuis' | 'eksplorasi';
  description: string;
  iconName: string;
  requirement: string;
  pointsReward: number;
  unlockedAt?: string;
}

export interface UserProgress {
  totalPoints: number;
  completedModules: string[];
  completedExercises: string[];
  quizBestScore: number;
  quizScores: Record<string, number>;
  reflections: Record<string, string>;
  projectNotes: Record<string, string>;
  capstoneCodeAnswers?: Record<string, string>;
  projectStatus?: 'Belum Mulai' | 'Dalam Proses' | 'Selesai';
  selectedProject?: string;
  unlockedBadges: string[];
  lastPointsEarned?: { amount: number; reason: string; timestamp: number };
  lastBadgeEarned?: Badge;
}
