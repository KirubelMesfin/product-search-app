'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';

type Product = {
  'Product Type': string;
  'Data Rate': string;
  'Form Factor': string;
  'Finished Good Part Number': string;
  Description: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [productTypeFilter, setProductTypeFilter] = useState('All');
  const [dataRateFilter, setDataRateFilter] = useState('All');
  const [formFactorFilter, setFormFactorFilter] = useState('All');

  useEffect(() => {
    const loadProducts = async () => {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(Array.isArray(data.products) ? data.products : []);
    };

    loadProducts();
  }, []);

  const productTypeOptions = ['All', ...new Set(products.map((p) => p['Product Type']))];
  const dataRateOptions = ['All', ...new Set(products.map((p) => p['Data Rate']))];
  const formFactorOptions = ['All', ...new Set(products.map((p) => p['Form Factor']))];

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product['Finished Good Part Number'].toLowerCase().includes(normalizedQuery) ||
        product.Description.toLowerCase().includes(normalizedQuery);

      return (
        (productTypeFilter === 'All' || product['Product Type'] === productTypeFilter) &&
        (dataRateFilter === 'All' || product['Data Rate'] === dataRateFilter) &&
        (formFactorFilter === 'All' || product['Form Factor'] === formFactorFilter) &&
        matchesQuery
      );
    });
  }, [products, query, productTypeFilter, dataRateFilter, formFactorFilter]);

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <main className="container">
      <h1>Product Search Tool</h1>
      <section className="controls">
        <input
          type="text"
          placeholder="Search by part number or description"
          value={query}
          onChange={onInputChange}
          aria-label="Search products"
          className="search-input"
        />

        <div className="filters-grid">
          <label>
            Product Type
            <select value={productTypeFilter} onChange={(event) => setProductTypeFilter(event.target.value)}>
              {productTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label>
            Data Rate
            <select value={dataRateFilter} onChange={(event) => setDataRateFilter(event.target.value)}>
              {dataRateOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label>
            Form Factor
            <select value={formFactorFilter} onChange={(event) => setFormFactorFilter(event.target.value)}>
              {formFactorOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section>
        <table>
          <thead>
            <tr>
              <th>Product Type</th>
              <th>Data Rate</th>
              <th>Form Factor</th>
              <th>Finished Good Part Number</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={`${product['Finished Good Part Number']}-${product.Description.slice(0, 12)}`}>
                <td>{product['Product Type']}</td>
                <td>{product['Data Rate']}</td>
                <td>{product['Form Factor']}</td>
                <td>{product['Finished Good Part Number']}</td>
                <td>{product.Description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && <p className="empty-state">No products match your search.</p>}
      </section>
    </main>
  );
}
