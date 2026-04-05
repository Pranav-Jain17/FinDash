import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import './transactions.css';

export default function Transactions() {
    const { transactions, role, addTransaction } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.category) return;

        addTransaction({
            ...formData,
            amount: parseFloat(formData.amount)
        });

        setFormData({ ...formData, amount: '', category: '' });
    };

    return (
        <div className="transactions-page">
            <header className="page-header">
                <h1>Transactions</h1>
                <p>Manage and view your financial history.</p>
            </header>

            {role === 'Admin' && (
                <div className="card admin-panel">
                    <h3>Add New Transaction (Admin Only)</h3>
                    <form onSubmit={handleSubmit} className="transaction-form">
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Category (e.g., Food)"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                        />
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="Expense">Expense</option>
                            <option value="Income">Income</option>
                        </select>
                        <button type="submit" className="btn-primary">Add</button>
                    </form>
                </div>
            )}

            <div className="card list-container">
                <div className="filters">
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="filter-select"
                    >
                        <option value="All">All Types</option>
                        <option value="Income">Income Only</option>
                        <option value="Expense">Expense Only</option>
                    </select>
                </div>

                <div className="table-responsive">
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Type</th>
                                <th className="amount-col">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((t) => (
                                <tr key={t.id}>
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
                                </tr>
                            ))}
                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="empty-state">No transactions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}