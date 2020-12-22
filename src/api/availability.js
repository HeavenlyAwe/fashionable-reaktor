import axios from 'axios';

import {
  getUniqueManufacturers,
  productListToMap,
  stripHtmlTags,
} from './utils';


const fetchAvailabilityData = async (products) => {
  const manufacturers = getUniqueManufacturers(products);
  const requests = manufacturers.map(manufacturer => {
    return axios.get(`https://bad-api-assignment.reaktor.com/availability/${manufacturer}`)
  })
  return await axios.all(requests)
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


const fetchAvailability = async (products) => {

  const manufacturAvailibility = await fetchAvailabilityData(products);

  // Use a faster data structure for mapping data between the APIs
  var productMap = productListToMap(products);

  manufacturAvailibility.forEach(response => {
    var values = response.data.response;
    // Something went wrong if the response is empty.
    if (values === undefined || values.length === 0 || values === '[]') {
      Object.keys(productMap).forEach(key => {
        productMap[key].availability = 'Failed to load the availability data, please try again!';
      });
    } else {
      values.forEach(value => {
        const id = value.id.toLowerCase();
        const payload = stripHtmlTags(value.DATAPAYLOAD);

        if (productMap[id]) {
          productMap[id].availability = payload;
        }
      });
    }
  })

  return setAvailabilityValues(productMap, products);
}


export default fetchAvailability;