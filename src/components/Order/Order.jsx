import React, {useState} from "react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import Cookies from "universal-cookie";
import { getOrderByNumber } from "../../redux/action";
import OrderCard from "../OrderCard/OrderCard";

export default function Order(props) {
    const dispatch = useDispatch()
    const cookies = new Cookies();

    useEffect(() => {
        dispatch(getOrderByNumber(props.match.params.id));
      }, [dispatch]);  
    
    const order = useSelector((state)=>state.orderByNumber)
    const client = useSelector((state)=>state.client)
    const seller = useSelector((state)=>state.seller)
    console.log(order)
    // const seller = order && order[0].vendedorId;
    return(
        <div>
            
            <div>            
            <div>Cliente: {cookies.get("clientName")}</div>
            </div>
            {
                order && order.map((e)=>{
                    return(
                        <div key={e.id}>
                            {/* <div>InventarioId: {e.inventarioId}</div>
                            <div>Descripción: {e.descripcion}</div>
                            <div>Cantidad: {e.cantidad}</div>
                            <div>Fecha: {e.fecha}</div> */}
                            <Link to={{pathname:"/transactions", state: {edit: true, orderId: e.id }}}>
                                <OrderCard InventarioId={e.inventarioId}  Descripción={e.descripcion}  Cantidad={e.cantidad}/>
                            </Link>

                        </div>           
                    )
                })
            }
            
        </div>
    )
}