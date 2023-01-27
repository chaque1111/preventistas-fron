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
      setMessage("Usted es un vendedor, coloque su contraseña");
    } else if (e.target.value == 2) {
      setMessage("Usted es un administrador, coloque su contraseña");
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
        <h1 className={Styles.welcome}>Bienvenido a</h1>
        <h1 className={Styles.namePage}> PreventistasApp</h1>
      </div>
      <div className={Styles.containSelect}>
        <img
          className={Styles.icon}
          src='https://res.cloudinary.com/dw83apcj7/image/upload/v1674679610/3917711_ewjkcq.svg'
          alt=''
        />
        <p className={Styles.message}>Seleccionar una cuenta</p>

        <select className={Styles.selectName} onChange={(e) => handleSelect(e)}>
          <option disabled selected hidden>
            selecionar...
          </option>
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
              className={Styles.inputPass}
              type='password'
              onChange={(e) => handleChanguePassword(e)}
              placeholder='contraseña'
            />{" "}
            <button className={Styles.submit} onClick={(e) => submit(e)}>
              Iniciar sesión
            </button>{" "}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
