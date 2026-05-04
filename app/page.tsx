'use client';

import { ChangeEvent, useMemo, useState } from 'react';

type Product = {
  sku: string;
  productName: string;
  productType: string;
  speed: string;
  cableType: string;
  length: string;
  oemCompatibility: string;
};

const products: Product[] = [
  {
    sku: 'CAB-1001',
    productName: 'UltraLink Cat6 Ethernet Cable',
    productType: 'Ethernet Cable',
    speed: '1 Gbps',
    cableType: 'Cat6',
    length: '3 ft',
    oemCompatibility: 'Cisco'
  },
  {
    sku: 'CAB-1002',
    productName: 'ProConnect Cat6a Ethernet Cable',
    productType: 'Ethernet Cable',
    speed: '10 Gbps',
    cableType: 'Cat6a',
    length: '6 ft',
    oemCompatibility: 'Juniper'
  },
  {
    sku: 'FIB-2001',
    productName: 'FiberMax OM4 LC-LC Duplex Cable',
    productType: 'Fiber Cable',
    speed: '40 Gbps',
    cableType: 'OM4',
    length: '10 m',
    oemCompatibility: 'Arista'
  },
  {
    sku: 'DAC-3001',
    productName: 'Twinax Passive DAC Cable',
    productType: 'DAC Cable',
    speed: '25 Gbps',
    cableType: 'Twinax',
    length: '2 m',
    oemCompatibility: 'Cisco'
  },
  {
    sku: 'AOC-4001',
    productName: 'Active Optical Cable AOC',
    productType: 'AOC Cable',
    speed: '100 Gbps',
    cableType: 'AOC',
    length: '20 m',
    oemCompatibility: 'NVIDIA'
  },
  {
    sku: 'FIB-2002',
    productName: 'FiberEdge OS2 LC-SC Simplex Cable',
    productType: 'Fiber Cable',
    speed: '10 Gbps',
    cableType: 'OS2',
    length: '15 m',
    oemCompatibility: 'HPE'
  }
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [productTypeFilter, setProductTypeFilter] = useState('All');
  const [speedFilter, setSpeedFilter] = useState('All');
  const [cableTypeFilter, setCableTypeFilter] = useState('All');
  const [oemFilter, setOemFilter] = useState('All');

  const productTypeOptions = ['All', ...new Set(products.map((p) => p.productType))];
  const speedOptions = ['All', ...new Set(products.map((p) => p.speed))];
  const cableTypeOptions = ['All', ...new Set(products.map((p) => p.cableType))];
  const oemOptions = ['All', ...new Set(products.map((p) => p.oemCompatibility))];

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product.sku.toLowerCase().includes(normalizedQuery) ||
        product.productName.toLowerCase().includes(normalizedQuery);

      const matchesProductType =
        productTypeFilter === 'All' || product.productType === productTypeFilter;
      const matchesSpeed = speedFilter === 'All' || product.speed === speedFilter;
      const matchesCableType = cableTypeFilter === 'All' || product.cableType === cableTypeFilter;
      const matchesOem = oemFilter === 'All' || product.oemCompatibility === oemFilter;

      return (
        matchesQuery &&
        matchesProductType &&
        matchesSpeed &&
        matchesCableType &&
        matchesOem
      );
    });
  }, [query, productTypeFilter, speedFilter, cableTypeFilter, oemFilter]);

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <main className="container">
      <h1>Product Search Tool</h1>

      <section className="controls">
        <input
          type="text"
          placeholder="Search by SKU or product name"
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
            Speed
            <select value={speedFilter} onChange={(event) => setSpeedFilter(event.target.value)}>
              {speedOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label>
            Cable Type
            <select value={cableTypeFilter} onChange={(event) => setCableTypeFilter(event.target.value)}>
              {cableTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label>
            OEM Compatibility
            <select value={oemFilter} onChange={(event) => setOemFilter(event.target.value)}>
              {oemOptions.map((option) => (
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
              <th>SKU</th>
              <th>Product Name</th>
              <th>Product Type</th>
              <th>Speed</th>
              <th>Cable Type</th>
              <th>Length</th>
              <th>OEM Compatibility</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.sku}>
                <td>{product.sku}</td>
                <td>{product.productName}</td>
                <td>{product.productType}</td>
                <td>{product.speed}</td>
                <td>{product.cableType}</td>
                <td>{product.length}</td>
                <td>{product.oemCompatibility}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && <p className="empty-state">No products match your search.</p>}
      </section>
    </main>
  );
}
