import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';

import ProductPage from './ProductPage';


const ProductListPage = ({ titleText, products }) => {

  const [currentPage, setCurrentPage] = useState(0);

  const PER_PAGE = 10;
  const offset = currentPage * PER_PAGE;

  const currentPageData = products.slice(offset, offset + PER_PAGE);
  const pageCount = Math.ceil(products.length / PER_PAGE);


  const productList = currentPageData.map(product => {
    return (
      <div
        key={product.id}
      >
        <ProductPage product={product} />
      </div>
    )
  })


  const handlePageClick = ({selected: selectedPage}) => {
    setCurrentPage(selectedPage);
  }

  return (
    <div className="App">
      <h2>{titleText}</h2>
      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        previousLinkClassName={"pagination__link"}
        nextLinkClassName={"pagination__link"}
        disabledClassName={"pagination__link--disabled"}
        activeClassName={"pagination__link--active"}
      />
      {productList}
    </div>
  );
}


ProductListPage.propTypes = {
  titleText: PropTypes.string.isRequired,
  products: PropTypes.array.isRequired,
}


export default ProductListPage;