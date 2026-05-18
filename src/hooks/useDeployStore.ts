import { useState, useCallback, useEffect } from 'react';
import type { Repository, Deployment, Domain, EnvVar, TeamMember, DeploySettings, Analytics } from '../types';
import { generateRepos, generateDeployments, generateDomains, generateEnvVars, generateTeam, generateAnalytics } from '../lib/mockData';

const STORAGE_KEY = 'deploybot_data';

interface StoredData {
  repos: Repository[];
  deployments: Deployment[];
  domains: Domain[];
  envVars: EnvVar[];
  team: TeamMember[];
  settings: DeploySettings;
}

function load(): StoredData {
  try {
    const d = localStorage.getItem(STORAGE_KEY);
    if (d) return JSON.parse(d);
  } catch { /* ignore */ }
  const repos = generateRepos();
  const data: StoredData = {
    repos,
    deployments: generateDeployments(repos),
    domains: generateDomains(),
    envVars: generateEnvVars(),
    team: generateTeam(),
    settings: {
      buildCommand: 'npm run build',
      outputDirectory: 'dist',
      frameworkPreset: 'vite',
      nodeVersion: '20.x',
      rootDirectory: '/',
    },
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function save(data: StoredData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useDeployStore() {
  const [data, setData] = useState<StoredData>(load);
  const [analytics] = useState<Analytics>(generateAnalytics);
  const [selectedRepoId, setSelectedRepoId] = useState<string | null>(null);

  useEffect(() => { save(data); }, [data]);

  const selectedRepo = data.repos.find(r => r.id === selectedRepoId) || null;

  const deploy = useCallback((repoId: string, environment: Deployment['environment'] = 'production') => {
    const repo = data.repos.find(r => r.id === repoId);
    if (!repo) return;

    const newDeploy: Deployment = {
      id: Math.random().toString(36).substr(2, 9),
      repoId,
      repoName: repo.name,
      branch: repo.defaultBranch,
      commit: Math.random().toString(36).substr(2, 40),
      commitMessage: 'Manual deploy from DeployBot',
      status: 'building',
      environment,
      url: `${repo.name}-${environment}.vercel.app`,
      duration: 0,
      createdAt: new Date().toISOString(),
      buildLog: ['Starting deployment...'],
    };

    setData(prev => ({ ...prev, deployments: [newDeploy, ...prev.deployments] }));

    // Simulate build progress
    let step = 0;
    const steps = [
      'Cloning repository...',
      'Installing dependencies...',
      'Running build command...',
      'Compiling TypeScript...',
      'Bundling assets...',
      'Optimizing...',
      'Deployment complete.',
    ];

    const interval = setInterval(() => {
      step++;
      if (step < steps.length) {
        setData(prev => ({
          ...prev,
          deployments: prev.deployments.map(d =>
            d.id === newDeploy.id
              ? { ...d, buildLog: [...d.buildLog, steps[step]] }
              : d
          ),
        }));
      } else {
        clearInterval(interval);
        const success = Math.random() > 0.15;
        setData(prev => ({
          ...prev,
          deployments: prev.deployments.map(d =>
            d.id === newDeploy.id
              ? { ...d, status: success ? 'success' : 'failed' as const, duration: Math.floor(Math.random() * 90) + 20 }
              : d
          ),
        }));
      }
    }, 1500);
  }, [data.repos]);

  const rollback = useCallback((deployId: string) => {
    setData(prev => ({
      ...prev,
      deployments: prev.deployments.map(d =>
        d.id === deployId ? { ...d, status: 'success' as const } : d
      ),
    }));
  }, []);

  const cancelDeploy = useCallback((deployId: string) => {
    setData(prev => ({
      ...prev,
      deployments: prev.deployments.map(d =>
        d.id === deployId ? { ...d, status: 'cancelled' as const } : d
      ),
    }));
  }, []);

  const addDomain = useCallback((name: string, target: string) => {
    const domain: Domain = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      verified: false,
      target,
      addedAt: new Date().toISOString(),
    };
    setData(prev => ({ ...prev, domains: [...prev.domains, domain] }));
  }, []);

  const removeDomain = useCallback((id: string) => {
    setData(prev => ({ ...prev, domains: prev.domains.filter(d => d.id !== id) }));
  }, []);

  const verifyDomain = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      domains: prev.domains.map(d => d.id === id ? { ...d, verified: true } : d),
    }));
  }, []);

  const addEnvVar = useCallback((envVar: EnvVar) => {
    setData(prev => ({ ...prev, envVars: [...prev.envVars, envVar] }));
  }, []);

  const removeEnvVar = useCallback((key: string) => {
    setData(prev => ({ ...prev, envVars: prev.envVars.filter(e => e.key !== key) }));
  }, []);

  const updateSettings = useCallback((updates: Partial<DeploySettings>) => {
    setData(prev => ({ ...prev, settings: { ...prev.settings, ...updates } }));
  }, []);

  return {
    repos: data.repos,
    deployments: data.deployments,
    domains: data.domains,
    envVars: data.envVars,
    team: data.team,
    settings: data.settings,
    analytics,
    selectedRepo,
    selectedRepoId,
    setSelectedRepoId,
    deploy,
    rollback,
    cancelDeploy,
    addDomain,
    removeDomain,
    verifyDomain,
    addEnvVar,
    removeEnvVar,
    updateSettings,
  };
}
