import fetchProductsAPI from './products';
import fetchAvailabilityAPI from './availability';


const fetchProducts = async (productNames) => {
  const products = await fetchProductsAPI(productNames);
  return await fetchAvailabilityAPI(products);
}


export { fetchProducts, fetchAvailabilityAPI as fetchAvailability }