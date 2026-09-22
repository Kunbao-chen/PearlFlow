/*
==========================================================================
PearlFlow - 選單與權限組態設定檔 (Menu & Permission Config)
@file        js/menu-config.js
==========================================================================
*/

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

// 動態渲染導覽列選單函式
function renderDynamicSidebarMenu() {
    const navContainer = document.getElementById('sidebar-menu-nav');
    if (!navContainer) return;

    const currentRole = PearlAuth.getRole();

    // 過濾目前角色有權限存取的選單
    const allowedMenus = PearlMenuConfig.filter(item => {
        if (currentRole === 'boss') return true;
        return item.roles.includes(currentRole);
    });

    // 渲染 HTML DOM
    navContainer.innerHTML = allowedMenus.map((item, index) => {
        const isActive = index === 0 ? 'active' : '';
        return `
            <a class="menu-item ${isActive}" onclick="switchPage('${item.url}', this)">
                <span data-pf-icon="${item.icon}" data-size="18"></span>
                <span>${item.title}</span>
            </a>
        `;
    }).join('');

    // 渲染 Icon 圖示
    if (window.PearlIcons) {
        PearlIcons.render();
    }
}
