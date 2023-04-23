import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Styles from "../FormTrans/FormTrans.module.css";
import {
  getAllSellers,
  getAllProducts,
  getSellersId,
  getClientsBySeller,
  getProductId,
  getOrderNumber,
  changeOrderNumber,
  postTransac,
  openTransaction,
  getClientById,
  cargaPedido,
  resetPedido,
  filterProducts,
  totalPedido,
} from "../../redux/action";
import getDate from "../../utils/functions/getDate";
import Cookies from "universal-cookie";
const Swal = require('sweetalert2')


function Validate(input) {
  
  let errors = {};
  if (!input.clienteId) errors.client = "Se requiere elegir un cliente";
  if (!input.descripcion) 
  {
    errors.products = "Se requiere elegir un producto";}
  if (!input.cantidad) errors.cantidad = "Se requiere definir cantidad";    
  return errors;
}

export default function NewTransactions() {
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const history = useHistory()
  const products = useSelector((state) => state.allProducts);
  var pedidos = useSelector((state) => state.pedidos);

  const costoTotal = pedidos.reduce((acumulador,actual)=>acumulador + actual.subTotal,0).toFixed(2)    
  console.log("costoTotal: ", costoTotal)
  useEffect(async () => {
    await dispatch(openTransaction());
    await dispatch((getSellersId(cookies.get("userId"))))
  }, [dispatch]);
  
  const [errors, setErrors] = useState({});
  const [input, setInput] = useState({
    id: "",
    vendedorId: "",
    clienteId: "",
    fecha: "",
    cantidad: "",
    costo: "",
    subTotal: "",
    costoTotalPedido: "",
    descripcion: "",
    inventarioId: "",
    orderNumber: "",
  });

  const sellers = cookies.get("userName")
  const fecha = getDate(); 
  async function handleSelectClients(e) {
    await dispatch(getClientById(e.target.value));
    setInput({
      ...input,
      vendedorId: cookies.get("userId"),
      clienteId: cookies.get("clientId"),
    });

    setErrors(
      Validate({
            ...input,
            vendedorId: cookies.get("userId"),
            clienteId: cookies.get("clientId"),
          })
    )  
  }

  if (input.clienteId) {
    document.getElementById('Clients').style.display = 'none';  
  }
  
  if (!input.fecha) {
    (function handleDate() {
      setInput({
        ...input,
        fecha: fecha,
      });
    })();
  }


  if (!input.orderNumber) {
    (async function handleOrderNumber() {
      const nroPedido = await dispatch(getOrderNumber());
      setInput({
        ...input,
        orderNumber: nroPedido.payload[0].nroPedido,
      });
    })();
  }

  function modifyOrderNumber() {
    const orderId = input.orderNumber;
    dispatch(changeOrderNumber(orderId));
  }

  async function handleSelectProducts(e) {
    if (e.target.value !== "Seleccionar producto"
    ) {    
      
      
      const idProduct = await dispatch(getProductId(e.target.value));
      const iva = 1 + idProduct.payload.porcentaje / 100;
      const unitCost = parseInt(idProduct.payload.costoBonif);
      const unitCostIva = unitCost + iva;
      
      let products = pedidos.filter((el) =>
      el.descripcion.includes(idProduct.payload.descripcion)
      );
      
      console.log("products filter: ", products)
      console.log("tamaño products filter: ", products.length)

      if(products.length > 0){
        Swal.fire('Este artículo ya a sido cargado', '', 'warning');
        document.getElementById("Products").value = "default";
      }else{
      
      


      setInput({
        ...input,
        cantidad: 1,
        descripcion: idProduct.payload.descripcion,
        inventarioId: e.target.value,
        costo: unitCostIva,
        costoTotalPedido: unitCostIva,
        subTotal: unitCostIva * 1,
      });

      document.getElementById("cantidad").value = "1";

      setErrors(
        Validate({
              ...input,
              descripcion: idProduct.payload.descripcion,
            })
      )
    } 
  } 
  }

  const handleCodigo = (e) =>{
    setInput({
      ...input,
      inventarioId: e.target.value,
  })
  }

  const handleCantidad = (e) => {
    if (input.descripcion && e.target.value > 0){
     let cant = e.target.value
    
      if(cant[cant.length-2]=== '.'){
        cant = cant.split(".").join('');
        e.target.value = cant
      }

      const newCostoTotal = parseFloat(costoTotal) + (input.costo * cant) 
      console.log(parseFloat(costoTotal))
      console.log(input.costo * cant)
      console.log(newCostoTotal.toFixed(2))
      setInput({
        ...input,
        cantidad: cant,        
        subTotal: input.costo * cant,   
        costoTotalPedido: newCostoTotal.toFixed(2)      
      });

      setErrors(
        Validate({
              ...input,
              cantidad: cant,        
              subTotal: input.costo * cant,   
              costoTotalPedido: newCostoTotal.toFixed(2)  
            })
      )
    }
  }


  const handleCargar = () =>{    
    setErrors(Validate(input))
    const errors = Validate(input)
    console.log('Input:', input)
    console.log('Errors: ', errors)
    console.log('ErrorsLength: ', Object.values(errors).length)
    Object.values(errors).length !== 0  ?
    Swal.fire('Faltan completar algunos datos', '', 'warning') :
    Swal.fire({
      title: 'Confirmación!',
      text: 'Desea finalizar el pedido?',
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Finalizar pedido',
      denyButtonText: 'Continuar pedido',
      denyButtonColor: "#23C41C"
    }).then(async (result)=>{
      if (result.isConfirmed) {        
        dispatch(cargaPedido(input));
        console.log("Costo Total Pedido: ", input.costoTotalPedido)
        dispatch(totalPedido(input.costoTotalPedido))
        setInput({
          id: "",
          vendedorId: input.vendedorId,
          clienteId: "",
          fecha: "",
          cantidad: 1,
          costo: "",
          subTotal: "",
          descripcion: "",
          inventarioId: "",
          orderNumber: "",
         })
        modifyOrderNumber();
        pedidos && pedidos.map(async(el,i)=>{ 
          console.log(el)         
          await dispatch(postTransac(el,i));
        })
        Swal.fire('Pedido cargado!', '', 'success')
        setTimeout(()=>{dispatch(resetPedido());
          history.push('/user');},5000)

        const initValue = "default";
        document.getElementById("Products").value = initValue;
        document.getElementById("cantidad").value = ""; 
      } else if (result.isDenied) {        
        dispatch(cargaPedido(input));
        dispatch(totalPedido(input.costoTotalPedido))
        const initValue = "default";

        document.getElementById("Products").value = initValue;
        document.getElementById("cantidad").value = "";
       
        document.getElementById("codigo").value = "";

        setInput({
          id: "",
          vendedorId: input.vendedorId,
          clienteId: input.clienteId,
          fecha: "",
          cantidad: "",
          costo: "",
          subTotal: "",
          descripcion: "",
          inventarioId: "",
          orderNumber: "",
          })
        }
    })
  }
  
  useEffect(() => {
    dispatch(getAllSellers());
    dispatch(getClientsBySeller(cookies.get("userId"))); 
    !input.inventarioId ?
    dispatch(getAllProducts()) :      
    dispatch(filterProducts(input.inventarioId))
  }, [dispatch, input]);

  // const productId = useSelector((state) => state.productId);
  // const chosenSeller = useSelector((state) => state.seller);
  // const chosenClient = useSelector((state) => state.client);
  // const dataUser = useSelector((state) => state.user);
  const clients = useSelector((state) => state.clienstBySeller)
  console.log("Inputs: ", input)
  return (

    <div>
      <h1 className={Styles.TitleForm}>Formulario Transacciones</h1>      
      <div className={Styles.Buttons}>
        <button onClick={()=>{history.push('/user')}}>Back</button>
        <button>Ver Transacciones</button>
      </div>
      <div>
        <div className={Styles.seller_client}>
        <div>Vendedor: {sellers}</div>
          <div className={Styles.masterSellClient}>
             <div className={Styles.containSellClient}>                      
                 <select
                  className={Styles.select}
                  id={"Clients"}
                  defaultValue={"default"}
                  onChange={(e) => handleSelectClients(e)}
                  disabled={input.clienteId}
                >
                  <option value={"default"} disabled>
                    Seleccionar cliente
                  </option>
                  {!input.clienteId ? (
                    clients &&
                    clients.map((el) => (
                      <option value={el.id} key={el.id}>
                        {el.name}
                      </option>
                    ))
                  ) : (
                    <option value={"clientSelect"}>Cliente seleccionado</option>
                  )}
                </select>
              </div>
            </div>
                {errors.client && <h6>{errors.client}</h6>}

            <div className={Styles.masterChosenPeople}>
              <div className={Styles.containChosenPeople}>
                {input.clienteId ?
                (<div id={"chosenClient"} className={Styles.chosenClient}>Cliente: {cookies.get("clientName")}</div>)
                :(<div></div>)
                }
              </div>
            </div>
        </div>
        <div className={Styles.containCeldasState}>
          <div className={Styles.celdas}>
            <label>Código</label>
          </div>
          <div className={Styles.celdas}>
            <label>Descripción</label>
          </div>
          <div className={Styles.celdas}>
            <label>Cantidad</label>
          </div>
          <div className={Styles.celdas}>
            <label>Precio Unitario</label>
          </div>
          <div className={Styles.celdas}>
            <label>Subtotal</label>
          </div>
        </div>
        {pedidos && pedidos.length
          ? pedidos.map((el) => (
              <div key={el.inventarioId} className={Styles.containCeldasState}>
                <div className={Styles.celdas}>
                  <div>{el.inventarioId}</div>
                </div>
                <div className={Styles.celdas}>
                  <div>{el.descripcion}</div>
                </div>
                <div className={Styles.celdas}>
                  <div>{el.cantidad}</div>
                </div>
                <div className={Styles.celdas}>
                  <div>{el.costo}</div>
                </div>
                <div className={Styles.celdas}>
                  <div>{el.subTotal}</div>
                </div>
              </div>
            ))
          : ""}
          <div className={Styles.containPrTotal}>
          <div className={Styles.celdaTotal}>
            <label>Total: </label>
          </div>
          <div className={Styles.celdas}>
            <div>{costoTotal}</div>
          </div>
          </div>
      </div>
      <div className={Styles.containInputs}>
        <div className={Styles.input}>
          <label>Código</label>
          <input
            name='codigo'
            id={"codigo"}
            type='number'
            className={Styles.input}
            onChange={(e) => handleCodigo(e)}
          ></input>
        </div>
        <div className={Styles.input}>
          <label>Descripción</label>       
          <div className={Styles.masterCantidad}>
              <div className={Styles.containCantidad}>
                 <select
                  className={Styles.select}
                  id={"Products"}
                  defaultValue={"default"}
                  onChange={(e) => handleSelectProducts(e)}
                >
                  <option value={"default"} disabled>
                    Seleccionar producto
                  </option>
                  {products &&
                    products.map((el) => (
                      <option value={el.id} key={el.descripcion}>
                        {el.descripcion}
                      </option>
                    ))}
                </select>
                </div>
                </div>
        </div>
        <div className={Styles.input}>
          <label>Cantidad</label>          
            <input
            name='cantidad'
            id={"cantidad"}
            type="number"
            min="1"
            placeholder="Ingrese cantidad"
            className={Styles.input}
            onChange={(e)=>handleCantidad(e)}
          ></input>          
        </div>
        <div>
          <div className={Styles.cargar}>
            <button onClick={handleCargar}>Cargar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
