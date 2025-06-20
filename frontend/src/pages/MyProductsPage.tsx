import React, { useEffect, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table';
import { getMyProducts } from '../api/products';

type Product = {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
};

const columnHelper = createColumnHelper<Product>();

const MyProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMyProducts();
        setProducts(res.data);
      } catch (error) {
        console.error('Error al cargar tus productos:', error);
      }
    };

    fetchData();
  }, []);

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
  ];

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mt-4 table-responsive">
      <h3>Mis Productos Registrados</h3>

      <table className="table table-bordered mt-3 table-striped table-hover">
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
            <tr><td colSpan={columns.length}>No has registrado productos</td></tr>
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

export default MyProductsPage;
