import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {searchProduct} from "../../../redux/action";
import styles from "./SearchBar.module.css";

export default function SearchBarClient() {
  const dispatch = useDispatch();

  const submit = () => {
    let input = document.getElementById("text");
    console.log(input.value);
    if (input.length <= 0) {
      return alert("por favor escriba un nombre");
    }
    dispatch(searchProduct(input.value)).then((res) => {
      if (res !== false) {
        input.value = "";
      }
    });
  };

  useEffect(() => {
    const handleEnter = (e) => {
      if (e.key === "Enter") {
        submit();
      }
    };
    document.addEventListener("keydown", handleEnter);
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
        onClick={(e) => submit()}
      ></button>
    </div>
  );
}
