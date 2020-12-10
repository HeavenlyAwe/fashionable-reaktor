import React, { useState, useEffect } from 'react';
import axios from 'axios';

import ShirtListPage from './components/ShirtListPage'


const App = (props) => {
  const [shirts, setShirts] = useState([]);
  const [jackets, setJackets] = useState([]);


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

    const appendShirtsToState = (moreShirts) => {
      setShirts(shirts.concat(moreShirts));
    }

    const updateProductWithAvailability = (products, manufacturers, appendFunction) => {
      manufacturers.forEach(manufacturer => {
        console.log(manufacturer);
        axios
          .get(`https://bad-api-assignment.reaktor.com/availability/${manufacturer}`)
          .then(response => {
            console.log('get availability promise fulfilled');
            console.log(response);

            var values = response.data.response;
            var valueMap = values.reduce((map, obj) => {
              map[obj.id.toLowerCase()] = obj;
              return map;
            }, {});
            console.log(valueMap)

            const newProducts = products.map(product => {
              return {
                ...product,
                availability: (valueMap[product.id])
                  ? prepareAvailibilityPayload(valueMap[product.id].DATAPAYLOAD)
                  : "UNLISTED"
              }
            });

            appendFunction(newProducts);
          }).catch(error => {
            console.log(error);
          });
      });
    }

    const fetchProducts = (infoString, urlString, appendCallback) => {
      console.log(infoString);
      axios
        .get(urlString)
        .then(response => {
          console.log(`${infoString} promise fulfilled`);
          console.log(response);

          var products = response.data;
          const manufacturers = getUniqueManufacturers(products);
          updateProductWithAvailability(products, manufacturers, appendCallback)

        }).catch(error => {
          console.log(error);
        });

    }

    setShirts([]);
    setJackets([]);

    fetchProducts(
      'Fetching shirts',
      'https://bad-api-assignment.reaktor.com/products/shirts',
      appendShirtsToState
    );


    // console.log('Fetching jackets');
    // axios
    //   .get('https://bad-api-assignment.reaktor.com/products/jackets')
    //   .then(response => {
    //     console.log('get jackets promise fulfilled');
    //     console.log(response);
    //     setJackets(response.data);
    //     setJacketManufacturers(getUniqueManufacturers(response.data));
    //   }).catch(error => {
    //     console.log(error);
    //   });
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        Software for accessing product and availability info.
      </header>
      <div>
        <ShirtListPage shirts={shirts} />
      </div>
    </div>
  );
}

export default App;
