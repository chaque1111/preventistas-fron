import React from "react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {getAllSellers} from "../../redux/action";
import styles from "../Sellers/Sellers.module.css";
import CardSeller from "../CardSeller/CardSeller";
import SearchBar from "../SearchBarClient/SearchBar";
import SearchBarSeller from "../SearchBarSeller/SearchBarSeller";
export default function Sellers() {
  const dispatch = useDispatch();
  const sellers = useSelector((state) => state.allSellers);
  const handleRefresh = () => {
    dispatch(getAllSellers());
  };
  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Vendedores</h1>
        <div className={styles.containButton}>
          <button className={styles.logout}>
            <img
              className={styles.img}
              src='https://res.cloudinary.com/dw83apcj7/image/upload/v1674792204/3917349_p0mgkg.svg'
              alt=''
            />{" "}
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className={styles.containBody}>
        <div className={styles.containMenu}>
          <div className={styles.containOptions}>
            <div className={styles.filters}>
              <h1 className={styles.text}>Buscar</h1>
              <div className={styles.search}>
                <SearchBarSeller></SearchBarSeller>
              </div>
              <h1 className={styles.text}>Filtrar</h1>
              {/* 
              <select
                onChange={(e) => selectLocalidad(e)}
                name='Localidad'
                id='2'
              >
                <option disabled selected hidden>
                  Localidad..
                </option>
                {localidades.length &&
                  localidades.map((e) => {
                    return <option value={e}>{e}</option>;
                  })}
              </select>
              <select
                onChange={(e) => selectActivo(e)}
                name='Propiedades'
                id='2'
              >
                <option disabled selected hidden>
                  Filtrar...
                </option>
                <option value={true}>Clientes Activos</option>
                <option value={false}>Clientes Inactivos</option>
              </select> */}
              <button
                onClick={() => handleRefresh()}
                className={styles.refresh}
              >
                <img
                  className={styles.iconReload}
                  src='https://res.cloudinary.com/dw83apcj7/image/upload/v1674866264/3917765_oub0vd.svg'
                  alt=''
                />{" "}
                Recargar
              </button>{" "}
              <button
                onClick={() => handleRefresh()}
                className={styles.addSeller}
              >
                <img
                  className={styles.iconReload}
                  src='https://res.cloudinary.com/dw83apcj7/image/upload/v1674866264/3917765_oub0vd.svg'
                  alt=''
                />{" "}
                Agregar Vendedor
              </button>
            </div>
            {/* <div className={styles.containPaginado}>
              <Paginado
                clienstPerPage={clientsPerPage}
                clients={clients.length}
                setPage={setPage}
              ></Paginado>
            </div> */}
          </div>
        </div>
        <div className={styles.cardsCont}>
          {sellers.length > 0 ? (
            sellers.map((e) => {
              return (
                <div key={e.id} className={styles.singleCard}>
                  <Link className={styles.link} to={"/seller/" + e.id}>
                    <CardSeller
                      id={e.id}
                      name={e.name}
                      vendedor={e.nombreVendedor}
                    />
                  </Link>
                </div>
              );
            })
          ) : (
            <p>...Loading</p>
          )}
        </div>{" "}
      </div>
    </div>
  );
}
