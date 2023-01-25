import React, {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {getAllSellers, logIng, refreshClients} from "../../redux/action";
import {useDispatch, useSelector} from "react-redux";
import Cookies from "universal-cookie";
import Styles from "../LandingPage/Landing.module.css";
export default function LandingPage() {
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const history = useHistory();
  const sellers = useSelector((state) => state.allSellers);
  const userSession = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const [seller, setSeller] = useState({
    id: "seleccione un nombre",
    password: "",
  });

  const handleSelect = (e) => {
    if (e.target.value != 2) {
      setMessage("USTED ES UN VENDEDOR, COLOQUE SU CONTRASEÑA");
    } else if (e.target.value == 2) {
      setMessage("USTED ES UN ADMINISTRADOR, COLOQUE SU CONTRASEÑA");
    }
    setSeller({
      ...seller,
      id: e.target.value,
    });
  };

  const handleChanguePassword = (e) => {
    setSeller({
      ...seller,
      password: e.target.value,
    });
  };

  const submit = async () => {
    dispatch(refreshClients());
    const loaded = await dispatch(logIng(seller)).then((res) =>
      res === false ? false : true
    );
    if (!loaded) {
      return alert("contraseña incorrecta");
    } else {
      history.push("/user");
    }
  };

  useEffect(() => {
    if (cookies.get("userName")) {
      history.push("/user");
    }
    dispatch(getAllSellers());
  }, []);

  return (
    <div className={Styles.container}>
      <div className={Styles.containWelcome}>
        <h1 className={Styles.welcome}>Bienvenido </h1>
        <h1 className={Styles.welcome}> a </h1>
        <h1 className={Styles.welcome}> PreventistasApp</h1>
      </div>
      <div className={Styles.containSelect}>
        <option value='' disabled selected hidden>
          SELECCIONE UNA CUENTA
        </option>
        <p>SELECCIONE UNA CUENTA</p>
        <select className={Styles.selectC} onChange={(e) => handleSelect(e)}>
          <option value={seller.id}>SELECCIONE UN NOMBRE</option>
          {sellers.length &&
            sellers.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
        </select>
        {message.length ? <p className={Styles.message}>{message}</p> : ""}
        {seller.id.length <= 2 ? (
          <div className={Styles.containInput}>
            <input
              className={Styles.password}
              type='password'
              onChange={(e) => handleChanguePassword(e)}
              placeholder='contraseña'
            />{" "}
            <button className={Styles.submit} onClick={(e) => submit(e)}>
              iniciar sesion
            </button>{" "}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
