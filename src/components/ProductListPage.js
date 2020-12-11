import React from 'react';
import PropTypes from 'prop-types';

import ProductPage from './ProductPage';


const ProductListPage = ({ titleText, products }) => {
  const productList = products.map(product => {
    return (
      <li
        key={product.id}
      >
        <ProductPage product={product} />
      </li>
    )
  })

  return (
    <div>
      <h2>{titleText}</h2>
      {
        (productList.length === 0)
          ? 'Content coming soon'
          : <ul style={{listStyleType:"none"}}>
            {productList}
          </ul>
      }
    </div>
  )
}


ProductListPage.propTypes = {
  titleText: PropTypes.string.isRequired,
  products: PropTypes.array.isRequired,
}


export default ProductListPage;