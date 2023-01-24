import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import Cookies from "universal-cookie";
import {searchClient} from "../../redux/action";
import styles from "../SearchBarClient/SearchBar.module.css";
export default function ({setPage}) {
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const [inputName, setInputName] = useState("");

  const handleChangueInput = (e) => {
    setInputName(e.target.value);
  };
  const handleSubmit = () => {
    if (inputName === "") {
      return alert("por favor, ingresa un nombre");
    }
    dispatch(searchClient(inputName));
    setInputName("");
    setPage(1);
  };

  return (
    <div className={styles.search}>
      <input
        id='text'
        className={styles.input}
        type='text'
        onChange={(e) => handleChangueInput(e)}
        value={inputName}
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
