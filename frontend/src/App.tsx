import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import EventsPage from './pages/EventsPage';
import EventResultsPage from './pages/EventResultsPage';

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
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen">
          <Navigation />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventResultsPage />} />
            {/* Placeholder routes for future pages */}
            <Route path="/athletes" element={<ComingSoon page="Athletes" />} />
            <Route path="/head-to-heads" element={<ComingSoon page="Head to Heads" />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

// Temporary Coming Soon component
function ComingSoon({ page }: { page: string }) {
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{page}</h1>
        <p className="text-gray-400 text-xl">Coming Soon</p>
      </div>
    </div>
  );
}

export default App;
