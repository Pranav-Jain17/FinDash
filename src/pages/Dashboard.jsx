import { useAppContext } from '../context/AppContext';
import SummaryCard from '../components/dashboard/SummaryCard';
import './dashboard.css';

export default function Dashboard() {
    const { transactions, isLoading } = useAppContext();

    if (isLoading) {
        return (
            <div className="loading-container fade-in">
                <div className="spinner"></div>
            </div>
        );
    }

    const totalIncome = transactions
        .filter((t) => t.type === 'Income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter((t) => t.type === 'Expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = totalIncome - totalExpense;

    const categoryData = transactions
        .filter((t) => t.type === 'Expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

    const maxCategoryAmount = Math.max(...Object.values(categoryData), 1);

    return (
        <div className="dashboard-page fade-in">
            <header className="page-header">
                <h1>Dashboard Overview</h1>
                <p>Welcome back! Here is your financial summary.</p>
            </header>

            <section className="dashboard-grid slide-up">
                <SummaryCard title="Total Balance" amount={totalBalance} />
                <SummaryCard title="Total Income" amount={totalIncome} type="income" />
                <SummaryCard title="Total Expenses" amount={totalExpense} type="expense" />
            </section>

            <section className="charts-grid slide-up">
                <div className="card chart-card">
                    <h2>Recent Activity</h2>
                    <div className="css-bar-chart">
                        {transactions.slice(-5).map((t) => (
                            <div key={t.id} className="bar-column">
                                <div
                                    className={`bar ${t.type.toLowerCase()}`}
                                    style={{ height: `${(t.amount / Math.max(totalIncome, totalExpense, 1)) * 100}%` }}
                                >
                                    <span className="tooltip">${t.amount}</span>
                                </div>
                                <span className="bar-label">{new Date(t.date).getDate()}</span>
                            </div>
                        ))}
                        {transactions.length === 0 && <p className="empty-msg">No activity yet.</p>}
                    </div>
                </div>

                <div className="card chart-card">
                    <h2>Spending Breakdown</h2>
                    <div className="category-list">
                        {Object.entries(categoryData).map(([category, amount]) => (
                            <div key={category} className="category-item">
                                <div className="category-info">
                                    <span>{category}</span>
                                    <span>${amount}</span>
                                </div>
                                <div className="progress-track">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${(amount / maxCategoryAmount) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {Object.keys(categoryData).length === 0 && (
                            <p className="empty-msg">No expenses to show yet.</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}