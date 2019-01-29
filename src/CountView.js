import React from 'react'

export const CountView = ({count, sum, handleAdd, handleMinus}) => (
    <div>
        <p>count: {count}</p>
        <p>sum: {sum}</p>
        <button onClick={handleAdd}>+</button>
        <button onClick={handleMinus}>-</button>
    </div>
)