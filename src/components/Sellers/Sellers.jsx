import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styles from "../Sellers/Sellers.module.css";

export default function Sellers() {
    // const dispatch = useDispatch();
    // const clients = useSelector((state) => state.allClients);

    // useEffect(() => {
             
    //   }, [dispatch]);
    return(
        <div className={styles.container}>
            <div className={styles.cardsCont}>
             <h1>Vendedores</h1>
           
          </div>
        </div>
    )
}