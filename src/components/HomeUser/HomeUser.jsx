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
        <h1>Hola {cookie.get("userName")}</h1>
        <h1>Bienvenido al panel de Preventistas</h1>
      </div>
      <p className={styles.seccionP}>a qué seccion deseas ir?</p>
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
      <div onClick={(e) => logout()} className={styles.containLogout}>
        <div class={styles.logout}>
          <div class={styles.link_wrapper}>
            <p className={styles.buttonLogout}>cerrar sesion</p>
            <div class={styles.icon}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 268.832 268.832'
              >
                <path d='M265.17 125.577l-80-80c-4.88-4.88-12.796-4.88-17.677 0-4.882 4.882-4.882 12.796 0 17.678l58.66 58.66H12.5c-6.903 0-12.5 5.598-12.5 12.5 0 6.903 5.597 12.5 12.5 12.5h213.654l-58.66 58.662c-4.88 4.882-4.88 12.796 0 17.678 2.44 2.44 5.64 3.66 8.84 3.66s6.398-1.22 8.84-3.66l79.997-80c4.883-4.882 4.883-12.796 0-17.678z' />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
