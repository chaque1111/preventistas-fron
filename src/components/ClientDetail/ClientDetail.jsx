import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getClientById, refresh} from "../../redux/action";
import styles from "../ClientDetail/ClientDetail.module.css";
export default function (props) {
  const dispatch = useDispatch();
  const clientDetail = useSelector((state) => state.selectClient);
  useEffect(() => {
    dispatch(getClientById(props.match.params.id));
  }, [clientDetail]);
  return (
    <div>
      {clientDetail ? (
        <div className={styles.container}>
          <div className={styles.containerContenido}>
            <div className={styles.imgContainer}>
              <img
                src='https://tse3.mm.bing.net/th?id=OIP.NP6uiJB-2iOM-gyKoNnlzAAAAA&pid=Api&P=0'
                alt='not found'
              />
            </div>
            <div className={styles.containInfo}>
              <h1>
                fecha de ultima compra:{" "}
                <text className={styles.textInfo}>{clientDetail.fechaUC}</text>
              </h1>
              <h1>
                Nombre asociado:
                <text className={styles.textInfo}> {clientDetail.name}</text>
              </h1>
              <h1>
                Vendedor:
                <text className={styles.textInfo}>
                  {" "}
                  {clientDetail.nombreVendedor}
                </text>
              </h1>
              <h1>
                Razon Social:{" "}
                <text className={styles.textInfo}>{clientDetail.rzsocial}</text>
              </h1>
              <h1>
                Localidad:{" "}
                <text className={styles.textInfo}>
                  {" "}
                  {clientDetail.localidad}
                </text>
              </h1>
              <h1>
                Dirección:{" "}
                <text className={styles.textInfo}>
                  {clientDetail.direccion
                    ? clientDetail.direccion
                    : "no encontrado"}
                </text>
              </h1>
              <h1>
                zona:{" "}
                <text className={styles.textInfo}>
                  {clientDetail.zona ? clientDetail.zona : "zona no encontrada"}
                </text>
              </h1>
              <h1>
                whatsapp:{" "}
                <text className={styles.textInfo}>
                  {" "}
                  {clientDetail.whatsapp}
                </text>
              </h1>
              <h1>
                Categoría:{" "}
                <text className={styles.textInfo}>
                  {clientDetail.categoria}
                </text>
              </h1>
              <h1>
                Activo:{" "}
                {clientDetail.activo ? (
                  <text className={styles.activo}>activo</text>
                ) : (
                  <text className={styles.inactivo}>inactivo</text>
                )}
              </h1>
            </div>
          </div>
          <h1 className={styles.obsTitle}>
            Observaciones de {clientDetail.nombreVendedor}:
          </h1>
          <div className={styles.obsContain}>
            <p className={styles.observacion}>{clientDetail.observaciones}</p>
          </div>
        </div>
      ) : (
        <h1>loading...</h1>
      )}
    </div>
  );
}
