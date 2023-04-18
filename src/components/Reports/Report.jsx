import React, {useState} from "react";
import styles from "../Reports/Report.module.css";

export default function Report() {
  const [fechaInicial, setFechaInicial] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const fecha = new Date();
  const fechaAdaptada = fecha.toISOString();
  const handleFechaInicial = (e) => {
    setFechaInicial(e.target.value);
  };

  const handleFechaFinal = (e) => {
    setFechaFinal(e.target.value);
  };
  const ValidarFechas = () => {
    console.log(fechaAdaptada.split("").slice(0, 10).join(""));
    var fechainicial = document.getElementById("FechaInicial").value;
    var fechafinal = document.getElementById("FechaFinal").value;
    if (fechafinal < fechainicial)
      alert("La fecha final debe ser mayor a la fecha inicial");
  };

  return (
    <div className={styles.container}>
      <label htmlFor='FechaInicial'>Fecha Inicial</label>
      <input
        placeholder='02/20/2020'
        onChange={(e) => handleFechaInicial(e)}
        type='date'
        name='FechaInicial'
        id='FechaInicial'
      />
      {fechaInicial.length ? <p>{fechaInicial}</p> : ""}
      <label htmlFor='FechaFinal'>Fecha Final</label>
      <input
        min={fechaInicial}
        onChange={(e) => handleFechaFinal(e)}
        type='date'
        name='FechaFinal'
        id='FechaFinal'
      />
      {fechaFinal.length ? <p>{fechaFinal}</p> : ""}

      <button onClick={() => ValidarFechas()}>verificar</button>
    </div>
  );
}
