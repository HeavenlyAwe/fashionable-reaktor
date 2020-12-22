import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';

import ProductListPage from './components/ProductListPage';


const App = (props) => {
  const [products, setProducts] = useState([])
  const [currentTabIndex, setCurrentTabIndex] = useState(0);


  const getUniqueManufacturers = (products) => {
    return [...new Set(products.map(product => product.manufacturer))];
  }

  // TODO: use a dom parser!
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

  const setAvailabilityValues = (productMap, products) => {
    let newProducts = [...products];
    newProducts.forEach(product => {
      if (productMap[product.id].availability !== '[Waiting for update]') {
        product.availability = productMap[product.id].availability
      }
    });
    return newProducts
  }


  const updateProductAvailability = async (products) => {

    const manufacturers = getUniqueManufacturers(products);

    // Use a faster data structure for mapping data between the APIs
    var productsMap = productListToMap(products);
    console.log(productsMap)

    // Fetch the availability data
    const requests = manufacturers.map(manufacturer => {
      return axios.get(`https://bad-api-assignment.reaktor.com/availability/${manufacturer}`)
    })
    const responses = await axios.all(requests)

    // Use the availability data
    responses.forEach(response => {
      var values = response.data.response;
      console.log(values)
      // Something went wrong if the response is empty.
      if (values === undefined || values.length === 0 || values === '[]') {
        Object.keys(productsMap).forEach(key => {
          productsMap[key].availability = 'Failed to load the availibility data, please try again!';
        });
      } else {
        values.forEach(value => {
          const id = value.id.toLowerCase();
          const payload = prepareAvailibilityPayload(value.DATAPAYLOAD);

          if (productsMap[id]) {
            productsMap[id].availability = payload;
          }
        });
      }
    })

    const newProducts = setAvailabilityValues(productsMap, products);
    return newProducts;

    //   const { shirts, jackets, accessories } = products;

    //   // Use maps to have fast access to the underlying object when updating availability
    //   var shirtMap = productListToMap(shirts);
    //   var jacketMap = productListToMap(jackets);
    //   var accessoryMap = productListToMap(accessories);

    //   setLoadingProgress({
    //     progress: 0,
    //     maxProgress: manufacturers.length,
    //   })

    //   // Sometimes the response of the axios GET request is empty. This will prevent
    //   // the system from properly setting the availability data, but the user can
    //   // manually request an update for the data.
    //   //
    //   // The server API uses a CORSS setup and doesn't handle the pre-request OPTION
    //   // call properly, and hence the axios GET requests will be executed twice. If the
    //   // second request returns an empty response, the availability data will be null.
    //   //
    //   // As the API can't be changed, I just let it happen twice and allow the user
    //   // to manually refresh the availibity data when needed.
    //   manufacturers.forEach(manufacturer => {
    //     axios
    //       .get(`https://bad-api-assignment.reaktor.com/availability/${manufacturer}`)
    //       .then(response => {
    //         var values = response.data.response;

    //         // Something went wrong if the response is empty.
    //         if (values === undefined || values.length === 0 || values === '[]') {
    //           [shirtMap, jacketMap, accessoryMap].forEach(m => {
    //             Object.keys(m).forEach(key => {
    //               if (m[key].manufacturer === manufacturer) {
    //                 m[key].availability = 'Failed to load the availibility data, please try again!';
    //               }
    //             });
    //           });
    //         } else {
    //           values.forEach(value => {
    //             const id = value.id.toLowerCase();
    //             const payload = prepareAvailibilityPayload(value.DATAPAYLOAD);

    //             [shirtMap, jacketMap, accessoryMap].forEach(m => {
    //               if (m[id]) {
    //                 m[id].availability = payload;
    //               }
    //             });
    //           })
    //         }

    //         updateProductState(shirtMap, shirts, setShirts);
    //         updateProductState(jacketMap, jackets, setJackets);
    //         updateProductState(accessoryMap, accessories, setAccessories);

    //         setLoadingProgress(prev => ({
    //           ...prev,
    //           progress: prev.progress + 1,
    //         }));

    //       }).catch(error => {
    //         console.log(error);
    //       });
    //   });
  }

  const fetchAvailibilityData = async (products) => {
    // // This should be run first after all the data sets have been loaded
    // const products = shirts.concat(jackets, accessories);
    return await updateProductAvailability(products);
  };



  const prepareProducts = (products) => {
    var newProducts = products.map(product => {
      return {
        ...product,
        availability: "[Waiting for update]",
      }
    })
    return newProducts
  };


  // Load the 
  useEffect(() => {

    const fetchProducts = async () => {

      // Fetch the data through the API
      const requestShirts = axios.get('https://bad-api-assignment.reaktor.com/products/shirts')
      const requestJackets = axios.get('https://bad-api-assignment.reaktor.com/products/jackets')
      const requestAccessories = axios.get('https://bad-api-assignment.reaktor.com/products/accessories')
      const responses = await axios.all([requestShirts, requestJackets, requestAccessories])

      const shirts = responses[0].data;
      const jackets = responses[1].data;
      const accessories = responses[2].data;
      var products = prepareProducts(shirts.concat(jackets, accessories));
      products = await fetchAvailibilityData(products);
      console.log(products)
      setProducts(products);
    }

    fetchProducts();
  }, [])


  // Rendering functions here below

  const renderLoadingInformation = () => {
    return (
      <div className="loading-wrapper">
        <button onClick={() => { fetchAvailibilityData() }}>Reload Availability</button>
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
