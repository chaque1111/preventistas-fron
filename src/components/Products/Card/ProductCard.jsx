import React from "react";
import styles from "../Card/ProductCard.module.css";
export default function ({name, costo, stock, imagen}) {
  return (
    <div className={styles.container}>
      <h1 className={styles.description}>DESCRIPCION</h1>
      <h1 className={styles.name}>{name.toLowerCase()}</h1>
      <img className={styles.image} src={imagen} alt='' />
      <h1 className={styles.costo}>costo: {costo}</h1>
      {/* <h1>stock:  {stock}</h1> */}
    </div>
  );
}
