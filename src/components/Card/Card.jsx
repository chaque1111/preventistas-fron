import React from "react";

import styles from "./Card.module.css";

export default function Card({id, name, localidad, vendedor, zona}) {
  return (
    <div className={styles.cardContainer}>
      <h1 className={styles.name}>
        Nombre: {name.split("").slice(0, 20).join("").toLowerCase() + "..."}
      </h1>
      <img
        className={styles.img}
        src='https://res.cloudinary.com/dw83apcj7/image/upload/v1674679610/3917711_ewjkcq.svg'
        alt='not found'
      />
      <h1 className={styles.vendedor}>Vendedor: {vendedor}</h1>
    </div>
  );
}
