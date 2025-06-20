import React, { useEffect, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table';
import axios from '../api/axios';
import { addToCart } from '../api/cart';

type Product = {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
};

const columnHelper = createColumnHelper<Product>();

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    name: '',
    sku: '',
    minPrice: '',
    maxPrice: '',
  });

  const [quantities, setQuantities] = useState<Record<number, number>>({});

 

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await axios.get('/products/search', { params: filters });
      setProducts(res.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  fetchProducts();
}, [filters]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleQuantityChange = (productId: number, value: string) => {
    const quantity = parseInt(value, 10);
    if (!isNaN(quantity) && quantity >= 1) {
      setQuantities(prev => ({ ...prev, [productId]: quantity }));
    }
  };

  const handleAddToCart = async (productId: number) => {
    const quantity = quantities[productId] || 1;
    try {
      await addToCart({ productId, quantity });
      alert(`Añadido ${quantity} al carrito`);
    } catch (err) {
      console.error(err);
      alert('Error al añadir al carrito');
    }
  };

  const columns: ColumnDef<Product, any>[] = [
    columnHelper.accessor('name', {
      header: 'Nombre',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('sku', {
      header: 'SKU',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('quantity', {
      header: 'Cantidad',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('price', {
      header: 'Precio',
      cell: info => `$${info.getValue()}`,
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: info => {
        const product = info.row.original;
        const quantityValue = quantities[product.id] || 1;
        const isOutOfStock = product.quantity === 0;

        return (
          <div className="d-flex gap-2 align-items-center">
            <input
              type="number"
              min="1"
              max={product.quantity}
              value={quantityValue}
              onChange={(e) => handleQuantityChange(product.id, e.target.value)}
              className="form-control form-control-sm"
              style={{ width: '80px' }}
              disabled={isOutOfStock}
            />
            <button
              className="btn btn-sm btn-success"
              onClick={() => handleAddToCart(product.id)}
              disabled={isOutOfStock}
            >
              Añadir
            </button>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mt-4 table-responsive">
      <h3>Productos</h3>

      <div className="row g-3 mb-3">
        <div className="col-md-3">
          <input type="text" className="form-control" name="name" placeholder="Buscar por nombre" value={filters.name} onChange={handleInputChange} />
        </div>
        <div className="col-md-3">
          <input type="text" className="form-control" name="sku" placeholder="Buscar por SKU" value={filters.sku} onChange={handleInputChange} />
        </div>
        <div className="col-md-2">
          <input type="number" className="form-control" name="minPrice" placeholder="Precio mín." value={filters.minPrice} onChange={handleInputChange} />
        </div>
        <div className="col-md-2">
          <input type="number" className="form-control" name="maxPrice" placeholder="Precio máx." value={filters.maxPrice} onChange={handleInputChange} />
        </div>
      </div>

      <table className="table table-bordered table-hover table-striped">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr><td colSpan={columns.length}>No hay productos</td></tr>
          ) : (
            table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
