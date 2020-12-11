import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';

import ProductListPage from './components/ProductListPage';


const App = (props) => {
  const [shirts, setShirts] = useState([]);
  const [jackets, setJackets] = useState([]);
  const [accessories, setAccessories] = useState([]);

  const [updateAvailability, setUpdateAvailability] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState({ progress: 0, maxProgress: 100 });

  const [currentTabIndex, setCurrentTabIndex] = useState(0);


  useEffect(() => {

    const fetchProducts = (urlString, setProductsFunction) => {
      axios
        .get(urlString, {
          // headers: {
          //   'x-force-error-mode': 'all'
          // }
        })
        .then(response => {
          var products = response.data;
          products = products.map(product => {
            return {
              ...product,
              availability: "[Waiting for update]",
            }
          })
          // const manufacturers = getUniqueManufacturers(products);
          // updateProductWithAvailability(products, manufacturers, setFunction)
          setProductsFunction(products);
        }).catch(error => {
          console.log(error);
        });
    }

    fetchProducts(
      'https://bad-api-assignment.reaktor.com/products/shirts',
      setShirts,
    )

    fetchProducts(
      'https://bad-api-assignment.reaktor.com/products/jackets',
      setJackets,
    )

    fetchProducts(
      'https://bad-api-assignment.reaktor.com/products/accessories',
      setAccessories,
    )
  }, [])


  const fetchAvailibilityData = () => {

    const getUniqueManufacturers = (products) => {
      return [...new Set(products.map(product => product.manufacturer))];
    }

    const prepareAvailibilityPayload = (payload) => {
      var output = payload.replace('<AVAILABILITY>', '');
      output = output.replace('</AVAILABILITY>', '');
      output = output.replace('<INSTOCKVALUE>', '');
      output = output.replace('</INSTOCKVALUE>', '');
      output = output.trim();
      return output;
    }

    const productListToMap = (products) => {
      return products.reduce((map, obj) => {
        map[obj.id.toLowerCase()] = obj;
        return map;
      }, {});
    };

    const updateProductState = (productMap, products, setFunction) => {
      let newProducts = [...products];
      newProducts.forEach(product => {
        if (productMap[product.id].availability !== '[Waiting for update]') {
          product.availability = productMap[product.id].availability
        }
      });
      setFunction(newProducts);
    }


    const updateProductAvailability = (products, manufacturers) => {

      const { shirts, jackets, accessories } = products;

      // Use maps to have fast access to the underling object
      var shirtMap = productListToMap(shirts);
      var jacketMap = productListToMap(jackets);
      var accessoryMap = productListToMap(accessories);

      setLoadingProgress({
        progress: 0,
        maxProgress: manufacturers.length,
      })

      manufacturers.forEach(manufacturer => {
        axios
          .get(`https://bad-api-assignment.reaktor.com/availability/${manufacturer}`)
          .then(response => {
            var values = response.data.response;

            // Something went wrong if the response is empty.
            if (values === undefined || values.length === 0 || values === '[]') {
              [shirtMap, jacketMap, accessoryMap].forEach(m => {
                Object.keys(m).forEach(key => {
                  if (m[key].manufacturer === manufacturer) {
                    m[key].availability = 'Failed to load the availibility data, try again later!'; // TODO: Requeue the loading of this manufacturer!
                  }
                });
              });
            } else {
              values.forEach(value => {
                const id = value.id.toLowerCase();
                const payload = prepareAvailibilityPayload(value.DATAPAYLOAD);

                [shirtMap, jacketMap, accessoryMap].forEach(m => {
                  if (m[id]) {
                    m[id].availability = payload;
                  }
                });
              })
            }

            updateProductState(shirtMap, shirts, setShirts);
            updateProductState(jacketMap, jackets, setJackets);
            updateProductState(accessoryMap, accessories, setAccessories);

            setLoadingProgress(prev => ({
              ...prev,
              progress: prev.progress + 1,
            }));

          }).catch(error => {
            console.log(error);
          });
      });
    }

    // This should be run first after all the data sets have been loaded
    const products = shirts.concat(jackets, accessories);
    const manufacturers = getUniqueManufacturers(products);
    updateProductAvailability({ shirts, jackets, accessories }, manufacturers);
  };


  // Synchronize the data loading to access the "availability API" only one time.
  if (updateAvailability) {
    var doneFetchingAll = true;
    [shirts, jackets, accessories].forEach(products => {
      doneFetchingAll = doneFetchingAll && (products.length > 0);
    });
    if (doneFetchingAll) {
      setUpdateAvailability(false);
      fetchAvailibilityData();
    };
  }


  const renderTabs = () => {
    switch (currentTabIndex) {
      case 0:
        return <ProductListPage titleText="Shirt list page" products={shirts} />
      case 1:
        return <ProductListPage titleText="Jacket list page" products={jackets} />
      case 2:
        return <ProductListPage titleText="Accessory list page" products={accessories} />
      default:
        return null;
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        Software for accessing product and availability info.
        <div>
          {(shirts.length > 0) ? "Shirts loaded" : "Loading shirts"}
        </div>
        <div>
          {(jackets.length > 0) ? "Jackets loaded" : "Loading jackets"}
        </div>
        <div>
          {(accessories.length > 0) ? "Accessories loaded" : "Loading accessories"}
        </div>
        <div>
          {(loadingProgress.progress >= loadingProgress.maxProgress) ? "Everything loaded" : `Loading availability data: ${loadingProgress.progress / loadingProgress.maxProgress * 100} %`}
        </div>
        <div>
          <button onClick={() => { setCurrentTabIndex(0) }}>Shirts</button>
          <button onClick={() => { setCurrentTabIndex(1) }}>Jackets</button>
          <button onClick={() => { setCurrentTabIndex(2) }}>Accessories</button>
          <button onClick={() => { setUpdateAvailability(true) }}>Reload Availability</button>
        </div>
      </header>
      <div>
        {renderTabs()}
      </div>
    </div>
  );
}

export default App;
