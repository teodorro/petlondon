import './App.css';
import { Route, Routes } from 'react-router-dom';
import MapPage from './pages/MapPage';
import { MainLayout } from './layout/MainLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<MapPage />} />
      </Route>
    </Routes>
  );
}

export default App;
