import {React, useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useHistory} from "react-router-dom";
import Cookies from "universal-cookie";
import styles from "../HomeUser/HomeUser.module.css";
export default function () {
  const history = useHistory();
  const cookie = new Cookies();

  const logout = () => {
    cookie.remove("userName", {path: "/"});
    cookie.remove("userId", {path: "/"});
    history.push("/");
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.containTitle}>
          <h1 className={styles.panelText}>Panel de Preventistas</h1>
          <h1 className={styles.welcome}>Hola, {cookie.get("userName")}</h1>
        </div>
        <div className={styles.containButton}>
          <button className={styles.logout} onClick={logout}>
            <img
              className={styles.img}
              src='https://res.cloudinary.com/dw83apcj7/image/upload/v1674792204/3917349_p0mgkg.svg'
              alt=''
            />{" "}
            Cerrar Sesión
          </button>
        </div>
      </div>

      <p className={styles.titleSection}>¿A qué seccion deseas ir?</p>
      <div className={styles.containLinks}>
        <Link to='/clients' className={styles.link}>
          <div className={styles.clientes}>
            <p className={styles.text}>Clientes</p>
          </div>
        </Link>
        <Link to='/transactions' className={styles.link}>
          <div className={styles.transaccion}>
            <p className={styles.text}>Transaccion</p>
          </div>
        </Link>
        <Link to='/products' className={styles.link}>
          <div className={styles.productos}>
            <p className={styles.text}>Productos</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
