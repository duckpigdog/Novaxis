import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import CTF from '@/pages/CTF';
import AWD from '@/pages/AWD';
import Home from '@/pages/Home';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/ctf/misc/image-stego" replace />} />
          <Route path="/ctf" element={<Navigate to="/ctf/misc/image-stego" replace />} />
          <Route path="/ctf/:category" element={<Navigate to="/ctf/misc/image-stego" replace />} />
          <Route path="/ctf/:category/:subcategory" element={<CTF />} />
          <Route path="/awd" element={<AWD />} />
          {/* Add more routes as needed */}
          <Route path="*" element={<Navigate to="/ctf/misc/image-stego" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
