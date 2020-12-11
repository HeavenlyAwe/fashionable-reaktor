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


  useEffect(() => {

    // const getUniqueManufacturers = (products) => {
    //   return [...new Set(products.map(product => product.manufacturer))];
    // }

    // const prepareAvailibilityPayload = (payload) => {
    //   var output = payload.replace('<AVAILABILITY>', '');
    //   output = output.replace('</AVAILABILITY>', '');
    //   output = output.replace('<INSTOCKVALUE>', '');
    //   output = output.replace('</INSTOCKVALUE>', '');
    //   output = output.trim();
    //   return output;
    // }

    // const updateProductWithAvailability = (products, manufacturers, setFunction) => {
    //   console.log("Start manufacturer loop");
    //   manufacturers.forEach(manufacturer => {
    //     console.log(manufacturer);
    //     axios
    //       .get(`https://bad-api-assignment.reaktor.com/availability/${manufacturer}`)
    //       .then(response => {
    //         console.log('get availability promise fulfilled');
    //         // console.log(response);

    //         var values = response.data.response;

    //         // Don't process the response it is empty
    //         if (values.length === 0) {
    //           return;
    //         }

    //         var valueMap = values.reduce((map, obj) => {
    //           map[obj.id.toLowerCase()] = obj;
    //           return map;
    //         }, {});

    //         const newProducts = products.map(product => {
    //           return {
    //             ...product,
    //             availability: (product.manufacturer === manufacturer && valueMap[product.id])
    //               ? prepareAvailibilityPayload(valueMap[product.id].DATAPAYLOAD)
    //               : product.availability
    //           }
    //         });

    //         setFunction(newProducts);

    //       }).catch(error => {
    //         console.log(error);
    //       });
    //   });
    //   console.log("End manufacturer loop");
    // }

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

    // setShirts([]);
    // setJackets([]);
    // setAccessories([]);

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

    const updateProductWithAvailability = (products, manufacturers, setFunction) => {
      console.log("Start manufacturer loop");
      manufacturers.forEach(manufacturer => {
        console.log(manufacturer);
        axios
          .get(`https://bad-api-assignment.reaktor.com/availability/${manufacturer}`)
          .then(response => {
            console.log('get availability promise fulfilled');
            // console.log(response);

            var values = response.data.response;

            // Don't process the response it is empty
            if (values.length === 0) {
              return;
            }

            var valueMap = values.reduce((map, obj) => {
              map[obj.id.toLowerCase()] = obj;
              return map;
            }, {});

            const newProducts = products.map(product => {
              return {
                ...product,
                availability: (product.manufacturer === manufacturer && valueMap[product.id])
                  ? prepareAvailibilityPayload(valueMap[product.id].DATAPAYLOAD)
                  : product.availability
              }
            });

            setFunction(newProducts);

          }).catch(error => {
            console.log(error);
          });
      });
      console.log("End manufacturer loop");
    }

    if (updateAvailability) {
      console.log("Update availability")

    }

  }, [updateAvailability]);


  console.log(shirts.length);

  if (doneLoadingShirts && doneLoadingJackets && doneLoadingAccessories && !updateAvailability) {
    setUpdateAvailability(true);
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
      </header>
      <div>
        <ShirtListPage shirts={shirts} />
        {/* <JacketListPage jackets={jackets} /> */}
      </div>
    </div>
  );
}

export default App;
