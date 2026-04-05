import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import './transactions.css';

export default function Transactions() {
    const { transactions, isLoading, role, addTransaction, updateTransaction, deleteTransaction } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: '',
        type: 'Expense'
    });

    const filteredTransactions = transactions.filter((t) => {
        const matchesSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || t.type === filterType;
        return matchesSearch && matchesType;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.category) return;

        if (editingId) {
            await updateTransaction(editingId, {
                ...formData,
                amount: parseFloat(formData.amount)
            });
            setEditingId(null);
        } else {
            await addTransaction({
                ...formData,
                amount: parseFloat(formData.amount)
            });
        }

        setFormData({
            date: new Date().toISOString().split('T')[0],
            amount: '',
            category: '',
            type: 'Expense'
        });
    };

    const handleEditClick = (t) => {
        setEditingId(t.id);
        setFormData({
            date: t.date,
            amount: t.amount,
            category: t.category,
            type: t.type
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({
            date: new Date().toISOString().split('T')[0],
            amount: '',
            category: '',
            type: 'Expense'
        });
    };

    const exportCSV = () => {
        const headers = ['Date,Category,Type,Amount'];
        const csvData = filteredTransactions.map(t => `${t.date},${t.category},${t.type},${t.amount}`);
        const blob = new Blob([[...headers, ...csvData].join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transactions_export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (isLoading && transactions.length === 0) {
        return (
            <div className="loading-container fade-in">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className={`transactions-page fade-in ${isLoading ? 'opacity-50' : ''}`}>
            <header className="page-header">
                <h1>Transactions</h1>
                <p>Manage and view your financial history.</p>
            </header>

            {role === 'Admin' && (
                <div className="card admin-panel slide-up">
                    <h3>{editingId ? 'Edit Transaction' : 'Add New Transaction'}</h3>
                    <form onSubmit={handleSubmit} className="transaction-form">
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                            disabled={isLoading}
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                            disabled={isLoading}
                        />
                        <input
                            type="text"
                            placeholder="Category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                            disabled={isLoading}
                        />
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            disabled={isLoading}
                        >
                            <option value="Expense">Expense</option>
                            <option value="Income">Income</option>
                        </select>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary" disabled={isLoading}>
                                {isLoading ? 'Processing...' : (editingId ? 'Update' : 'Add')}
                            </button>
                            {editingId && (
                                <button type="button" className="btn-secondary" onClick={handleCancelEdit} disabled={isLoading}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            <div className="card list-container slide-up">
                <div className="filters">
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                        disabled={isLoading}
                    />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="filter-select"
                        disabled={isLoading}
                    >
                        <option value="All">All Types</option>
                        <option value="Income">Income Only</option>
                        <option value="Expense">Expense Only</option>
                    </select>
                    <button onClick={exportCSV} className="btn-secondary" disabled={isLoading || filteredTransactions.length === 0}>
                        Export CSV
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Type</th>
                                <th className="amount-col">Amount</th>
                                {role === 'Admin' && <th className="actions-col">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((t) => (
                                <tr key={t.id} className={editingId === t.id ? 'editing-row fade-in' : 'fade-in'}>
                                    <td>{t.date}</td>
                                    <td className="category-cell">{t.category}</td>
                                    <td>
                                        <span className={`badge ${t.type.toLowerCase()}`}>
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className={`amount-col ${t.type.toLowerCase()}`}>
                                        ${t.amount.toFixed(2)}
                                    </td>
                                    {role === 'Admin' && (
                                        <td className="actions-col">
                                            <button className="btn-action edit" onClick={() => handleEditClick(t)} disabled={isLoading}>Edit</button>
                                            <button className="btn-action delete" onClick={() => deleteTransaction(t.id)} disabled={isLoading}>Delete</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td colSpan={role === 'Admin' ? "5" : "4"} className="empty-state">No transactions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}