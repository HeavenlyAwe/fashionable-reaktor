import React from 'react';


const JacketPage = ({ jacket }) => {
  const { id, name } = jacket;

  return (
    <div>
      <div>ID: {id}</div>
      <div>NAME: {name}</div>
    </div>
  )
}


export default JacketPage;