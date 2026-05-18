import type { Repository, Deployment, Domain, EnvVar, TeamMember, Analytics } from '../types';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

const frameworks = ['Next.js', 'React', 'Vue', 'Svelte', 'Astro', 'Nuxt', 'Remix'];
const languages = ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust'];
const statuses: Deployment['status'][] = ['success', 'success', 'success', 'building', 'failed'];
const envs: Deployment['environment'][] = ['production', 'staging', 'preview'];

const commitMessages = [
  'feat: add user authentication flow',
  'fix: resolve CORS issue on API routes',
  'chore: update dependencies',
  'feat: implement dark mode toggle',
  'fix: mobile responsive layout',
  'docs: update README with setup guide',
  'feat: add search functionality',
  'refactor: extract shared components',
  'fix: memory leak in useEffect',
  'feat: add export to CSV feature',
  'chore: bump version to 2.1.0',
  'fix: timezone handling in date picker',
];

const buildLogLines = [
  'Cloning repository...',
  'Installing dependencies...',
  'Running build command...',
  'Compiling TypeScript...',
  'Bundling assets...',
  'Optimizing images...',
  'Generating static pages...',
  'Build completed successfully.',
];

export function generateRepos(count: number = 8): Repository[] {
  const names = ['portfolio', 'blog-app', 'dashboard-ui', 'api-server', 'landing-page', 'ecommerce-store', 'chat-app', 'analytics-tool', 'docs-site', 'mobile-app'];
  return names.slice(0, count).map((name, i) => ({
    id: generateId(),
    name,
    fullName: `febrits/${name}`,
    description: `A ${frameworks[i % frameworks.length]} project for ${name.replace('-', ' ')}`,
    language: languages[i % languages.length],
    stars: Math.floor(Math.random() * 50),
    isPrivate: Math.random() > 0.7,
    updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    defaultBranch: 'main',
  }));
}

export function generateDeployments(repos: Repository[], count: number = 15): Deployment[] {
  return Array.from({ length: count }, (_, i) => {
    const repo = repos[i % repos.length];
    const status = statuses[i % statuses.length];
    const env = envs[i % envs.length];
    const created = new Date(Date.now() - i * 2 * 60 * 60 * 1000);
    return {
      id: generateId(),
      repoId: repo.id,
      repoName: repo.name,
      branch: repo.defaultBranch,
      commit: Math.random().toString(36).substr(2, 40),
      commitMessage: commitMessages[i % commitMessages.length],
      status,
      environment: env,
      url: `${repo.name}-${env}.vercel.app`,
      duration: status === 'building' ? 0 : Math.floor(Math.random() * 120) + 15,
      createdAt: created.toISOString(),
      buildLog: status === 'building' ? buildLogLines.slice(0, 3) : buildLogLines,
    };
  });
}

export function generateDomains(): Domain[] {
  return [
    { id: generateId(), name: 'febrits.dev', verified: true, target: 'portfolio-bangpeb.vercel.app', addedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
    { id: generateId(), name: 'www.febrits.dev', verified: true, target: 'febrits.dev', addedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString() },
    { id: generateId(), name: 'staging.febrits.dev', verified: false, target: 'staging.vercel.app', addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  ];
}

export function generateEnvVars(): EnvVar[] {
  return [
    { key: 'NEXT_PUBLIC_API_URL', value: 'https://api.example.com', environment: 'all', isSecret: false },
    { key: 'DATABASE_URL', value: 'postgresql://user:***@db.example.com:5432/mydb', environment: 'production', isSecret: true },
    { key: 'JWT_SECRET', value: 'super-secret-key-hidden', environment: 'all', isSecret: true },
    { key: 'STRIPE_KEY', value: 'pk_live_***', environment: 'production', isSecret: true },
    { key: 'ANALYTICS_ID', value: 'UA-XXXXX-Y', environment: 'production', isSecret: false },
    { key: 'STAGING_API_URL', value: 'https://staging-api.example.com', environment: 'staging', isSecret: false },
  ];
}

export function generateTeam(): TeamMember[] {
  return [
    { id: generateId(), name: 'Febri', email: 'febri@example.com', role: 'owner', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Febri', joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() },
    { id: generateId(), name: 'Ahmad', email: 'ahmad@example.com', role: 'admin', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Ahmad', joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() },
    { id: generateId(), name: 'Sarah', email: 'sarah@example.com', role: 'member', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Sarah', joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
  ];
}

export function generateAnalytics(): Analytics {
  const dates: string[] = [];
  const visits: number[] = [];
  const bandwidth: number[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    dates.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    visits.push(Math.floor(Math.random() * 500) + 100);
    bandwidth.push(Math.floor(Math.random() * 2000) + 500);
  }
  return { dates, visits, bandwidth };
}
