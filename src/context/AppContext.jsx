import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const defaultTransactions = [
    { id: 1, date: '2026-03-01', amount: 3200, category: 'Salary', type: 'Income' },
    { id: 2, date: '2026-03-05', amount: 850, category: 'Rent', type: 'Expense' },
    { id: 3, date: '2026-03-12', amount: 300, category: 'Groceries', type: 'Expense' },
    { id: 4, date: '2026-03-20', amount: 150, category: 'Entertainment', type: 'Expense' }
];

export const AppProvider = ({ children }) => {
    const [transactions, setTransactions] = useState(() => {
        const saved = localStorage.getItem('findash_data');
        return saved ? JSON.parse(saved) : defaultTransactions;
    });

    const [role, setRole] = useState('Admin');

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('findash_theme') || 'light';
    });

    useEffect(() => {
        localStorage.setItem('findash_data', JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        localStorage.setItem('findash_theme', theme);
        document.body.className = theme;
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const addTransaction = (newTransaction) => {
        setTransactions((prev) => [
            ...prev,
            { ...newTransaction, id: Date.now() }
        ]);
    };

    const updateTransaction = (id, updatedTransaction) => {
        setTransactions((prev) =>
            prev.map((t) => (t.id === id ? { ...updatedTransaction, id } : t))
        );
    };

    const deleteTransaction = (id) => {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <AppContext.Provider value={{ transactions, role, setRole, theme, toggleTheme, addTransaction, updateTransaction, deleteTransaction }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);