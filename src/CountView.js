import React from 'react'

export const CountView = ({count, val, handleAdd, handleMinus, handleChange, handleClean}) => (
    <div>
        <p>count: {count}</p>
        <p>val: {val}</p>
        <button onClick={handleAdd}>+</button>
        <button onClick={handleMinus}>-</button>
        <input value={val} placeholder="请输入" onChange={(e) => handleChange(e.target.value)} />
        <button onClick={handleClean}>清0</button>
    </div>
)