import { Routes, Route, Link } from 'react-router-dom';
import { LeadDemoPage } from './pages/LeadDemoPage';

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div style={{ padding: '2rem' }}>
            <h1 style={{ marginTop: 0 }}>Demo</h1>
            <p>
              <Link to="/lead-demo">Lead-Modal Demo öffnen (/lead-demo)</Link>
            </p>
          </div>
        }
      />
      <Route path="/lead-demo" element={<LeadDemoPage />} />
    </Routes>
  );
}
