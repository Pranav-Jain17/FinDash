# FinDash - Personal Finance Dashboard

FinDash is a responsive, modern front-end web application built to help users track their finances, visualize their spending, and gain actionable insights. It features simulated Role-Based Access Control (RBAC), data persistence, a mock API for simulated network requests, and custom CSS-only visualizations.

## 🚀 Features

**Core Requirements Implemented:**
* **Dashboard Overview:** Displays total balance, income, and expenses using summary cards. Includes pure CSS time-based (recent activity bar chart) and categorical (spending breakdown progress bars) visualizations.
* **Transactions Management:** A sortable, filterable list of transactions. Admins can add, edit, and delete transactions.
* **Role-Based UI (RBAC):** Simulated user roles (`Admin` and `Viewer`). Viewers are restricted to read-only access, while Admins unlock form controls to modify data.
* **Smart Insights:** Automatically calculates the highest spending category, month-over-month comparisons, and generates a dynamic "smart observation" based on the user's savings rate and spending trends.

**Advanced Enhancements Included:**
* **Mock API Integration:** Simulates network latency and asynchronous data fetching with global loading states and UI feedback (spinners, disabled controls).
* **Dark Mode:** System-wide dark/light theme toggle using CSS variables.
* **Data Persistence:** Transactions and theme preferences are saved to the browser's `localStorage` so data remains between page reloads.
* **CSV Export:** Users can download their filtered transaction history as a `.csv` file.
* **Responsive Design:** Fully mobile-responsive layout utilizing CSS Grid and Flexbox, complete with a collapsible sidebar layout for smaller screens.

---

## 🛠️ Tech Stack

* **Framework:** React 18
* **Routing:** React Router v6
* **Styling:** Vanilla CSS (CSS3 Variables, Flexbox, Grid)
* **State Management:** React Context API
* **Icons/Charts:** 100% Pure CSS and Emojis (Zero external heavy dependencies like Chart.js or FontAwesome)

---

## 📦 Setup and Installation

This project requires [Node.js](https://nodejs.org/) to be installed on your machine.

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd <your-project-folder>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # Install react-router-dom if not already in package.json
   npm install react-router-dom
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or 'npm start' if using Create React App
   ```

4. **Open the app:**
   Open your browser and navigate to `http://localhost:5173` (or the port provided in your terminal).

---

## 🏗️ Overview of Approach

### Architecture & Folder Structure
The application follows a standard feature-based React structure. Global UI components (like the Sidebar and Header) wrap the main layout, while domain-specific pages (`Dashboard.jsx`, `Transactions.jsx`, `Insights.jsx`) act as containers for their respective logic and presentation.

### State Management
Instead of introducing heavy libraries like Redux, this project utilizes the **React Context API** (`AppContext.jsx`). It centralizes the global state for:
1. `transactions`: The array of financial data.
2. `isLoading`: Tracks the status of the mock API network requests.
3. `role`: The current active role (Viewer/Admin).
4. `theme`: The current UI theme (Light/Dark).

### Styling Strategy
The UI was built strictly with plain CSS to demonstrate a strong command of modern CSS architecture. 
* A central "Design System" of **CSS Variables** is defined in `App.css`. 
* Dark mode is achieved simply by toggling a `.dark` class on the `<body>` element, which overrides the root CSS color variables.
* Visualizations (bar charts and progress bars) are built without canvas or SVG libraries. They use inline style percentages calculated from the transaction data to render standard `<div>` elements as charts.

---

## 🔍 Explanation of Features

### 1. Simulated Role-Based Access Control (RBAC)
A dropdown in the global header allows the user to switch between `Viewer` and `Admin`. When set to `Viewer`, conditional rendering in `Transactions.jsx` completely removes the "Add Transaction" form, the "Edit/Delete" action buttons in the table, and the action column header.

### 2. Data Persistence
The `AppContext` initializes its state by checking `localStorage` first. A `useEffect` hook listens for any changes to the `transactions` array or `theme` string. If a user adds an expense, the effect fires and stringifies the updated array back into `localStorage`, ensuring data survives a hard refresh.

### 3. Dynamic Insights Generation
The `Insights.jsx` component uses array `reduce` and `filter` methods to aggregate data on the fly. It calculates a "savings rate" by comparing total income to total expenses. A cascading `if/else` logic block evaluates this rate alongside month-over-month spending changes to generate a dynamic string (the "Smart Observation"), giving the user immediate, readable feedback on their financial health.

### 4. CSS-Only Bar Chart
In the Dashboard, the recent activity chart slices the last 5 transactions. It finds the maximum total value (either total income or total expense) to establish a 100% ceiling. It then calculates the height of each bar using `(amount / maximumValue) * 100%` and applies it via an inline React style to a styled CSS block, creating a lightweight, responsive bar chart.

### 5. Mock API Simulation
To mimic a real-world full-stack application, the app includes a frontend-only Mock API. All CRUD operations (create, read, update, delete) in the `AppContext` are asynchronous functions wrapped with an artificial delay (latency). A global `isLoading` state triggers CSS spinners, dims the UI, and disables form inputs and action buttons while "network requests" are processing, preventing race conditions and enhancing the user experience.
