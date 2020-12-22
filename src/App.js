import React, { useState, useEffect } from 'react';

import { fetchProducts, fetchAvailability } from './api';

import './App.css';

import ProductListPage from './components/ProductListPage';


const App = (props) => {
  const [products, setProducts] = useState([])
  const [currentTabIndex, setCurrentTabIndex] = useState(0);


  useEffect(() => {
    const fetchData = async () => {
      const products = await fetchProducts([
        "shirts", "jackets", "accessories"
      ]);
      setProducts(products);
    };
    fetchData();
  }, [])


  // Rendering functions here below

  const renderLoadingInformation = () => {
    return (
      <div className="loading-wrapper">
        <button onClick={async () => {
          const newProducts = await fetchAvailability(products);
          setProducts(newProducts);
        }}>Reload Availability</button>
      </div>
    );
  }

  const renderCategoryMenu = () => {
    return (
      <div className="topnav">
        <div onClick={() => { setCurrentTabIndex(0) }}>Shirts</div>
        <div onClick={() => { setCurrentTabIndex(1) }}>Jackets</div>
        <div onClick={() => { setCurrentTabIndex(2) }}>Accessories</div>
      </div>
    );
  }

  const renderTabs = () => {
    switch (currentTabIndex) {
      case 0:
        return <ProductListPage titleText="Shirt list page" products={products.filter(product => product.type === "shirts")} />
      case 1:
        return <ProductListPage titleText="Jacket list page" products={products.filter(product => product.type === "jackets")} />
      case 2:
        return <ProductListPage titleText="Accessory list page" products={products.filter(product => product.type === "accessories")} />
      default:
        return null;
    }
  }

  // Render the main component
  return (
    <div className="App">
      <header className="App-header">
        {renderLoadingInformation()}
        {renderCategoryMenu()}
      </header>
      <div>
        {renderTabs()}
      </div>
    </div >
  );
}

export default App;
