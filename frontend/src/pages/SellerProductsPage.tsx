import React, { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table';
import { getProductsBySellerEmail } from '../api/products';

type Product = {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
};

const columnHelper = createColumnHelper<Product>();

const SellerProductsPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    sku: '',
    minPrice: '',
    maxPrice: '',
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    if (!email) return alert('Debes ingresar un email');

    setLoading(true);
    try {
      const res = await getProductsBySellerEmail(email, filters);
      setProducts(res.data);
    } catch (error) {
      console.error(error);
      alert('Error al buscar productos del vendedor');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const columns: ColumnDef<Product, any>[] = [
    columnHelper.accessor('name', { header: 'Nombre', cell: info => info.getValue() }),
    columnHelper.accessor('sku', { header: 'SKU', cell: info => info.getValue() }),
    columnHelper.accessor('quantity', { header: 'Cantidad', cell: info => info.getValue() }),
    columnHelper.accessor('price', { header: 'Precio', cell: info => `$${info.getValue()}` }),
  ];

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mt-4">
      <h3>Productos por Email de Vendedor</h3>

      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <input
            type="email"
            className="form-control"
            placeholder="Email del vendedor"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={fetchProducts} disabled={loading}>
            {loading ? 'Cargando...' : 'Buscar'}
          </button>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            name="name"
            placeholder="Filtrar por nombre"
            value={filters.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            name="sku"
            placeholder="Filtrar por SKU"
            value={filters.sku}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            name="minPrice"
            placeholder="Precio mín."
            value={filters.minPrice}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            name="maxPrice"
            placeholder="Precio máx."
            value={filters.maxPrice}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <table className="table table-bordered">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>No hay productos para mostrar</td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
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

export default SellerProductsPage;
