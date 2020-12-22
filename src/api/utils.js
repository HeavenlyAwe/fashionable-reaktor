
const getUniqueManufacturers = (products) => {
  return [...new Set(products.map(product => product.manufacturer))];
}


const productListToMap = (products) => {
  return products.reduce((map, obj) => {
    map[obj.id.toLowerCase()] = obj;
    return map;
  }, {});
};


const stripHtmlTags = (htmlText) => {
  return htmlText.replace(/<[^>]+>/g, '').trim();
}


export { getUniqueManufacturers, productListToMap, stripHtmlTags}