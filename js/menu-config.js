/*
==========================================================================
PearlFlow - 選單與權限組態設定檔 (含內建 SVG 圖示庫)
@file        js/menu-config.js
==========================================================================
*/

// 1. 集中管理 SVG 圖示定義 (原 icons.js 內容)
const PearlIcons = {
    grid: `<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    dashboard: `<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`,
    calendar: `<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    users: `<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    'user-check': `<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>`,
    
    // 渲染 SVG 函式
    getSvg: function(iconName, size = 18) {
        if (!this[iconName]) return '';
        return this[iconName].replace(/{size}/g, size);
    },

    renderAll: function() {
        document.querySelectorAll('[data-pf-icon]').forEach(el => {
            const iconName = el.getAttribute('data-pf-icon');
            const size = el.getAttribute('data-size') || '18';
            el.innerHTML = this.getSvg(iconName, size);
        });
    }
};

// 2. 集中管理選單與角色權限表
const PearlMenuConfig = [
    {
        id: 'matrix',
        title: '專案進度矩陣',
        icon: 'grid',
        url: 'page-matrix.html',
        roles: ['boss', 'pm', 'hr', 'staff']
    },
    {
        id: 'dashboard',
        title: 'Dashboard 儀表板',
        icon: 'dashboard',
        url: 'page-dashboard.html',
        roles: ['boss', 'pm', 'hr', 'staff']
    },
    {
        id: 'calendar',
        title: '事務所行事曆',
        icon: 'calendar',
        url: 'page-calendar.html',
        roles: ['boss', 'pm', 'hr', 'staff']
    },
    {
        id: 'crm',
        title: '客戶管理 (CRM)',
        icon: 'users',
        url: 'page-crm.html',
        roles: ['boss', 'pm', 'hr']
    },
    {
        id: 'members',
        title: '成員與權限管理',
        icon: 'user-check',
        url: 'page-members.html',
        roles: ['boss', 'hr']
    }
];

// 3. 動態渲染導覽列選單
function renderDynamicSidebarMenu() {
    const navContainer = document.getElementById('sidebar-menu-nav');
    if (!navContainer) return;

    const currentRole = PearlAuth.getRole();

    // 過濾權限
    const allowedMenus = PearlMenuConfig.filter(item => {
        if (currentRole === 'boss') return true;
        return item.roles.includes(currentRole);
    });

    // 渲染 DOM (直接呼叫 PearlIcons.getSvg 插入圖示)
    navContainer.innerHTML = allowedMenus.map((item, index) => {
        const isActive = index === 0 ? 'active' : '';
        const iconSvg = PearlIcons.getSvg(item.icon, 18);
        return `
            <a class="menu-item ${isActive}" onclick="switchPage('${item.url}', this)">
                <span>${iconSvg}</span>
                <span>${item.title}</span>
            </a>
        `;
    }).join('');
}

// 自動掃描其他頁面可能存在的 data-pf-icon 標籤
document.addEventListener('DOMContentLoaded', () => {
    PearlIcons.renderAll();
});
