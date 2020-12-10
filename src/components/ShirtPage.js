import React from 'react';


const ShirtPage = ({ shirt }) => {
  const { id, name, color, manufacturer, price, type } = shirt;
  const colors = color.join(' ');

  // console.log(shirt);

  return (
    <div>
      <div>ID: {id}</div>
      <div>NAME: {name}</div>
      <div>COLORS: {colors}</div>
      <div>MANUFACTURER: {manufacturer}</div>
      <div>PRICE: {price}</div>
      <div>TYPE: {type}</div>
    </div>
  );
}


export default ShirtPage