import React from "react";
import styles from "../Paginado/Paginado.module.css";
export default function ({clienstPerPage, clients, setPage}) {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(clients / clienstPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <div className={styles.container}>
        {pageNumbers &&
          pageNumbers.map((number) => (
            <button
              className={styles.button}
              key={number}
              onClick={(e) => setPage(number)}
            >
              {number}
            </button>
          ))}
      </div>
    </nav>
  );
}
