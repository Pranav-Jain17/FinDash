import { useAppContext } from '../context/AppContext';
import './Insights.css';

export default function Insights() {
    const { transactions } = useAppContext();

    const expenses = transactions.filter(t => t.type === 'Expense');

    const categoryTotals = expenses.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
    }, {});

    let highestCategory = 'N/A';
    let highestAmount = 0;

    Object.entries(categoryTotals).forEach(([category, amount]) => {
        if (amount > highestAmount) {
            highestAmount = amount;
            highestCategory = category;
        }
    });

    const income = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = income > 0 ? ((income - totalExpenses) / income) * 100 : 0;

    const getObservation = () => {
        if (expenses.length === 0) return "Not enough data to form an observation.";
        if (savingsRate < 0) return "Warning: You are currently spending more than your recorded income.";
        if (savingsRate > 50) return "Excellent! You are saving over 50% of your income.";
        return `You are currently spending most heavily on ${highestCategory}.`;
    };

    return (
        <div className="insights-page">
            <header className="page-header">
                <h1>Insights</h1>
                <p>Data-driven observations about your finances.</p>
            </header>

            <div className="insights-grid">
                <div className="card insight-card highlight">
                    <div className="insight-icon">🔥</div>
                    <div className="insight-content">
                        <h3>Top Spending Category</h3>
                        <p className="insight-value">{highestCategory}</p>
                        <p className="insight-subtext">${highestAmount.toFixed(2)} total</p>
                    </div>
                </div>

                <div className="card insight-card">
                    <div className="insight-icon">💰</div>
                    <div className="insight-content">
                        <h3>Estimated Savings Rate</h3>
                        <p className="insight-value">{savingsRate.toFixed(1)}%</p>
                        <p className="insight-subtext">Income vs. Expenses</p>
                    </div>
                </div>

                <div className="card insight-card observation-card">
                    <div className="insight-icon">🧠</div>
                    <div className="insight-content">
                        <h3>Smart Observation</h3>
                        <p className="insight-text">{getObservation()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}