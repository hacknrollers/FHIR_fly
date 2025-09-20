# FHIR-fly - Terminology Management System

A comprehensive Next.js 14 frontend application for FHIR terminology management with NAMASTE and ICD-11 code mappings.

## 🚀 Features

### Core Pages
- **Login Page**: ABHA ID authentication with localStorage token management
- **Dashboard**: Overview with statistics cards and quick actions
- **Terminology Search**: Autocomplete search with NAMASTE and ICD-11 mappings
- **Problem List**: Editable table for managing patient problems
- **Analytics**: Interactive charts showing terminology usage patterns

### Key Components
- **SearchBox**: Reusable autocomplete component with real-time search
- **ProblemTable**: Editable table with inline editing capabilities
- **Charts**: Analytics visualization using Recharts
- **Layout**: Responsive sidebar navigation with mobile support

### Technology Stack
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **ShadCN UI** for component library
- **React Query** for API state management
- **Recharts** for data visualization
- **Lucide React** for icons

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fhir-fly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
fhir-fly/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── login/             # Login page
│   │   ├── dashboard/         # Dashboard page
│   │   ├── terminology/       # Terminology search page
│   │   ├── problems/          # Problem list page
│   │   ├── analytics/         # Analytics page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page (redirects)
│   ├── components/            # Reusable components
│   │   ├── ui/               # ShadCN UI components
│   │   ├── Layout.tsx        # Main layout with sidebar
│   │   ├── ProtectedRoute.tsx # Authentication guard
│   │   ├── SearchBox.tsx     # Autocomplete search
│   │   ├── ProblemTable.tsx  # Editable problem table
│   │   └── Charts.tsx        # Analytics charts
│   ├── contexts/             # React contexts
│   │   └── AuthContext.tsx   # Authentication context
│   └── lib/                  # Utilities and API
│       ├── api.ts            # API service layer
│       ├── providers.tsx     # React Query provider
│       └── utils.ts          # Utility functions
├── public/
│   └── dummy.json            # Dummy analytics data
└── README.md
```

## 🔌 API Integration

The application is designed for seamless backend integration. The API service layer (`src/lib/api.ts`) contains:

### Authentication
- `login(abhaId: string)` - User authentication
- `logout()` - User logout

### Terminology Search
- `searchTerminology(query: string)` - Search medical terms
- Returns: Term name, NAMASTE code, ICD-11 code, description

### Problem List Management
- `getProblemList()` - Fetch patient problems
- `addProblem(term: TerminologyResult)` - Add new problem
- `removeProblem(id: string)` - Remove problem

### Analytics
- `getAnalyticsData()` - Fetch usage statistics
- `getDashboardStats()` - Fetch dashboard metrics

### Backend Integration Points

The API functions are designed to match expected backend contracts:

```typescript
// Expected backend endpoints
GET  /api/auth/login
POST /api/auth/logout
GET  /api/terminology/search?query={text}
GET  /api/problem-list
POST /api/problem-list
DELETE /api/problem-list/:id
GET  /api/analytics/data
GET  /api/dashboard/stats
```

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with responsive layouts
- **Dark/Light Mode**: Consistent theming with Tailwind CSS
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: User-friendly error messages
- **Accessibility**: ARIA labels and keyboard navigation
- **Modern UI**: Clean, professional design with ShadCN components

## 🔐 Authentication Flow

1. User enters ABHA ID on login page
2. System validates and stores token in localStorage
3. Protected routes check authentication status
4. Logout clears token and redirects to login

## 📊 Demo Data

The application includes comprehensive dummy data:

- **Terminology**: 6+ medical terms with NAMASTE and ICD-11 mappings
- **Problem List**: Sample patient problems
- **Analytics**: Usage statistics and trends
- **Dashboard**: System metrics and health status

## 🚀 Getting Started

1. **Login**: Enter any ABHA ID to access the system
2. **Dashboard**: View system overview and quick actions
3. **Search**: Use terminology search to find medical terms
4. **Manage**: Add/remove problems from the problem list
5. **Analyze**: View usage analytics and trends

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Husky for git hooks (optional)

## 🌐 Deployment

The application is ready for deployment on:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Any Node.js hosting platform**

### Environment Variables

No environment variables are required for the current demo setup. For production:

```env
NEXT_PUBLIC_API_URL=your-backend-url
NEXT_PUBLIC_APP_NAME=FHIR-fly
```

## 🤝 Backend Integration

This frontend is designed to work seamlessly with:

- **Person A**: FastAPI backend development
- **Person B**: PostgreSQL database integration  
- **Person D**: FHIR compliance implementation

The API contracts are clearly defined and ready for backend implementation.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the excellent framework
- ShadCN UI for beautiful components
- React Query for state management
- Recharts for data visualization
- Tailwind CSS for utility-first styling