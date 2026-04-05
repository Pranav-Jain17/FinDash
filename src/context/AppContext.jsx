import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

const mockTransactions = [
    { id: 1, date: '2026-04-01', amount: 3200, category: 'Salary', type: 'Income' },
    { id: 2, date: '2026-04-03', amount: 850, category: 'Rent', type: 'Expense' },
    { id: 3, date: '2026-04-05', amount: 120, category: 'Groceries', type: 'Expense' },
    { id: 4, date: '2026-04-05', amount: 60, category: 'Utilities', type: 'Expense' }
];

export const AppProvider = ({ children }) => {
    const [transactions, setTransactions] = useState(mockTransactions);
    const [role, setRole] = useState('Viewer');

    const addTransaction = (newTransaction) => {
        setTransactions((prev) => [
            ...prev,
            { ...newTransaction, id: Date.now() }
        ]);
    };

    return (
        <AppContext.Provider value={{ transactions, role, setRole, addTransaction }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);