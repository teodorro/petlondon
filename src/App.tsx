import './App.css';
import { Route, Routes } from 'react-router-dom';
import OpenLayersPage from './pages/OpenLayersPage';
import { MainLayout } from './layout/MainLayout';
import D3Page from './pages/D3Page';
import AgGridPage from './pages/AgGridPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<OpenLayersPage />} />
          <Route path="openlayers" element={<OpenLayersPage />} />
          <Route path="d3" element={<D3Page />} />
          <Route path="aggrid" element={<AgGridPage />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
