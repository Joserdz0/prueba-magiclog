import React, { useState } from 'react';
import { login } from '../api/auth';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

type DecodedToken = {
  sub: number;
  username: string;
  role: 'ADMIN' | 'SELLER' | 'BUYER';
  exp: number;
};

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ show, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await login(email, password);
      const token = res.data.access_token;

      localStorage.setItem('token', token);

      const decoded: DecodedToken = jwtDecode(token);
      localStorage.setItem('role', decoded.role);
      localStorage.setItem('email', decoded.username);

      onClose(); // Cierra el modal
      navigate('/');
    } catch (error) {
      alert('Credenciales inválidas');
    }
  };

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Iniciar Sesión</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Correo</label>
                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
            <div className="modal-footer">
              <button type="reset" className="btn btn-secondary" onClick={() => { setEmail(''); setPassword(''); }}>Limpiar</button>
              <button type="submit" className="btn btn-primary">Ingresar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
