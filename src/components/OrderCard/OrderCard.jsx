import React from "react";
export default function OrderCard({InventarioId,Descripción,Cantidad}) {
    return(
        <div>
            <div>InventarioId: {InventarioId}</div>
            <div>Descripción: {Descripción}</div>
            <div>Cantidad: {Cantidad}</div>
        </div>
    )
}