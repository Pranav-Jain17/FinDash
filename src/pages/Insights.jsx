import { useAppContext } from '../context/AppContext';
import './insights.css';

export default function Insights() {
    const { transactions } = useAppContext();

    const expenses = transactions.filter(t => t.type === 'Expense');
    const income = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = income > 0 ? ((income - totalExpenses) / income) * 100 : 0;

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

    const monthlyExpenses = expenses.reduce((acc, t) => {
        const monthYear = t.date.substring(0, 7);
        acc[monthYear] = (acc[monthYear] || 0) + t.amount;
        return acc;
    }, {});

    const sortedMonths = Object.keys(monthlyExpenses).sort().reverse();
    const currentMonthKey = sortedMonths[0];
    const prevMonthKey = sortedMonths[1];

    const currentMonthExpense = monthlyExpenses[currentMonthKey] || 0;
    const prevMonthExpense = monthlyExpenses[prevMonthKey] || 0;

    let monthlyTrend = 0;
    let trendText = "No previous data to compare.";
    let isTrendPositive = false;

    if (prevMonthExpense > 0) {
        monthlyTrend = ((currentMonthExpense - prevMonthExpense) / prevMonthExpense) * 100;
        isTrendPositive = monthlyTrend <= 0;
        trendText = monthlyTrend > 0
            ? `${Math.abs(monthlyTrend).toFixed(1)}% higher than last month`
            : `${Math.abs(monthlyTrend).toFixed(1)}% lower than last month`;
    }

    const getObservation = () => {
        if (expenses.length === 0) return "Not enough data to form an observation.";
        if (savingsRate < 0) return "Warning: You are currently spending more than your recorded overall income.";
        if (monthlyTrend > 20) return `Watch out! Your spending has increased significantly (${Math.abs(monthlyTrend).toFixed(1)}%) compared to last month.`;
        if (monthlyTrend < 0) return `Great job! You reduced your expenses this month. You are currently spending most heavily on ${highestCategory}.`;
        if (savingsRate > 50) return `Excellent! You are saving over 50% of your total income. Keep an eye on ${highestCategory} to optimize further.`;
        return `Your spending patterns are stable. Your primary expense is ${highestCategory}.`;
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
                        <h3>Highest Spending Category</h3>
                        <p className="insight-value">{highestCategory}</p>
                        <p className="insight-subtext">${highestAmount.toFixed(2)} total all-time</p>
                    </div>
                </div>

                <div className="card insight-card">
                    <div className="insight-icon">📅</div>
                    <div className="insight-content">
                        <h3>Monthly Comparison</h3>
                        <p className={`insight-value ${isTrendPositive ? 'trend-good' : 'trend-bad'}`}>
                            ${currentMonthExpense.toFixed(2)}
                        </p>
                        <p className="insight-subtext">{trendText}</p>
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