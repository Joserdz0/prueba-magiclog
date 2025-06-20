import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoginModal from './pages/LoginModal'; // Ajusta la ruta según tu estructura
import RegisterModal from './pages/RegisterModal';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('email');
    const storedRole = localStorage.getItem('role');

    if (token && storedEmail && storedRole) {
      setEmail(storedEmail);
      setRole(storedRole);
      setIsLoggedIn(true);
    } else {
      setEmail(null);
      setRole(null);
      setIsLoggedIn(false);
    }
  }, [location, showLoginModal, showRegisterModal]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    setEmail(null);
    setRole(null);
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div>
      {/* Modales */}
      <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <RegisterModal show={showRegisterModal} onClose={() => setShowRegisterModal(false)} />

      <header id="header" className="header fixed-top d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-between">
          <Link to="/" className="logo d-flex align-items-center">
            <img src="./logo.png" alt="logo" />
            <span className="d-none d-lg-block">MagicLog</span>
          </Link>
          <i
            className="bi bi-list toggle-sidebar-btn"
            onClick={() => document.body.classList.toggle('toggle-sidebar')}
            style={{ cursor: 'pointer' }}
          ></i>
        </div>

        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">
            <li className="nav-item dropdown pe-3">
              <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
                <img src="https://cdn-icons-png.flaticon.com/512/1705/1705634.png" alt="Profile" className="rounded-circle" />
                <span className="d-none d-md-block dropdown-toggle ps-2">{email || 'ANÓNIMO'}</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li className="dropdown-header">
                  <h6>{email || 'ANÓNIMO'}</h6>
                  <span>{role || 'Sin rol'}</span>
                </li>
                <li><hr className="dropdown-divider" /></li>

                {isLoggedIn ? (
                  <li>
                    <button className="dropdown-item d-flex align-items-center" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right"></i>
                      <span>Cerrar sesión</span>
                    </button>
                  </li>
                ) : (
                  <>
                    <li>
                      <button className="dropdown-item d-flex align-items-center" onClick={() => setShowLoginModal(true)}>
                        <i className="bi bi-box-arrow-in-right"></i>
                        <span>Iniciar sesión</span>
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item d-flex align-items-center" onClick={() => setShowRegisterModal(true)}>
                        <i className="bi bi-person-plus"></i>
                        <span>Registrarse</span>
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </li>
          </ul>
        </nav>
      </header>

      <aside id="sidebar" className="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              <i className="bi bi-grid"></i>
              <span>Dashboard</span>
            </Link>
          </li>

          {isLoggedIn && (
            <li className="nav-item">
              <Link className="nav-link collapsed" to="/cart">
                <i className="bi bi-cart"></i>
                <span>Carrito</span>
              </Link>
            </li>
          )}

          {(role === 'SELLER' || role === 'ADMIN') && (
            <li className="nav-item">
              <Link className="nav-link collapsed" to="/createProductForm">
                <i className="bi bi-box-seam"></i>
                <span>Ingresar productos</span>
              </Link>
            </li>
          )}

          {role === 'ADMIN' && (
            <li className="nav-item">
              <Link className="nav-link collapsed" to="/admin">
                <i className="bi bi-shield-lock"></i>
                <span>Admin Panel</span>
              </Link>
            </li>
          )}
        </ul>
      </aside>

      <main style={{ marginTop: '80px' }} id="main" className="main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
