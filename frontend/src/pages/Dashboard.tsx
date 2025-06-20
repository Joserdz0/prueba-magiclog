import React, { useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter, numberFilter } from 'react-bootstrap-table2-filter';
import { getMyProducts, getAdminProducts } from '../api/products';
import axios from '../api/axios';

type Product = {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  seller?: { email: string }; // Solo visible para admin
};

const ProductsTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Extrae rol desde el token o localStorage (ajusta según tu lógica real)
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const userRole = payload.role;
    setRole(userRole);

    // Lógica según el rol
    const fetchData = async () => {
      try {
        if (userRole === 'SELLER') {
          const res = await getMyProducts();
          setProducts(res.data);
        } else if (userRole === 'ADMIN') {
          const res = await getAdminProducts(); // puedes pasar sellerId si lo necesitas
          setProducts(res.data);
        } else {
          const res = await axios.get('/products/admin'); // mismo endpoint que admin pero sin filtro
          setProducts(res.data);
        }
      } catch (err) {
        console.error('Error al obtener productos', err);
      }
    };

    fetchData();
  }, []);

  const columns: any[] = [
    {
      dataField: 'name',
      text: 'Nombre',
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: 'sku',
      text: 'SKU',
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: 'quantity',
      text: 'Cantidad',
      sort: true,
    },
    {
      dataField: 'price',
      text: 'Precio',
      sort: true,
      filter: numberFilter({ comparatorStyle: { width: '100%' } }),
    },
  ];

  if (role === 'ADMIN') {
    columns.push({
      dataField: 'seller.email',
      text: 'Vendedor',
      sort: true,
      filter: textFilter(),
    });
  }

  return (
    <div className="mt-4">
      <h4>Lista de Productos</h4>
      <BootstrapTable
        keyField="id"
        data={products}
        columns={columns}
        pagination={paginationFactory({ sizePerPage: 5 })}
        filter={filterFactory()}
        bootstrap4
        striped
        hover
        condensed
      />
    </div>
  );
};

export default ProductsTable;
