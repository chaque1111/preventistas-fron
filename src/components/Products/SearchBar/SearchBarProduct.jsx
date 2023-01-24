import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {searchProduct} from "../../../redux/action";
import styles from "./SearchBar.module.css";

export default function SearchBarClient() {
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const handleChangue = (e) => {
    setInput(e.target.value);
  };
  const submit = () => {
    if (input.length <= 0) {
      return alert("por favor escriba un nombre");
    }
    dispatch(searchProduct(input));
  };
  return (
    <div className={styles.search}>
      <input
        id='text'
        className={styles.input}
        type='text'
        placeholder='Buscar...'
        onChange={(e) => handleChangue(e)}
      />

      <button
        className={styles.button}
        type='submit'
        onClick={(e) => submit()}
      ></button>
    </div>
  );
}
