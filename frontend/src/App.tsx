import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import EventsPage from './pages/EventsPage';
import EventResultsPage from './pages/EventResultsPage';
// Phase 2: import ComingSoon from './components/ComingSoon';
import ErrorBoundary from './components/ErrorBoundary';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen">
            <Navigation />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventResultsPage />} />
              {/* Phase 2: Uncomment when ready
              <Route path="/athletes" element={<ComingSoon page="Athletes" />} />
              <Route path="/head-to-heads" element={<ComingSoon page="Head to Heads" />} />
              */}
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
