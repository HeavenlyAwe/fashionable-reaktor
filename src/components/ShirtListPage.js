import React, { useState, useEffects, useEffect } from 'react';
import axios from 'axios';

import ShirtPage from './ShirtPage';


const testShirts = [
  {
    color: [
      "grey"
    ],
    id: "919865f33813410ce76c",
    manufacturer: "nouke",
    name: "WERHUNK LIGHT",
    price: 47,
    type: "shirts"
  },
  {
    color: [
      "grey"
    ],
    id: "919865f33813410ce761",
    manufacturer: "nouke",
    name: "WERHUNK LIGHT",
    price: 47,
    type: "shirts"
  },
  {
    color: [
      "grey"
    ],
    id: "919865f33813410ce762",
    manufacturer: "nouke",
    name: "WERHUNK LIGHT",
    price: 47,
    type: "shirts"
  }
];


const ShirtListPage = (props) => {
  const [shirts, setShirts] = useState([])

  useEffect(() => {
    console.log('Fetching shirts');
    axios
      .get('https://bad-api-assignment.reaktor.com/products/shirts')
      .then(response => {
        console.log('get promise fulfilled');
        console.log(response);
        setShirts(response.data);
        // setShirts(testShirts);
      }).catch(error => {
        console.log(error);
      })
  }, [])

  const shirtList = shirts.map(shirt => {
    // console.log(shirt.id)
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
      Content Coming Soon
      <ul>
        {shirtList}
      </ul>
    </div>
  )
}


export default ShirtListPage;