import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';
import './App.css';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app-container">
          <aside className="sidebar">
            <div className="sidebar-brand">FinDash</div>
            <nav className="sidebar-nav">
              <ul>
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/transactions">Transactions</Link></li>
                <li><Link to="/insights">Insights</Link></li>
              </ul>
            </nav>
          </aside>

          <div className="content-wrapper">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/insights" element={<Insights />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}