// ANCHOR: CONFIG_DEFINITIONS
const STATUS_CONFIG = {
    'none': { label: '未開始', bg: 'bg-slate-100 text-slate-600 hover:bg-slate-200' },
    'progress': { label: '進行中', bg: 'bg-amber-100 text-amber-800 font-semibold hover:bg-amber-200 border border-amber-300 animate-pulse' },
    'paused': { label: '已暫停', bg: 'bg-indigo-100 text-indigo-800 font-semibold hover:bg-indigo-200 border border-indigo-300' },
    'done': { label: '已完成', bg: 'bg-emerald-100 text-emerald-800 font-semibold hover:bg-emerald-200' },
    'skip': { label: '無此步驟', bg: 'bg-slate-200 text-slate-500 line-through hover:bg-slate-300' }
};

// 全域狀態變數
let currentRole = 'admin'; // 'admin' | 'staff'
let currentTab = 'matrix';
let projects = [];
let clients = [];
let stepLogs = {}; // Key: `${projectId}_${clientId}_${stepIdx}`
let activeProjectId = null;
let activeKey = null;
let timerInterval = null;
