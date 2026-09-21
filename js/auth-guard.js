/**
 * PearlFlow - 全域權限控管模組
 * @file js/auth-guard.js
 * @description 負責讀取使用者角色（boss / hr / pm / staff）並進行 UI 權限過濾
 */

const PearlAuth = {
    currentUser: null,
    currentRole: 'boss', // 預設角色: 'boss' | 'hr' | 'pm' | 'staff'

    // 初始化權限設定
    async init() {
        if (!window.supabase) return;

        // 取得 Supabase 登入 Session
        const { data: { session } } = await window.supabase.auth.getSession();
        if (session && session.user) {
            this.currentUser = session.user;
            const { data, error } = await window.supabase
                .from('user_roles')
                .select('role_id')
                .eq('user_id', this.currentUser.id)
                .single();

            if (!error && data) {
                this.currentRole = data.role_id;
            }
        } else {
            // 測試/訪客模式：允許經由 localStorage 模擬切換角色
            const mockRole = localStorage.getItem('pf_mock_role');
            if (mockRole) {
                this.currentRole = mockRole;
            } else {
                this.currentRole = 'boss';
            }
        }

        this.applyUIPermissions();
    },

    // 檢查目前角色是否具備指定權限
    hasRole(requiredRoles) {
        if (typeof requiredRoles === 'string') {
            requiredRoles = [requiredRoles];
        }
        if (this.currentRole === 'boss') return true; // 最高管理者擁有全權限
        return requiredRoles.includes(this.currentRole);
    },

    // 根據 HTML 標籤屬性 [data-pf-role] 自動隱藏/顯示 UI 元件
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
