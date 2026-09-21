/**
 * PearlFlow - 全域權限控管模組
 * @file js/auth-guard.js
 */

const PearlAuth = {
    currentUser: null,
    currentRole: 'staff', // 預設權限 'boss' | 'hr' | 'pm' | 'staff'

    // 初始化與讀取權限
    async init() {
        if (!window.supabase) return;

        // 取得 Supabase 目前 Session 使用者
        const { data: { session } } = await window.supabase.auth.getSession();
        if (session && session.user) {
            this.currentUser = session.user;
            // 讀取角色關聯表
            const { data, error } = await window.supabase
                .from('user_roles')
                .select('role_id')
                .eq('user_id', this.currentUser.id)
                .single();

            if (!error && data) {
                this.currentRole = data.role_id;
            }
        } else {
            // 訪客/測試模式：可從 localStorage 模擬角色切換（開發便利）
            const mockRole = localStorage.getItem('pf_mock_role');
            if (mockRole) {
                this.currentRole = mockRole;
            } else {
                this.currentRole = 'boss'; // 預設開啟測試全權限
            }
        }

        this.applyUIPermissions();
    },

    // 判斷權限層級
    hasRole(requiredRoles) {
        if (typeof requiredRoles === 'string') {
            requiredRoles = [requiredRoles];
        }
        if (this.currentRole === 'boss') return true; // 老闆擁有特權
        return requiredRoles.includes(this.currentRole);
    },

    // UI 自動渲染與開關（根據 HTML 標籤屬性 [data-pf-role] 控管）
    applyUIPermissions() {
        document.querySelectorAll('[data-pf-role]').forEach(el => {
            const allowedRoles = el.getAttribute('data-pf-role').split(',');
            if (this.hasRole(allowedRoles)) {
                el.style.display = '';
            } else {
                el.style.display = 'none';
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    PearlAuth.init();
});
