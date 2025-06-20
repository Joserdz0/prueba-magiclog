import React, { useEffect, useState } from 'react';
import { getCart, removeFromCart } from '../api/cart';

interface CartItem {
  id: number;
  quantity: number;
  products: {
    name: string;
    price: string; // viene como string desde Prisma
    sku: string;
    id: number;
  };
}

const CartTable: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data);
    } catch (err) {
      console.error('Error al obtener el carrito', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await removeFromCart(id);
      setCart(cart.filter(item => item.id !== id));
    } catch (err) {
      alert('Error al eliminar del carrito');
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = Number(item.products.price);
      return total + price * item.quantity;
    }, 0);
  };

  if (loading) return <p>Cargando carrito...</p>;

  return (
    <div className="card mt-4">
      <div className="card-body pb-0">
        <h5 className="card-title">Tu Carrito</h5>

        {cart.length === 0 ? (
          <p>No tienes productos en el carrito.</p>
        ) : (
          <>
            <table className="table table-borderless">
              <thead>
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col">SKU</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Subtotal</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => {
                  const price = Number(item.products.price);
                  const subtotal = price * item.quantity;

                  return (
                    <tr key={item.id}>
                      <td>{item.products.name}</td>
                      <td>{item.products.sku}</td>
                      <td>${price.toFixed(2)}</td>
                      <td className="fw-bold">{item.quantity}</td>
                      <td>${subtotal.toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRemove(item.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="text-end pe-3 pb-3">
              <h5>Total: ${calculateTotal().toFixed(2)}</h5>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartTable;
