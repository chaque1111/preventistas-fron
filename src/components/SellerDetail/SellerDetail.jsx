import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getSellerDetail} from "../../redux/action";
import Button from "react-bootstrap/Button";
export default function SellerDetail(props) {
  const dispatch = useDispatch();
  const sellerDetail = useSelector((state) => state.sellerDetail);

  useEffect(() => {
    dispatch(getSellerDetail(props.match.params.id));
  }, [dispatch]);
  return (
    <div>
      <Button variant='primary' >Modificar Contraseña</Button>{" "}
      <Button variant='danger' >Dar de Baja</Button>{" "}
      <h1>Nombre: {sellerDetail.name ? sellerDetail.name : ""}</h1>
      <h1>Codigo: {sellerDetail.id ? sellerDetail.id : ""}</h1>
    </div>
  );
}
