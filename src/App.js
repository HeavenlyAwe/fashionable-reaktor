import React, { useState, useEffect } from 'react';
import axios from 'axios';

import ShirtListPage from './components/ShirtListPage'


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


const App = (props) => {
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

    axios
      .get('https://bad-api-assignment.reaktor.com/availability/derp')
      .then(response => {
        console.log('get promise fulfilled');
        console.log(response);
        // setShirts(response.data);
        // setShirts(testShirts);
      }).catch(error => {
        console.log(error);
      })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div>
        <ShirtListPage shirts={shirts} />
      </div>
    </div>
  );
}

export default App;
