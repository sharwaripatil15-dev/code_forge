export type StepId = 'input' | 'search' | 'gapmap' | 'devils' | 'blueprint' | 'mentor';

export interface IdeaInputData {
  idea: string;
  category?: string;
  targetUser?: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  summary: string;
  url: string;
  publishedDate: string;
  citationsCount: number;
  relevanceScore: number;
  approachFamily: string;
}

export interface GitHubRepo {
  id: string;
  name: string;
  fullName: string;
  description: string;
  stars: number;
  url: string;
  primaryLanguage: string;
  approachFamily: string;
}

export interface WebInsight {
  id: string;
  title: string;
  snippet: string;
  url: string;
  source: string;
  approachFamily: string;
}

export interface ApproachCluster {
  id: string;
  name: string;
  color: string; // Tailwind hex color
  description: string;
  itemCount: number;
  dominantTrend: string;
}

export interface GapMetrics {
  noveltyScore: number;
  feasibilityScore: number;
  technicalComplexity: number;
  marketImpact: number;
  executionSpeed: number;
  whiteSpaceTitle: string;
  whiteSpaceDescription: string;
  keyInnovations: string[];
}

export interface GapNode {
  id: string;
  label: string;
  clusterId: string;
  type: 'paper' | 'repo' | 'web' | 'opportunity';
  url?: string;
  description: string;
  starsOrCitations?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface DevilsAdvocateQuestion {
  id: string;
  question: string;
  focusArea: 'Uniqueness' | 'Feasibility Risk' | 'Existing Overlap' | 'Scalability';
  context: string;
  suggestedAnswer: string;
  userAnswer?: string;
  aiEvaluation?: string;
  impactOnScore?: number;
}

export interface ArchitectureNode {
  id: string;
  title: string;
  category: 'Frontend' | 'Backend / LLM' | 'Storage / Vector' | 'Integration / Agent';
  tech: string;
  description: string;
}

export interface TechStackRecommendation {
  category: string;
  chosen: string;
  rationale: string;
  alternatives: string[];
}

export interface RecommendedApiOrDataset {
  name: string;
  type: 'Third-Party API' | 'Public Dataset' | 'SDK / Library' | 'Protocol Standard';
  description: string;
  useCase: string;
  accessUrl: string;
  licenseOrTier: string;
}

export interface ProjectMilestone {
  week: number;
  title: string;
  duration: string;
  actionableSteps: string[];
  deliverables: string[];
  potentialRisk: string;
}

export interface ProjectTimeline {
  totalEstimatedWeeks: number;
  totalEstimatedHours: number;
  criticalPath: string;
  phases: { phaseName: string; duration: string; goal: string }[];
}

export interface ScaffoldFile {
  filePath: string;
  description: string;
  content: string;
}

export interface ProjectBlueprint {
  title: string;
  tagline: string;
  executiveSummary: string;
  problemStatement: string;
  uniqueValueProposition: string;
  architectureNodes: ArchitectureNode[];
  techStack: TechStackRecommendation[];
  apisAndDatasets: RecommendedApiOrDataset[];
  timeline: ProjectTimeline;
  milestones: ProjectMilestone[];
  scaffoldFiles: ScaffoldFile[];
  telegramMentorPrompt: string;
}

export interface PatentRecord {
  id: string;
  patentNumber: string;
  title: string;
  abstract: string;
  assignee: string;
  url: string;
  publicationDate: string;
  relevanceScore: number;
}

export interface DeepSearchState {
  input: IdeaInputData;
  papers: ResearchPaper[];
  repos: GitHubRepo[];
  patents: PatentRecord[];
  webInsights: WebInsight[];
  clusters: ApproachCluster[];
  metrics: GapMetrics;
  nodes: GapNode[];
  devilsQuestions: DevilsAdvocateQuestion[];
  blueprint: ProjectBlueprint;
  isLive: boolean;
}

export interface ApiKeys {
  geminiKey?: string;
  githubToken?: string;
  tavilyKey?: string;
  telegramBotToken?: string;
  telegramChatId?: string;
}

