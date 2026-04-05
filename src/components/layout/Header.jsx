import { useAppContext } from '../../context/AppContext';

export default function Header() {
    const { role, setRole } = useAppContext();

    return (
        <header className="app-header">
            <div className="controls">
                <label htmlFor="role-select" style={{ marginRight: '8px' }}>Current Role: </label>
                <select
                    id="role-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="role-selector"
                >
                    <option value="Viewer">Viewer (Read Only)</option>
                    <option value="Admin">Admin (Can Edit/Add)</option>
                </select>
            </div>
        </header>
    );
}