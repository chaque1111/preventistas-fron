import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {searchSeller} from "../../redux/action";
import styles from "../SearchBarClient/SearchBar.module.css";
export default function ({setPage}) {
  const dispatch = useDispatch();
  const handleSubmit = () => {
    const input = document.getElementById("text");
    if (input.value === "") {
      return alert("por favor, ingresa un nombre");
    }
    dispatch(searchSeller(input.value));
    input.value = "";
    setPage(1);
  };

  useEffect(() => {
    const keyDownHandler = (event) => {
      const input = document.getElementById("text");

      if (event.key === "Enter") {
        event.preventDefault();
        handleSubmit();
      }
    };

    document.addEventListener("keydown", keyDownHandler);
  }, []);
  return (
    <div className={styles.search}>
      <input
        id='text'
        className={styles.input}
        type='text'
        placeholder='Buscar...'
      />

      <button
        className={styles.button}
        type='submit'
        onClick={(e) => handleSubmit(e)}
      ></button>
    </div>
  );
}
