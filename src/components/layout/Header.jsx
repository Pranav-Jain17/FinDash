import { useAppContext } from '../../context/AppContext';

export default function Header() {
    const { role, setRole, theme, toggleTheme } = useAppContext();

    return (
        <header className="app-header">
            <div className="controls" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                    onClick={toggleTheme}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-light)',
                        background: 'var(--bg-app)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label htmlFor="role-select">Role: </label>
                    <select
                        id="role-select"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={{
                            padding: '8px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-light)',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-primary)'
                        }}
                    >
                        <option value="Viewer">Viewer</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
            </div>
        </header>
    );
}