// ANCHOR: INIT
window.addEventListener('DOMContentLoaded', async () => {
    projects = await DataService.getProjects();
    clients = await DataService.getClients();
    stepLogs = await DataService.getStepLogs();
    
    setRole('admin');
    switchTab('matrix');
});

// ANCHOR: ROLE_TAB_CONTROLS
function setRole(role) {
    currentRole = role;
    const btnAdmin = document.getElementById('role-admin');
    const btnStaff = document.getElementById('role-staff');
    const adminActions = document.getElementById('admin-project-actions');

    if (role === 'admin') {
        btnAdmin.className = "px-2.5 py-1 rounded font-bold transition bg-pearl-600 text-white shadow-sm";
        btnStaff.className = "px-2.5 py-1 rounded font-bold transition text-slate-500 hover:text-slate-800";
        if (adminActions) adminActions.classList.remove('hidden');
    } else {
        btnStaff.className = "px-2.5 py-1 rounded font-bold transition bg-pearl-600 text-white shadow-sm";
        btnAdmin.className = "px-2.5 py-1 rounded font-bold transition text-slate-500 hover:text-slate-800";
        if (adminActions) adminActions.classList.add('hidden');
    }
    renderCurrentTab();
}

function switchTab(tab) {
    currentTab = tab;
    ['matrix', 'kanban', 'analytics'].forEach(t => {
        const btn = document.getElementById(`nav-${t}`);
        const view = document.getElementById(`view-${t}`);
        if (t === tab) {
            btn.className = "px-4 py-1.5 rounded-lg font-bold bg-white text-pearl-600 shadow-sm transition";
            view.classList.remove('hidden');
        } else {
            btn.className = "px-4 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 font-medium transition";
            view.classList.add('hidden');
        }
    });
    renderCurrentTab();
}

function renderCurrentTab() {
    if (currentTab === 'matrix') renderMatrixView();
    else if (currentTab === 'kanban') renderKanbanView();
    else if (currentTab === 'analytics') renderAnalytics();
}

// ANCHOR: MATRIX_VIEW
function renderMatrixView() {
    const grid = document.getElementById('project-grid');
    grid.innerHTML = projects.map(p => {
        const stats = calculateProjectProgress(p);
        return `
            <div onclick="openProjectDetail('${p.id}')" class="bg-white p-5 rounded-xl border border-slate-200 hover:border-pearl-400 hover:shadow-md transition cursor-pointer space-y-3">
                <div class="flex justify-between items-start">
                    <h3 class="font-bold text-slate-800 text-base line-clamp-1">${p.name}</h3>
                    <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">${p.cycle}</span>
                </div>
                <div class="text-xs text-slate-500 flex items-center gap-4">
                    <span><i class="fa-regular fa-calendar mr-1"></i>截止日: ${p.deadline}</span>
                    <span><i class="fa-solid fa-list-check mr-1"></i>${p.steps.length} 個步驟</span>
                </div>
                <div class="space-y-1">
                    <div class="flex justify-between text-xs font-bold">
                        <span class="text-slate-500">完成度</span>
                        <span class="text-pearl-600">${stats.rate}%</span>
                    </div>
                    <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div class="bg-pearl-500 h-full transition-all duration-300" style="width: ${stats.rate}%"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    if (activeProjectId) openProjectDetail(activeProjectId);
}

function calculateProjectProgress(project) {
    let total = clients.length * project.steps.length;
    if (total === 0) return { rate: 0 };
    let doneCount = 0;
    clients.forEach(c => {
        project.steps.forEach((_, idx) => {
            const key = `${project.id}_${c.id}_${idx}`;
            const log = stepLogs[key];
            if (log && (log.status === 'done' || log.status === 'skip')) {
                doneCount++;
            }
        });
    });
    return { rate: Math.round((doneCount / total) * 100) };
}

function openProjectDetail(projectId) {
    activeProjectId = projectId;
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    document.getElementById('detail-project-name').innerText = project.name;
    document.getElementById('detail-project-cycle').innerText = `截止日：${project.deadline}`;

    const thead = document.getElementById('matrix-table-head');
    thead.innerHTML = `
        <th class="p-3 border-b font-bold">客戶名稱</th>
        ${project.steps.map((s, idx) => `<th class="p-3 border-b font-bold text-center">步驟 ${idx + 1}: ${s}</th>`).join('')}
    `;

    const tbody = document.getElementById('matrix-table-body');
    tbody.innerHTML = clients.map(c => {
        return `
            <tr class="hover:bg-slate-50/80 transition">
                <td class="p-3 border-b font-bold text-slate-800">${c.name} <span class="text-slate-400 text-[10px] font-normal">(${c.code})</span></td>
                ${project.steps.map((s, idx) => {
                    const key = `${project.id}_${c.id}_${idx}`;
                    const log = stepLogs[key] || { status: 'none', operator: '', elapsed: 0 };
                    const cfg = STATUS_CONFIG[log.status] || STATUS_CONFIG['none'];
                    return `
                        <td class="p-2 border-b text-center">
                            <button onclick="openTimerModal('${key}', '${c.name}', '${s}')" class="w-full py-1.5 px-2 rounded text-xs transition flex flex-col items-center justify-center gap-0.5 ${cfg.bg}">
                                <span>${cfg.label}</span>
                                ${log.elapsed ? `<span class="text-[10px] opacity-75 font-mono">${formatSeconds(log.elapsed)}</span>` : ''}
                            </button>
                        </td>
                    `;
                }).join('')}
            </tr>
        `;
    }).join('');

    document.getElementById('project-detail-panel').classList.remove('hidden');
}

function closeProjectDetail() {
    activeProjectId = null;
    document.getElementById('project-detail-panel').classList.add('hidden');
}

// ANCHOR: TIMER_MODULE
function openTimerModal(key, clientName, stepName) {
    activeKey = key;
    const log = stepLogs[key] || { status: 'none', operator: '', elapsed: 0 };

    document.getElementById('modal-client-name').innerText = clientName;
    document.getElementById('modal-step-name').innerText = stepName;
    document.getElementById('timer-status-badge').innerText = STATUS_CONFIG[log.status] ? STATUS_CONFIG[log.status].label : '未開始';
    document.getElementById('timer-user-info').innerText = log.operator ? `執行人員：${log.operator}` : '尚無操作紀錄';

    document.getElementById('btn-start').style.display = (log.status === 'none') ? 'flex' : 'none';
    document.getElementById('btn-resume').style.display = (log.status === 'paused') ? 'flex' : 'none';
    document.getElementById('btn-pause').style.display = (log.status === 'progress') ? 'flex' : 'none';

    updateTimerDisplay();

    if (timerInterval) clearInterval(timerInterval);
    if (log.status === 'progress') {
        timerInterval = setInterval(() => {
            log.elapsed = (log.elapsed || 0) + 1;
            updateTimerDisplay();
        }, 1000);
    }

    document.getElementById('timer-modal').classList.remove('hidden');
}

function updateTimerDisplay() {
    const log = stepLogs[activeKey] || { elapsed: 0 };
    document.getElementById('timer-display').innerText = formatSeconds(log.elapsed || 0);
}

function closeTimerModal() {
    if (timerInterval) clearInterval(timerInterval);
    document.getElementById('timer-modal').classList.add('hidden');
}

async function handleTimerAction(action) {
    if (!activeKey) return;

    const currentUser = (currentRole === 'admin') ? '老闆 (Admin)' : '員工 (Staff)';
    let log = stepLogs[activeKey] || { status: 'none', elapsed: 0 };

    if (log.operator && log.operator !== currentUser && (action === 'pause' || action === 'complete' || action === 'resume')) {
        alert(`[防呆警告] 此步驟當前由「${log.operator}」操作中，依規格書規定，同一步驟之開始/暫停/繼續/完成必須由同一人操作！`);
        return;
    }

    if (action === 'start' || action === 'resume') {
        log.status = 'progress';
        log.operator = currentUser;
        log.lastStart = Date.now();
    } else if (action === 'pause') {
        log.status = 'paused';
    } else if (action === 'complete') {
        log.status = 'done';
    } else if (action === 'skip') {
        log.status = 'skip';
    }

    stepLogs[activeKey] = log;
    await DataService.saveStepLogs(stepLogs);

    closeTimerModal();
    const project = projects.find(p => p.id === activeProjectId);
    if (project) openProjectDetail(project.id);
}

// ANCHOR: KANBAN_VIEW
function renderKanbanView() {
    const container = document.getElementById('kanban-cards-container');
    let items = [];

    projects.forEach(p => {
        clients.forEach(c => {
            p.steps.forEach((s, idx) => {
                const key = `${p.id}_${c.id}_${idx}`;
                const log = stepLogs[key] || { status: 'none' };
                if (log.status === 'progress' || log.status === 'paused') {
                    items.push({ project: p, client: c, stepName: s, stepIdx: idx, log, key });
                }
            });
        });
    });

    if (items.length === 0) {
        container.innerHTML = `<div class="col-span-full py-12 text-center text-slate-400 text-sm">目前無正在進行或暫停中的聚焦任務</div>`;
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div class="flex justify-between items-start">
                <span class="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">${item.project.name}</span>
                <span class="text-xs font-bold px-2 py-0.5 rounded ${STATUS_CONFIG[item.log.status].bg}">${STATUS_CONFIG[item.log.status].label}</span>
            </div>
            <div>
                <h4 class="font-bold text-slate-800 text-sm">${item.client.name}</h4>
                <p class="text-xs text-slate-600 mt-1">步驟 ${item.stepIdx + 1}: ${item.stepName}</p>
            </div>
            <div class="flex justify-between items-center text-xs text-slate-400 border-t border-slate-100 pt-2">
                <span><i class="fa-regular fa-user mr-1"></i>${item.log.operator || '未指定'}</span>
                <span class="font-mono font-bold text-slate-700">${formatSeconds(item.log.elapsed || 0)}</span>
            </div>
        </div>
    `).join('');
}

// ANCHOR: ANALYTICS_VIEW
function renderAnalytics() {
    const staffContainer = document.getElementById('analytics-staff-list');
    const projectContainer = document.getElementById('analytics-project-list');

    let userStats = {};

    Object.values(stepLogs).forEach(log => {
        if (log.operator) {
            if (!userStats[log.operator]) userStats[log.operator] = { seconds: 0, doneCount: 0 };
            userStats[log.operator].seconds += (log.elapsed || 0);
            if (log.status === 'done') userStats[log.operator].doneCount++;
        }
    });

    const SEVEN_HOURS_SEC = 25200;

    staffContainer.innerHTML = Object.keys(userStats).length ? Object.entries(userStats).map(([user, data]) => {
        const isUnderTime = data.seconds < SEVEN_HOURS_SEC;
        return `
            <div class="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                    <div class="flex items-center gap-2">
                        <span class="font-bold text-slate-800 text-sm">${user}</span>
                        ${isUnderTime ? `<span class="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded border border-rose-200"><i class="fa-solid fa-triangle-exclamation mr-1"></i>日工時未滿 7 小時</span>` : `<span class="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200">工時達標</span>`}
                    </div>
                    <span class="text-slate-400 text-[11px] block mt-0.5">已累積完成 ${data.doneCount} 個步驟</span>
                </div>
                <span class="font-mono font-bold text-pearl-600 text-base">${formatSeconds(data.seconds)}</span>
            </div>
        `;
    }).join('') : '<p class="text-slate-400 italic text-xs">尚無工時紀錄</p>';

    projectContainer.innerHTML = projects.map(p => {
        let totalSec = 0;
        clients.forEach(c => {
            p.steps.forEach((_, idx) => {
                const key = `${p.id}_${c.id}_${idx}`;
                const log = stepLogs[key];
                if (log) totalSec += (log.elapsed || 0);
            });
        });
        const stats = calculateProjectProgress(p);

        return `
            <div class="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div class="flex justify-between items-center">
                    <span class="font-bold text-slate-800 text-sm">${p.name}</span>
                    <span class="font-mono font-bold text-pearl-600 text-xs">${formatSeconds(totalSec)}</span>
                </div>
                <div class="flex items-center gap-3">
                    <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div class="bg-pearl-500 h-full transition-all duration-300" style="width: ${stats.rate}%"></div>
                    </div>
                    <span class="font-bold text-xs text-slate-700 min-w-[36px] text-right">${stats.rate}%</span>
                </div>
            </div>
        `;
    }).join('');
}

// ANCHOR: ADMIN_ACTIONS_UTILS
function openProjectModal() {
    document.getElementById('project-modal').classList.remove('hidden');
}

function closeProjectModal() {
    document.getElementById('project-modal').classList.add('hidden');
}

async function saveProject() {
    const name = document.getElementById('input-proj-name').value.trim();
    const cycle = document.getElementById('input-proj-cycle').value;
    const deadline = document.getElementById('input-proj-deadline').value;
    const stepsRaw = document.getElementById('input-proj-steps').value.trim();

    if (!name || !deadline || !stepsRaw) {
        alert('請完整填寫專案名稱、截止日與步驟！');
        return;
    }

    const steps = stepsRaw.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    const newProject = {
        id: `proj_${Date.now()}`,
        name,
        cycle,
        deadline,
        steps
    };

    projects.push(newProject);
    await DataService.saveProjects(projects);
    closeProjectModal();
    renderCurrentTab();
}

function formatSeconds(sec) {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return [hrs, mins, secs].map(v => String(v).padStart(2, '0')).join(':');
}
