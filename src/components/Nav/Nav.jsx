import React from "react";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import styles from "./Nav.module.css";

export default function Nav() {
  // const dispatch = useDispatch();

  // useEffect(() => {}, [dispatch]);
 

  return (
    <nav className={styles.nav}>
      <div className={styles.contain}>
        <div className={styles.divHome}>
          <Link to='/home'>
            <button className={styles.btnClient}>Home</button>
          </Link>
        </div>
        <div className={styles.divClient}>
          <Link to='/clients'>
            <button className={styles.btnClient}>Clientes</button>
          </Link>
        </div>
        <div className={styles.divVendedor}>
          <Link to='/sellers'>
            <button className={styles.btnClient}>Vendedor</button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
