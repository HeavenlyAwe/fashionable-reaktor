import React from 'react';


const ProductPage = ({ product }) => {
  const { id, name, color, manufacturer, price, type, availability } = product;
  const colors = color.join(' ');

  const availabilityColorMap = {
    "INSTOCK": "#4ef52d",
    "OUTOFSTOCK": "#ff2424",
    "LESSTHAN10": "#e4ff36",
  }

  const styling = {
    backgroundColor: (availabilityColorMap[availability])
      ? availabilityColorMap[availability]
      : "#999999"
  }

  return (
    <div>
      <div className="product-id">ID: {id}</div>
      <div><b>Name: {name}</b></div>
      <div>Color: {colors}</div>
      <div>Manufacturer: {manufacturer}</div>
      <div>Price: {price}</div>
      <div>Type: {type}</div>
      <div>Availability: <span style={styling}>{availability}</span></div>
    </div>
  );
}


export default ProductPage