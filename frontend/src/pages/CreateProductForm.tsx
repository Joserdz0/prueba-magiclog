import React, { useState } from 'react';
import { createProduct } from '../api/products';

const CreateProductForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    quantity: '',
    price: '',
  });

  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    try {
      await createProduct({
        name: formData.name,
        sku: formData.sku,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
      });

      alert('Producto creado con éxito');
      setFormData({ name: '', sku: '', quantity: '', price: '' });
    } catch (err: any) {
      if (err.response?.data?.message) {
        const messages = Array.isArray(err.response.data.message)
          ? err.response.data.message
          : [err.response.data.message];
        setErrors(messages);
      } else {
        setErrors(['Error desconocido al crear producto.']);
      }
    }
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Registrar Producto</h5>

        {/* Mostrar errores si hay */}
        {errors.length > 0 && (
          <div className="alert alert-danger">
            <ul className="mb-0">
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-12">
            <label htmlFor="inputName" className="form-label">Nombre del Producto</label>
            <input type="text" className="form-control" id="inputName" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label htmlFor="inputSku" className="form-label">SKU</label>
            <input type="text" className="form-control" id="inputSku" name="sku" value={formData.sku} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <label htmlFor="inputQuantity" className="form-label">Cantidad</label>
            <input type="number" className="form-control" id="inputQuantity" name="quantity" value={formData.quantity} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <label htmlFor="inputPrice" className="form-label">Precio</label>
            <input type="number" step="0.01" className="form-control" id="inputPrice" name="price" value={formData.price} onChange={handleChange} required />
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary">Registrar</button>
            <button type="reset" className="btn btn-secondary ms-2" onClick={() => setFormData({ name: '', sku: '', quantity: '', price: '' })}>Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductForm;
