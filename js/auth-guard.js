/*
==========================================================================
PearlFlow - 全域權限守衛與角色管理模組 (修復測試模擬身分連動)
@file        js/auth-guard.js
==========================================================================
*/

const PearlAuth = {
    // 取得當前角色 (優先讀取測試模擬器的 pf_demo_role)
    getRole: function() {
        const demoRole = localStorage.getItem('pf_demo_role');
        if (demoRole) return demoRole;
        return localStorage.getItem('pf_user_role') || 'boss';
    },

    // 設定角色
    setRole: function(role) {
        localStorage.setItem('pf_demo_role', role);
        localStorage.setItem('pf_user_role', role);
    },

    // 檢查是否有權限
    hasRole: function(allowedRoles) {
        const currentRole = this.getRole();
        if (currentRole === 'boss') return true; // Boss 擁有最高權限
        if (typeof allowedRoles === 'string') {
            allowedRoles = allowedRoles.split(',').map(r => r.trim());
        }
        return allowedRoles.includes(currentRole);
    },

    // 掃描頁面並執行 DOM 顯示/隱藏過濾
    applyRolePermissions: function() {
        const currentRole = this.getRole();
        const roleElements = document.querySelectorAll('[data-pf-role]');

        roleElements.forEach(el => {
            const requiredRoles = el.getAttribute('data-pf-role').split(',').map(r => r.trim());
            // 如果當前是 boss，或是包含在許可角色名單內，則顯示
            if (currentRole === 'boss' || requiredRoles.includes(currentRole)) {
                el.style.display = ''; // 恢復預設顯示 (Flex/Block)
            } else {
                el.style.display = 'none'; // 隱藏
            }
        });
    }
};

// 頁面載入後自動執行權限掃描
document.addEventListener('DOMContentLoaded', () => {
    PearlAuth.applyRolePermissions();
});
