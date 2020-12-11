import React from 'react';

import JacketPage from './JacketPage';


const JacketListPage = ({ jackets }) => {
  console.log(jackets.length)

  const jacketList = jackets.map(jacket => {
    return (
      <li
        key={jacket.id}
      >
        <JacketPage jacket={jacket} />
      </li>
    )
  })

  return (
    <div>
      <h2>Jacket List Page</h2>
      {
        (jacketList.length === 0)
          ? 'Content coming soon'
          : <ul>
            {jacketList}
          </ul>
      }
    </div>
  )
}


export default JacketListPage;