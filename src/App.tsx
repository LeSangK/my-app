import React, { useState } from "react";
import {format} from 'date-fns'
import ja from 'date-fns/locale/ja'

console.log(format(new Date(), 'd(E)', {locale: ja})) // 日本語

export default function App() {
  const [items, setItems] = useState([{ name: "きのこ" }]);
  console.log("render")

  const addItem = () => {
    const newItem = items.length === 0 ? {
      name: Math.random() > 0.5 ? "きのこ" : "たけのこ"
    } :{
      name: items.slice(-1)[0].name === "きのこ" ? "たけのこ" : "きのこ"  
    };
    // 現在の items に newItem を追加した配列を setItems に渡す。
    setItems([...items, newItem]);
  };

  // 引数 index は削除したい要素のインデックス
  const deleteItem = (index: number) => {
    // 現在の items から、引数 index と同じインデックスの要素を
    // 削除した配列を setItems に渡す。
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <>
      <button onClick={addItem}>「きのこ」か「たけのこ」を追加</button>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.name}
            <button onClick={() => deleteItem(index)}>削除</button>
          </li>
        ))}
      </ul>
    </>
  );
}