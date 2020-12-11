import React, { useState, useEffect } from 'react';
import axios from 'axios';

import ShirtListPage from './components/ShirtListPage'
import JacketListPage from './components/JacketListPage';
import AccessoryListPage from './components/AccessoryListPage';


const App = (props) => {
  const [shirts, setShirts] = useState([]);
  const [jackets, setJackets] = useState([]);
  const [accessories, setAccessories] = useState([]);

  const [doneLoadingShirts, setDoneLoadingShirts] = useState(false);
  const [doneLoadingJackets, setDoneLoadingJackets] = useState(false);
  const [doneLoadingAccessories, setDoneLoadingAccessories] = useState(false);

  const [updateAvailability, setUpdateAvailability] = useState(false);
  const [doneLoading, setDoneLoading] = useState(false);

  const [maxLoadingCounter, setMaxLoadingCounter] = useState(1);
  const [loadingCounter, setLoadingCounter] = useState(0);

  const [currentTabIndex, setCurrentTabIndex] = useState(0);


  useEffect(() => {

    const fetchProducts = (infoString, urlString, setProductsFunction, setDoneFunction) => {
      console.log(infoString);
      axios
        .get(urlString)
        .then(response => {
          console.log(`${infoString} promise fulfilled`);
          console.log(response);

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
          setDoneFunction(true);
        }).catch(error => {
          console.log(error);
        });
    }

    fetchProducts(
      'Fetching shirts',
      'https://bad-api-assignment.reaktor.com/products/shirts',
      setShirts,
      setDoneLoadingShirts,
    )

    fetchProducts(
      'Fetching jackets',
      'https://bad-api-assignment.reaktor.com/products/jackets',
      setJackets,
      setDoneLoadingJackets,
    )

    fetchProducts(
      'Fetching accessories',
      'https://bad-api-assignment.reaktor.com/products/shirts',
      setAccessories,
      setDoneLoadingAccessories,
    )

    // axios
    //   .get('https://bad-api-assignment.reaktor.com/products/accessories', {
    //     headers: {
    //       'x-force-error-mode': 'all'
    //     }
    //   }).then(response => {
    //     console.log("Axios with extra request header");
    //     console.log(response);
    //   }).catch(error => {
    //     console.log("ERROR");
    //   })
  }, [])


  useEffect(() => {

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


    const updateProductAvailability = (products, manufacturers, setFunction) => {

      const { shirts, jackets, accessories } = products;

      var shirtMap = productListToMap(shirts);
      var jacketMap = productListToMap(jackets);
      var accessoryMap = productListToMap(accessories);

      manufacturers.forEach(manufacturer => {
        axios
          .get(`https://bad-api-assignment.reaktor.com/availability/${manufacturer}`)
          .then(response => {
            console.log('get availability promise fulfilled');

            var values = response.data.response;

            // Don't process the response if it is empty
            if (values === undefined || values.length === 0) {
              setLoadingCounter(prev => prev + 1)
              return;
            }

            values.forEach(value => {
              const id = value.id.toLowerCase();
              const payload = prepareAvailibilityPayload(value.DATAPAYLOAD);

              if (shirtMap[id]) {
                shirtMap[id].availability = payload;
              }
              if (jacketMap[id]) {
                jacketMap[id].availability = payload;
              }
              if (accessoryMap[id]) {
                accessoryMap[id].availability = payload;
              }
            })

            updateProductState(shirtMap, shirts, setShirts);
            updateProductState(jacketMap, jackets, setJackets);
            updateProductState(accessoryMap, accessories, setAccessories);

            setLoadingCounter(prev => prev + 1);

          }).catch(error => {
            console.log(error);
          });
      });
    }

    if (updateAvailability) {
      console.log("Update availability")
      const products = shirts.concat(jackets, accessories);
      const manufacturers = getUniqueManufacturers(products);
      console.log(manufacturers);

      setMaxLoadingCounter(manufacturers.length);

      updateProductAvailability({ shirts, jackets, accessories }, manufacturers, setShirts);
    }

  }, [updateAvailability]);


  // Check if the "updateProductAvailability" function has applied all the
  // availability data to the products.
  //    3 comes from the three calls to the function.
  if (loadingCounter === maxLoadingCounter) {
    setDoneLoading(true);
    setLoadingCounter(0);
    setMaxLoadingCounter(1);
  }


  // Synchronize the data loading to access the "availability API" just once
  if (doneLoadingShirts && doneLoadingJackets && doneLoadingAccessories && !updateAvailability) {
    setUpdateAvailability(true);
  }


  const renderTabs = () => {
    if (currentTabIndex === 0) {
      return <ShirtListPage shirts={shirts} />
    } else if (currentTabIndex === 1) {
      return <JacketListPage jackets={jackets} />
    } else {
      return <AccessoryListPage accessories={accessories} />;
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        Software for accessing product and availability info.
        <div>
          {(doneLoadingShirts) ? "Shirts loaded" : "Loading shirts"}
        </div>
        <div>
          {(doneLoadingJackets) ? "Jackets loaded" : "Loading jackets"}
        </div>
        <div>
          {(doneLoadingAccessories) ? "Accessories loaded" : "Loading accessories"}
        </div>
        <div>
          {(doneLoading) ? "Everything loaded" : `Loading availability data: ${loadingCounter / maxLoadingCounter * 100} %`}
        </div>
        <div>
          <button onClick={() => { setCurrentTabIndex(0) }}>Shirts</button>
          <button onClick={() => { setCurrentTabIndex(1) }}>Jackets</button>
          <button onClick={() => { setCurrentTabIndex(2) }}>Accessories</button>
        </div>
      </header>
      <div>
        {renderTabs()}
      </div>
    </div>
  );
}

export default App;
