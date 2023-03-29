import React from "react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {getAllSellers} from "../../redux/action";
import styles from "../Sellers/Sellers.module.css";
import CardSeller from "../CardSeller/CardSeller";
export default function Sellers() {
  const dispatch = useDispatch();
  const sellers = useSelector((state) => state.allSellers);

  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);
  return (
    <div className={styles.container}>
      <div className={styles.cardsCont}>
        <h1>Vendedores</h1>

        {sellers.length &&
          sellers.map((e) => {
            return <CardSeller name={e.name}></CardSeller>;
          })}
      </div>
    </div>
  );
}
