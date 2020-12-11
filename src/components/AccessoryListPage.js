import React from 'react';

import AccessoryPage from './AccessoryPage';


const AccessoryListPage = ({ accessories }) => {
  const accessoryList = accessories.map(accessory => {
    return (
      <li
        key={accessory.id}
      >
        <AccessoryPage accessory={accessory} />
      </li>
    )
  })

  return (
    <div>
      <h2>Shirt List Page</h2>
      {
        (accessoryList.length === 0)
          ? 'Content coming soon'
          : <ul>
            {accessoryList}
          </ul>
      }
    </div>
  )
}


export default AccessoryListPage;