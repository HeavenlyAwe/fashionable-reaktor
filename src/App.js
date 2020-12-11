import React, { useState, useEffect } from 'react';
import axios from 'axios';

import ShirtListPage from './components/ShirtListPage'
import JacketListPage from './components/JacketListPage';


const App = (props) => {
  const [shirts, setShirts] = useState([]);
  const [doneLoadingShirts, setDoneLoadingShirts] = useState(false);

  const [jackets, setJackets] = useState([]);
  const [doneLoadingJackets, setDoneLoadingJackets] = useState(false);

  const [accessories, setAccessories] = useState([]);
  const [doneLoadingAccessories, setDoneLoadingAccessories] = useState(false);

  const [updateAvailability, setUpdateAvailability] = useState(false);

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

    const updateProductAvailability = (products, manufacturers, setFunction) => {

      var productMap = productListToMap(products);

      manufacturers.forEach(manufacturer => {
        axios
          .get(`https://bad-api-assignment.reaktor.com/availability/${manufacturer}`)
          .then(response => {
            console.log('get availability promise fulfilled');

            var values = response.data.response;

            // Don't process the response if it is empty
            if (values.length === 0) {
              return;
            }

            values.forEach(value => {
              const id = value.id.toLowerCase();
              const payload = prepareAvailibilityPayload(value.DATAPAYLOAD);

              if (productMap[id]) {
                productMap[id].availability = payload;
              }
            })

            let newProducts = [...products];
            newProducts.forEach(product => {
              if (productMap[product.id].availability !== '[Waiting for update]') {
                product.availability = productMap[product.id].availability
              }
            });

            setFunction(newProducts);

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

      updateProductAvailability(shirts, manufacturers, setShirts);
      updateProductAvailability(jackets, manufacturers, setJackets);
      updateProductAvailability(accessories, manufacturers, setAccessories);
    }

  }, [updateAvailability]);


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
      return null;
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
