import React, {useState} from "react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link,useHistory} from "react-router-dom";
import Cookies from "universal-cookie";
import { changeOrderNumber, getOrderByNumber } from "../../redux/action";
import OrderCard from "../OrderCard/OrderCard";
const Swal = require('sweetalert2')

export default function Order(props) {
    const dispatch = useDispatch()
    const cookies = new Cookies();
    const history = useHistory();
    const orderNumber = parseInt(props.match.params.id);
    useEffect(() => {
        dispatch(getOrderByNumber(orderNumber));
      }, [dispatch]);  
    

    const order = useSelector((state)=>state.orderByNumber)
    const client = useSelector((state)=>state.client)
    const seller = useSelector((state)=>state.seller)
   

    function modifyOrderNumber() {
        const orderId = orderNumber;
        console.log(orderId)
        console.log(typeof orderId)
        dispatch(changeOrderNumber(orderId));
      }

    async function handleFinishOrder(e) {
        e.preventDefault();       
        modifyOrderNumber();
        Swal.fire('Pedido modificado!', '', 'success')
        history.push('/user');    
    }
    return(
        <div>
            
            <div>            
            <div>Cliente: {cookies.get("clientName")}</div>
            </div>
            {
                order && order.map((e)=>{
                    return(
                        <div key={e.id}>
                            
                            <Link to={{pathname:"/transactions", state: {edit: true, orderId: e.id }}}>
                                <OrderCard InventarioId={e.inventarioId}  Descripción={e.descripcion}  Cantidad={e.cantidad}/>
                            </Link>

                        </div>           
                    )
                })
            }
            <div>
                <button
                id="Finish"
                onClick={(e) => handleFinishOrder(e)}>
                    Confirmar Pedido
                </button>
            </div>
            
        </div>
    )
}