import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch, Rocket, Globe, Settings, Clock, CheckCircle2, XCircle, Eye, ChevronRight, ExternalLink, RotateCcw, Plus, Trash2, Server, Activity, Zap, RefreshCw,
} from 'lucide-react';

interface Deployment {
  id: string;
  repo: string;
  branch: string;
  status: 'success' | 'failed' | 'building' | 'queued';
  url: string;
  commit: string;
  message: string;
  duration: string;
  time: string;
  environment: 'production' | 'preview' | 'development';
}

interface Repo {
  id: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  updated: string;
  connected: boolean;
}

const MOCK_REPOS: Repo[] = [
  { id: '1', name: 'febrits/taskflow', description: 'Kanban project management app', language: 'TypeScript', stars: 12, updated: '2 hours ago', connected: true },
  { id: '2', name: 'febrits/devblog', description: 'Full-featured blog platform', language: 'TypeScript', stars: 8, updated: '5 hours ago', connected: true },
  { id: '3', name: 'febrits/filevault', description: 'File manager with drag-drop', language: 'TypeScript', stars: 5, updated: '1 day ago', connected: false },
  { id: '4', name: 'febrits/apiforge', description: 'REST API builder', language: 'TypeScript', stars: 3, updated: '1 day ago', connected: false },
  { id: '5', name: 'febrits/datalens', description: 'Data visualization dashboard', language: 'TypeScript', stars: 2, updated: '2 days ago', connected: false },
  { id: '6', name: 'febrits/authkit', description: 'Authentication service', language: 'TypeScript', stars: 1, updated: '3 days ago', connected: false },
];

const MOCK_DEPLOYMENTS: Deployment[] = [
  { id: '1', repo: 'febrits/taskflow', branch: 'main', status: 'success', url: 'https://taskflow-bangpeb.vercel.app', commit: 'a3f8c2d', message: 'feat: add drag-drop columns', duration: '45s', time: '2 hours ago', environment: 'production' },
  { id: '2', repo: 'febrits/devblog', branch: 'main', status: 'success', url: 'https://devblog-bangpeb.vercel.app', commit: 'b7e1f4a', message: 'fix: search pagination', duration: '38s', time: '5 hours ago', environment: 'production' },
  { id: '3', repo: 'febrits/taskflow', branch: 'feature/auth', status: 'building', url: 'https://taskflow-git-feature-auth-bangpeb.vercel.app', commit: 'c9d2e5b', message: 'feat: add OAuth login', duration: '23s', time: 'Just now', environment: 'preview' },
  { id: '4', repo: 'febrits/snapurl', branch: 'main', status: 'failed', url: 'https://snapurl-five.vercel.app', commit: 'd4f6a8c', message: 'fix: analytics tracking', duration: '12s', time: '1 day ago', environment: 'production' },
  { id: '5', repo: 'febrits/chatvault', branch: 'main', status: 'success', url: 'https://chatvault-nine.vercel.app', commit: 'e8b3d7f', message: 'feat: real-time rooms', duration: '52s', time: '2 days ago', environment: 'production' },
  { id: '6', repo: 'febrits/habitgrid', branch: 'main', status: 'queued', url: 'https://habitgrid-eight.vercel.app', commit: 'f1a9e2d', message: 'feat: streak calendar', duration: '-', time: 'Just now', environment: 'production' },
];

const MOCK_ANALYTICS = {
  totalDeployments: 156,
  successRate: 94,
  avgBuildTime: '42s',
  bandwidth: '2.4 GB',
  visits: '12.8K',
};

const STATUS_CONFIG = {
  success: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10', label: 'Ready' },
  failed: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10', label: 'Failed' },
  building: { icon: RefreshCw, color: 'text-amber-400', bg: 'bg-amber-400/10', label: 'Building' },
  queued: { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Queued' },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'deployments' | 'repos' | 'settings'>('overview');
  const [deployments, setDeployments] = useState(MOCK_DEPLOYMENTS);
  const [repos, setRepos] = useState(MOCK_REPOS);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deployBranch, setDeployBranch] = useState('main');
  const [deployEnv, setDeployEnv] = useState<'production' | 'preview'>('production');

  const handleDeploy = (repoName: string) => {
    setSelectedRepo(repoName);
    setShowDeployModal(true);
  };

  const confirmDeploy = () => {
    if (!selectedRepo) return;
    const newDeployment: Deployment = {
      id: Date.now().toString(),
      repo: selectedRepo,
      branch: deployBranch,
      status: 'building',
      url: `https://${selectedRepo.split('/')[1]}-bangpeb.vercel.app`,
      commit: Math.random().toString(36).substring(2, 9),
      message: 'Manual deploy from DeployBot',
      duration: '-',
      time: 'Just now',
      environment: deployEnv,
    };
    setDeployments([newDeployment, ...deployments]);
    setShowDeployModal(false);

    // Simulate build
    setTimeout(() => {
      setDeployments(prev => prev.map(d =>
        d.id === newDeployment.id ? { ...d, status: 'success', duration: '34s' } : d
      ));
    }, 3000);
  };

  const handleRollback = (id: string) => {
    setDeployments(prev => prev.map(d =>
      d.id === id ? { ...d, status: 'building' } : d
    ));
    setTimeout(() => {
      setDeployments(prev => prev.map(d =>
        d.id === id ? { ...d, status: 'success' } : d
      ));
    }, 2000);
  };

  const toggleRepoConnection = (repoId: string) => {
    setRepos(prev => prev.map(r =>
      r.id === repoId ? { ...r, connected: !r.connected } : r
    ));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e2e8f0]">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Rocket size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold">DeployBot</span>
          </div>
          <nav className="flex items-center gap-1">
            {(['overview', 'deployments', 'repos', 'settings'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-indigo-500/15 text-indigo-400'
                    : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {[
                  { label: 'Total Deploys', value: MOCK_ANALYTICS.totalDeployments, icon: Rocket, color: 'from-indigo-500 to-blue-500' },
                  { label: 'Success Rate', value: `${MOCK_ANALYTICS.successRate}%`, icon: CheckCircle2, color: 'from-emerald-500 to-green-500' },
                  { label: 'Avg Build', value: MOCK_ANALYTICS.avgBuildTime, icon: Zap, color: 'from-amber-500 to-orange-500' },
                  { label: 'Bandwidth', value: MOCK_ANALYTICS.bandwidth, icon: Activity, color: 'from-purple-500 to-pink-500' },
                  { label: 'Visits', value: MOCK_ANALYTICS.visits, icon: Eye, color: 'from-cyan-500 to-teal-500' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-[#12121a] border border-white/5 rounded-2xl p-5"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                      <stat.icon size={18} className="text-white" />
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-[#94a3b8] mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Deployments */}
              <div className="bg-[#12121a] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Recent Deployments</h2>
                  <button
                    onClick={() => setActiveTab('deployments')}
                    className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    View all <ChevronRight size={14} />
                  </button>
                </div>
                <div className="divide-y divide-white/5">
                  {deployments.slice(0, 5).map((deploy) => {
                    const status = STATUS_CONFIG[deploy.status];
                    const StatusIcon = status.icon;
                    return (
                      <div key={deploy.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                        <div className={`w-9 h-9 rounded-lg ${status.bg} flex items-center justify-center`}>
                          <StatusIcon size={18} className={status.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{deploy.repo}</span>
                            <span className="text-xs text-[#94a3b8] bg-white/5 px-2 py-0.5 rounded-full">{deploy.branch}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>{status.label}</span>
                          </div>
                          <p className="text-sm text-[#94a3b8] mt-0.5 truncate">{deploy.message}</p>
                        </div>
                        <div className="text-right hidden sm:block">
                          <p className="text-sm text-[#94a3b8]">{deploy.duration}</p>
                          <p className="text-xs text-[#64748b]">{deploy.time}</p>
                        </div>
                        {deploy.status === 'success' && deploy.url && (
                          <a href={deploy.url} target="_blank" rel="noopener noreferrer" className="text-[#94a3b8] hover:text-white transition-colors">
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'deployments' && (
            <motion.div
              key="deployments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-[#12121a] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">All Deployments</h2>
                  <div className="flex items-center gap-2">
                    {(['all', 'success', 'failed', 'building'] as const).map(filter => (
                      <button
                        key={filter}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all"
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="divide-y divide-white/5">
                  {deployments.map((deploy) => {
                    const status = STATUS_CONFIG[deploy.status];
                    const StatusIcon = status.icon;
                    return (
                      <div key={deploy.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                        <div className={`w-10 h-10 rounded-lg ${status.bg} flex items-center justify-center`}>
                          <StatusIcon size={20} className={status.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium">{deploy.repo}</span>
                            <span className="text-xs text-[#94a3b8] bg-white/5 px-2 py-0.5 rounded-full">{deploy.branch}</span>
                            <span className="text-xs text-[#94a3b8] bg-white/5 px-2 py-0.5 rounded-full">{deploy.commit}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>{status.label}</span>
                            <span className="text-xs text-[#64748b]">{deploy.environment}</span>
                          </div>
                          <p className="text-sm text-[#94a3b8] mt-1">{deploy.message}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right hidden sm:block">
                            <p className="text-sm">{deploy.duration}</p>
                            <p className="text-xs text-[#64748b]">{deploy.time}</p>
                          </div>
                          {deploy.status === 'success' && (
                            <button
                              onClick={() => handleRollback(deploy.id)}
                              className="p-2 rounded-lg text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all"
                              title="Rollback"
                            >
                              <RotateCcw size={16} />
                            </button>
                          )}
                          {deploy.url && (
                            <a href={deploy.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all">
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'repos' && (
            <motion.div
              key="repos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Connected Repositories</h2>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25 transition-all text-sm font-medium">
                  <Plus size={16} /> Connect Repo
                </button>
              </div>
              <div className="grid gap-4">
                {repos.map((repo) => (
                  <motion.div
                    key={repo.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#12121a] border border-white/5 rounded-2xl p-5 flex items-center gap-4 hover:border-indigo-500/20 transition-all"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                      <GitBranch size={20} className="text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{repo.name}</span>
                        <span className="text-xs text-[#94a3b8] bg-white/5 px-2 py-0.5 rounded-full">{repo.language}</span>
                        {repo.connected && (
                          <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">Connected</span>
                        )}
                      </div>
                      <p className="text-sm text-[#94a3b8] mt-0.5">{repo.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-[#64748b]">
                        <span>⭐ {repo.stars}</span>
                        <span>Updated {repo.updated}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeploy(repo.name)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-all text-sm font-medium"
                      >
                        <Rocket size={14} /> Deploy
                      </button>
                      <button
                        onClick={() => toggleRepoConnection(repo.id)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                          repo.connected
                            ? 'bg-red-400/10 text-red-400 hover:bg-red-400/20'
                            : 'bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20'
                        }`}
                      >
                        {repo.connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="max-w-2xl space-y-6">
                <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Settings size={20} /> General Settings
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-[#94a3b8] block mb-2">Default Branch</label>
                      <select className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50">
                        <option>main</option>
                        <option>master</option>
                        <option>develop</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-[#94a3b8] block mb-2">Build Command</label>
                      <input
                        type="text"
                        defaultValue="npm run build"
                        className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-[#94a3b8] block mb-2">Output Directory</label>
                      <input
                        type="text"
                        defaultValue="dist"
                        className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-[#94a3b8] block mb-2">Framework Preset</label>
                      <select className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50">
                        <option>Vite</option>
                        <option>Next.js</option>
                        <option>Create React App</option>
                        <option>Vue</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Globe size={20} /> Environment Variables
                  </h3>
                  <div className="space-y-3">
                    {[
                      { key: 'NODE_ENV', value: 'production' },
                      { key: 'VITE_API_URL', value: 'https://api.example.com' },
                      { key: 'VITE_SUPABASE_URL', value: 'https://taxzjnyfdxokquggtxyl.supabase.co' },
                    ].map((env, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <input
                          type="text"
                          defaultValue={env.key}
                          className="flex-1 bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 font-mono"
                        />
                        <input
                          type="text"
                          defaultValue={env.value}
                          className="flex-1 bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 font-mono"
                        />
                        <button className="p-2 rounded-lg text-[#94a3b8] hover:text-red-400 hover:bg-red-400/10 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                      <Plus size={16} /> Add Variable
                    </button>
                  </div>
                </div>

                <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Server size={20} /> Custom Domains
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3">
                      <Globe size={16} className="text-[#94a3b8]" />
                      <span className="flex-1 text-sm font-mono">taskflow-bangpeb.vercel.app</span>
                      <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">Verified</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors mt-3">
                    <Plus size={16} /> Add Domain
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Deploy Modal */}
      <AnimatePresence>
        {showDeployModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeployModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#12121a] border border-white/10 rounded-2xl p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Deploy {selectedRepo}</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[#94a3b8] block mb-2">Branch</label>
                  <select
                    value={deployBranch}
                    onChange={e => setDeployBranch(e.target.value)}
                    className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50"
                  >
                    <option value="main">main</option>
                    <option value="develop">develop</option>
                    <option value="staging">staging</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-[#94a3b8] block mb-2">Environment</label>
                  <div className="flex gap-3">
                    {(['production', 'preview'] as const).map(env => (
                      <button
                        key={env}
                        onClick={() => setDeployEnv(env)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          deployEnv === env
                            ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                            : 'bg-[#0a0a0f] border border-white/10 text-[#94a3b8] hover:text-white'
                        }`}
                      >
                        {env.charAt(0).toUpperCase() + env.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowDeployModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-[#94a3b8] hover:text-white transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeploy}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-all text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Rocket size={16} /> Deploy
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
