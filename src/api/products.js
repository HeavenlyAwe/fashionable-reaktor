import axios from 'axios';


const fetchProductData = async (productNames) => {
  const requests = productNames.map(name => {
    return axios.get(`https://bad-api-assignment.reaktor.com/products/${name}`)
  })
  return await axios.all(requests)
}


const prepareProducts = (products) => {
  var newProducts = products.map(product => {
    return {
      ...product,
      availability: "[Waiting for update]",
    }
  })
  return newProducts
};


const fetchProducts = async (productNames) => {

  const responses = await fetchProductData(productNames);

  // Merge all product arrays
  var products = []
  responses.forEach(response => {
    products = products.concat(response.data);
  })

  // Add missing properties
  return await prepareProducts(products);
}


export default fetchProducts;