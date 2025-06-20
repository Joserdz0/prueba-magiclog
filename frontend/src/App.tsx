import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import CreateProductForm from './pages/CreateProductForm';
import CartTable from './pages/CartTable';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        {/* Rutas públicas aquí si las agregas más tarde */}

        {/* Rutas privadas con layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cart" element={<CartTable />} />
          <Route path="/createProductForm" element={<CreateProductForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
