import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const defaultTransactions = [
    { id: 1, date: '2026-03-01', amount: 3200, category: 'Salary', type: 'Income' },
    { id: 2, date: '2026-03-05', amount: 850, category: 'Rent', type: 'Expense' },
    { id: 3, date: '2026-03-12', amount: 300, category: 'Groceries', type: 'Expense' },
    { id: 4, date: '2026-03-20', amount: 150, category: 'Entertainment', type: 'Expense' }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const AppProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [role, setRole] = useState('Admin');

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('findash_theme') || 'light';
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            await delay(1200);
            const saved = localStorage.getItem('findash_data');
            setTransactions(saved ? JSON.parse(saved) : defaultTransactions);
            setIsLoading(false);
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('findash_data', JSON.stringify(transactions));
        }
    }, [transactions, isLoading]);

    useEffect(() => {
        localStorage.setItem('findash_theme', theme);
        document.body.className = theme;
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const addTransaction = async (newTransaction) => {
        setIsLoading(true);
        await delay(800);
        setTransactions((prev) => [
            ...prev,
            { ...newTransaction, id: Date.now() }
        ]);
        setIsLoading(false);
    };

    const updateTransaction = async (id, updatedTransaction) => {
        setIsLoading(true);
        await delay(800);
        setTransactions((prev) =>
            prev.map((t) => (t.id === id ? { ...updatedTransaction, id } : t))
        );
        setIsLoading(false);
    };

    const deleteTransaction = async (id) => {
        setIsLoading(true);
        await delay(800);
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        setIsLoading(false);
    };

    return (
        <AppContext.Provider value={{
            transactions,
            isLoading,
            role,
            setRole,
            theme,
            toggleTheme,
            addTransaction,
            updateTransaction,
            deleteTransaction
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);