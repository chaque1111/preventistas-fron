import React from "react";
import styles from "../Paginado/Paginado.module.css";
export default function PaginadoProduct({products, productsPerPage, setPage}) {
  const numberPages = [];
  for (let i = 1; i <= Math.ceil(products / productsPerPage); i++) {
    numberPages.push(i);
  }
  return (
    <nav>
      <div className={styles.container}>
        {numberPages.length
          ? numberPages.map((el) => {
              return (
                <button
                  className={styles.button}
                  key={el}
                  onClick={() => setPage(el)}
                >
                  {el}
                </button>
              );
            })
          : ""}
      </div>
    </nav>
  );
}
