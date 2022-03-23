import React from 'react';
import { useDispatch } from 'react-redux';

import { useSelector } from '../app/store';
import { addRandomItem, deleteItemById } from '../feature/randomItem/randomItemSlice';
import { getUniqueStr } from '../utils/common';

export default function App() {
  const items = useSelector((state) => state.items);
  const dispatch = useDispatch();
  const id = getUniqueStr();

  const addItem = () => {
    const newItem = {
      id,
      name: Math.random() > 0.5 ? "きのこ" : "たけのこ",
    };

    dispatch(addRandomItem(newItem));
  };

  const deleteItem = (id: string) => {
    dispatch(deleteItemById(id));
  };

  return (
    <>
      <button onClick={addItem}>「きのこ」か「たけのこ」を追加</button>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.name}
            <button onClick={() => deleteItem(item.id)}>削除</button>
          </li>
        ))}
      </ul>
    </>
  );
}
