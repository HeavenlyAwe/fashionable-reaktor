import React from 'react';

import ShirtPage from './ShirtPage';


const ShirtListPage = ({ shirts }) => {
  const shirtList = shirts.map(shirt => {
    return (
      <li
        key={shirt.id}
      >
        <ShirtPage shirt={shirt} />
      </li>
    )
  })

  return (
    <div>
      <h2>Shirt List Page</h2>
      {
        (shirtList.length === 0)
          ? 'Content coming soon'
          : <ul>
            {shirtList}
          </ul>
      }
    </div>
  )
}


export default ShirtListPage;