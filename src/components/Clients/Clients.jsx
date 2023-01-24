import React, {useState} from "react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import styles from "../Clients/Clients.module.css";
import Card from "../Card/Card.jsx";
import {
  getAllClients,
  getClientsBySeller,
  getLocalidades,
  searchClient,
  filterClients,
  refreshClients,
} from "../../redux/action";
import Cookies from "universal-cookie";
import Paginado from "../Paginado/Paginado";
import SearchBar from "../SearchBarClient/SearchBar";

export default function Clients() {
  const cookie = new Cookies();
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.clienstBySeller);
  const localidades = useSelector((state) => state.localidades);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage, setClientsPerPage] = useState(15);
  const indexLastClient = currentPage * clientsPerPage;
  const indexFirstClient = indexLastClient - clientsPerPage;
  const currentClients = clients.slice(indexFirstClient, indexLastClient);

  const setPage = (number) => {
    setCurrentPage(number);
  };
  const handleRefresh = () => {
    dispatch(getLocalidades(cookie.get("userId")));
    dispatch(getClientsBySeller(cookie.get("userId")));
    cookie.set("BoolActivo", "", {path: "/"});
    cookie.set("Localidad", "", {path: "/"});
  };
  const selectActivo = (e) => {
    cookie.set("BoolActivo", e.target.value, {path: "/"});
    dispatch(filterClients());
    setPage(1);
  };
  const selectLocalidad = (e) => {
    cookie.set("Localidad", e.target.value, {path: "/"});
    dispatch(filterClients());
    setPage(1);
  };
  useEffect(() => {
    dispatch(refreshClients());
    dispatch(getLocalidades(cookie.get("userId")));
    dispatch(getClientsBySeller(cookie.get("userId")));
    cookie.set("BoolActivo", "", {path: "/"});
    cookie.set("Localidad", "", {path: "/"});
  }, [dispatch]);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Preventistas App</h1>
        </div>
        <div className={styles.search}>
          <SearchBar setPage={setPage}></SearchBar>{" "}
        </div>
        <div className={styles.filters}>
          <button onClick={() => handleRefresh()} className={styles.refresh}>
            recargar
          </button>
          <select onChange={(e) => selectLocalidad(e)} name='Localidad' id='2'>
            <option disabled selected hidden>
              Localidad..
            </option>
            {localidades.length &&
              localidades.map((e) => {
                return <option value={e}>{e}</option>;
              })}
          </select>
          <select onChange={(e) => selectActivo(e)} name='Propiedades' id='2'>
            <option disabled selected hidden>
              Filtrar...
            </option>
            <option value={true}>Clientes Activos</option>
            <option value={false}>Clientes Inactivos</option>
          </select>
        </div>
        <div className={styles.paginado}>
          <Paginado
            clienstPerPage={clientsPerPage}
            clients={clients.length}
            setPage={setPage}
          ></Paginado>
        </div>
      </div>
      <div className={styles.cardsCont}>
        {currentClients.length > 0 ? (
          currentClients.map((e) => {
            return (
              <div key={e.id} className={styles.singleCard}>
                <Link className={styles.link} to={"/detail/" + e.id}>
                  <Card id={e.id} name={e.name} vendedor={e.nombreVendedor} />
                </Link>
              </div>
            );
          })
        ) : (
          <p>...Loading</p>
        )}
      </div>
    </div>
  );
}
