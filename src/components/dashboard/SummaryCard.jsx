export default function SummaryCard({ title, amount, type = 'default' }) {
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);

    return (
        <div className="card summary-card">
            <h3 className="summary-title">{title}</h3>
            <p className={`summary-amount ${type}`}>{formattedAmount}</p>
        </div>
    );
}