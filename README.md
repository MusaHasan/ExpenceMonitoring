# Expense Management Application

A modern, responsive expense management application built with Vue 3, TypeScript, and Vite. This application helps users track their expenses, manage budgets, and visualize their spending patterns through an intuitive dashboard.

## 🚀 Features

- **Dashboard Overview**: Visual representation of spending patterns with charts and progress bars
- **Budget Management**: Create and track multiple budgets with spending limits
- **Expense Tracking**: Add, edit, and categorize expenses with dates
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Live updates when adding or modifying expenses
- **Local Storage & API Support**: Flexible data persistence options
- **Modern UI**: Clean, intuitive interface with collapsible sidebar

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: Vue Router 4
- **Charts**: Chart.js
- **Styling**: CSS3 with modern design patterns
- **Mock API**: JSON Server for development

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)

You can check your Node.js version by running:

```bash
node --version
npm --version
```

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd ExpenceManagement
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

You have several options to run the application:

#### Option A: Run Frontend Only (with Local Storage)

```bash
npm run dev
```

This will start the Vue application on `http://localhost:5173`

#### Option B: Run with Mock API Server

```bash
npm run dev:all
```

This will start both the Vue application and the JSON Server API on port 3001

#### Option C: Run API Server Separately

```bash
# Terminal 1 - Start API server
npm run api

# Terminal 2 - Start Vue application
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
ExpenceManagement/
├── src/
│   ├── components/          # Reusable Vue components
│   │   ├── Dashboard.vue    # Main dashboard component
│   │   ├── ProgressBar.vue  # Progress bar component
│   │   └── Sidebar.vue      # Navigation sidebar
│   ├── pages/               # Page components
│   │   ├── Budgets.vue      # Budgets listing page
│   │   ├── BudgetDetails.vue # Individual budget details
│   │   └── Expenses.vue     # Expenses listing page
│   ├── composables/         # Vue 3 composables
│   │   ├── useBudgets.ts    # Budget management logic
│   │   └── useExpenses.ts   # Expense management logic
│   ├── services/            # Data layer
│   │   ├── budgets/         # Budget-related services
│   │   └── expenses/        # Expense-related services
│   ├── App.vue              # Root component
│   ├── main.ts              # Application entry point
│   ├── router.ts            # Vue Router configuration
│   └── styles.css           # Global styles
├── mock/
│   └── db.json              # Mock API data
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## 🎯 Usage Guide

### Dashboard

- View overall spending summary
- See budget progress with visual indicators
- Quick access to recent expenses

### Budgets

- View all created budgets
- See spending progress for each budget
- Click on a budget to view detailed breakdown

### Expenses

- Add new expenses with name, amount, and date
- View all expenses in a list format
- Edit or delete existing expenses

### Navigation

- Use the sidebar to navigate between different sections
- Toggle sidebar collapse/expand for more screen space
- Responsive design adapts to different screen sizes

## 🔧 Configuration

### API Configuration

The application supports both local storage and API modes:

- **Local Storage Mode**: Data persists in browser's local storage
- **API Mode**: Uses JSON Server for data persistence

### Port Configuration

- **Frontend**: Runs on port 5173 (configurable in `vite.config.ts`)
- **API Server**: Runs on port 3001 (configurable in `package.json`)

## 📊 Data Structure

### Budget Object

```typescript
{
  id: number;
  name: string;
  icon: string;
  total: number;
  spent: number;
  items: number;
}
```

### Expense Object

```typescript
{
  id: number;
  name: string;
  amount: number;
  date: string;
}
```

## 🚀 Deployment

# ExpenceManagement.Api

ASP.NET Core 9 Web API for Budgets and Expenses with EF Core (SQLite).

## Run

```bash
cd AspNetApi

dotnet build

dotnet run
```

Swagger UI: http://localhost:5000/swagger or http://localhost:8080/swagger (port varies)

## Endpoints

- Budgets: `GET/POST/PUT/DELETE /api/budgets`
- Expenses: `GET/POST/PUT/DELETE /api/expenses`

The app creates `expence.db` automatically on first run.

### Quick Deployment Options

#### Option 1: GitHub Pages (Recommended)

1. **Automatic Deployment** (using GitHub Actions):

   - Push your code to the `main` or `master` branch
   - The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically build and deploy
   - Go to your repository Settings → Pages → Set source to "GitHub Actions"

2. **Manual Deployment**:
   ```bash
   # Run the deployment script
   chmod +x deploy.sh
   ./deploy.sh
   ```

#### Option 2: Vercel (One-click deployment)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Or connect your GitHub repository to Vercel for automatic deployments

#### Option 3: Netlify

1. Drag and drop the `dist` folder to Netlify
2. Or connect your GitHub repository to Netlify
3. The `netlify.toml` file will configure the build settings automatically

#### Option 4: Manual Build

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Deployment Files Included

- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `deploy.sh` - Manual deployment script
- `vercel.json` - Vercel configuration
- `netlify.toml` - Netlify configuration

### Environment Variables

Currently, the application doesn't require environment variables, but you can add them in the `vite.config.ts` file if needed.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   # Kill process on port 5173
   npx kill-port 5173
   # Kill process on port 3001
   npx kill-port 3001
   ```

2. **Node Modules Issues**

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript Errors**
   ```bash
   npm run build
   # Check for any type errors in the output
   ```

### Getting Help

If you encounter any issues:

1. Check the browser console for errors
2. Ensure all dependencies are installed correctly
3. Verify that both frontend and API servers are running (if using API mode)
4. Check that the mock data in `mock/db.json` is properly formatted

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Happy Expense Tracking! 💰**
