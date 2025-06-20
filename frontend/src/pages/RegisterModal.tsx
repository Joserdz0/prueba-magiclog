import React, { useState } from 'react';
import { register } from '../api/users';
import { login } from '../api/auth';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

interface RegisterModalProps {
  show: boolean;
  onClose: () => void;
}

type DecodedToken = {
  sub: number;
  username: string;
  role: 'ADMIN' | 'SELLER' | 'BUYER';
  exp: number;
};

const RegisterModal: React.FC<RegisterModalProps> = ({ show, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      // 1. Registrar usuario
      await register(email, password, confirmPassword);

      // 2. Iniciar sesión automáticamente
      const res = await login(email, password);
      const token = res.data.access_token;
      localStorage.setItem('token', token);

      const decoded: DecodedToken = jwtDecode(token);
      localStorage.setItem('email', decoded.username);
      localStorage.setItem('role', decoded.role);

      // 3. Cerrar modal y redirigir
      onClose();
      navigate('/');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Error al registrar');
    }
  };

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Registrarse</h5>
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
              <div className="mb-3">
                <label className="form-label">Confirmar Contraseña</label>
                <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
            </div>
            <div className="modal-footer">
              <button type="reset" className="btn btn-secondary" onClick={() => {
                setEmail(''); setPassword(''); setConfirmPassword('');
              }}>Limpiar</button>
              <button type="submit" className="btn btn-success">Registrarse</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
