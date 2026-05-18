export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  isPrivate: boolean;
  updatedAt: string;
  defaultBranch: string;
}

export interface Deployment {
  id: string;
  repoId: string;
  repoName: string;
  branch: string;
  commit: string;
  commitMessage: string;
  status: 'building' | 'success' | 'failed' | 'cancelled';
  environment: 'production' | 'staging' | 'preview';
  url: string;
  duration: number;
  createdAt: string;
  buildLog: string[];
}

export interface Domain {
  id: string;
  name: string;
  verified: boolean;
  target: string;
  addedAt: string;
}

export interface EnvVar {
  key: string;
  value: string;
  environment: 'all' | 'production' | 'staging' | 'preview';
  isSecret: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  avatar: string;
  joinedAt: string;
}

export interface DeploySettings {
  buildCommand: string;
  outputDirectory: string;
  frameworkPreset: string;
  nodeVersion: string;
  rootDirectory: string;
}

export interface Analytics {
  visits: number[];
  bandwidth: number[];
  dates: string[];
}
