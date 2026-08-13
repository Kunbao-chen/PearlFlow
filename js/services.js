// ANCHOR: DATA_SERVICE
const DataService = {
    async getProjects() {
        const data = localStorage.getItem('pearl_projects');
        return data ? JSON.parse(data) : [
            {
                id: 'proj_1',
                name: '113年01-02月 營業稅申報',
                cycle: 'bimonthly',
                deadline: '2026-03-15',
                steps: ['進銷項憑證收集', '進項扣抵憑證登錄', '銷項開立發票核對', '401申報書產出', '網路申報上傳']
            },
            {
                id: 'proj_2',
                name: '112年度 營利事業所得稅申報',
                cycle: 'annual',
                deadline: '2026-05-31',
                steps: ['年度帳務結轉', '資產負債盤點', '調節表編製', '所得稅結算申報']
            }
        ];
    },
    async saveProjects(projects) {
        localStorage.setItem('pearl_projects', JSON.stringify(projects));
    },
    async getClients() {
        const data = localStorage.getItem('pearl_clients');
        return data ? JSON.parse(data) : [
            { id: 'cli_1', name: '珍珠科技股份有限公司', code: 'A001' },
            { id: 'cli_2', name: '翡翠文化創意有限公司', code: 'A002' },
            { id: 'cli_3', name: '琉璃實業股份有限公司', code: 'A003' }
        ];
    },
    async getStepLogs() {
        const data = localStorage.getItem('pearl_step_logs');
        return data ? JSON.parse(data) : {};
    },
    async saveStepLogs(logs) {
        localStorage.setItem('pearl_step_logs', JSON.stringify(logs));
    }
};
