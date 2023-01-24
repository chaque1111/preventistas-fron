import React from "react";

import styles from "./Card.module.css";

export default function Card({id, name, localidad, vendedor, zona}) {
  return (
    <div className={styles.cardContainer}>
      <h1 className={styles.name}>
        Nombre:{" "}
        {name.length < 13
          ? name
          : name.split("").slice(0, 13).join("").toLowerCase() + "..."}
      </h1>
      <img
        className={styles.img}
        src='https://tse3.mm.bing.net/th?id=OIP.NP6uiJB-2iOM-gyKoNnlzAAAAA&pid=Api&P=0'
        alt='not found'
      />
      <h1 className={styles.vendedor}>Vendedor: {vendedor}</h1>
    </div>
  );
}
