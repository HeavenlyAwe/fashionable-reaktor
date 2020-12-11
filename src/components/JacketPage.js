import React from 'react';


const JacketPage = ({ jacket }) => {
  const { id, name, color, manufacturer, price, type, availability } = jacket;
  const colors = color.join(' ');

  return (
    <div>
      <div>ID: {id}</div>
      <div>NAME: {name}</div>
      <div>COLORS: {colors}</div>
      <div>MANUFACTURER: {manufacturer}</div>
      <div>PRICE: {price}</div>
      <div>TYPE: {type}</div>
      <div>AVAILABILITY: {availability}</div>
    </div>
  )
}


export default JacketPage;