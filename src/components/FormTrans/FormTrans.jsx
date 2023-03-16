import React, {useState, useEffect} from "react";
import { useLocation } from "react-router";
import {Link, useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Styles from "../FormTrans/FormTrans.module.css";
import {
  getAllSellers,
  getAllClients,
  getAllProducts,
  getSellersId,
  getClientsBySeller,
  getProductId,
  getOrderNumber,
  changeOrderNumber,
  postTransac,
  closeTransaction,
  openTransaction,
  getClientById,
  getOrderId,
  getOrderById,
  putTransac,
  cargaPedido,
} from "../../redux/action";
import getDate from "../../utils/functions/getDate";
import Cookies from "universal-cookie";
const Swal = require('sweetalert2')


function Validate(input) {
  let errors = {};
  if (!input.clienteId) errors.client = "Se requiere elegir un cliente";
  if (!input.descripcion) errors.products = "Se requiere elegir un producto";
 
  return errors;
}

export default function NewTransactions() {
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const history = useHistory();
  const order = useSelector((state)=>state.orderId)
  
  const pedidos = useSelector((state) => state.pedidos);
  console.log(pedidos)

  // const [precioTotal, setPrecioTotal] = useState(null)

  const precioTotal = pedidos.reduce((acumulador,actual)=>acumulador + actual.subTotal,0).toFixed(2)
  console.log(precioTotal)

  useEffect(async () => {
    await dispatch(openTransaction());
    await dispatch((getSellersId(cookies.get("userId"))))
  }, [dispatch]);
  
  const [errors, setErrors] = useState({});
  let data = useLocation();
  const [input, setInput] = useState({
    id: "",
    vendedorId: "",
    clienteId: "",
    fecha: "",
    // products: [],
    cantidad: 1,
    costo: "",
    subTotal: "",
    descripcion: "",
    inventarioId: "",
    orderNumber: "",
  });
  
  const sellers = cookies.get("userName")
  
  const fecha = getDate();
  
  let estado = "";

  data.state.edit === true ?  estado = "Modificar" : estado = "Agregar"  

  if(data.state.edit === true 
    && !input.clienteId && !input.descripcion
    ){
    (async function editImput(){   
      const order = await dispatch(getOrderById(data.state.orderId));   
      
      let cantidad = order.payload[0].cantidad;
      let descripcion = order.payload[0].descripcion;
      let products = [];

      for(let i=0; i<cantidad; i++){
        products.push(descripcion)
      }

      setInput({
        id: order.payload[0].id,
        vendedorId: order.payload[0].vendedorId,
        clienteId: order.payload[0].clienteId,
        fecha: order.payload[0].fecha,
        products: products,
        cantidad: cantidad,
        costo: order.payload[0].costo,
        subTotal: order.payload[0].subTotal,
        descripcion: descripcion,
        inventarioId: order.payload[0].inventarioId,
        orderNumber: order.payload[0].orderNumber,
      })
      document.getElementById("Products").value = order.payload[0].inventarioId;
    })()
  }
       
  async function handleSelectClients(e) {
    await dispatch(getClientById(e.target.value));
    setInput({
      ...input,
      vendedorId: cookies.get("userId"),
      clienteId: cookies.get("clientId"),
    });
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


      setInput({
        ...input,
        cantidad: 1,
        descripcion: idProduct.payload.descripcion,
        inventarioId: e.target.value,
        costo: unitCostIva,
        subTotal: unitCostIva * input.cantidad,
      });

      setErrors(
        Validate({
              ...input,
              descripcion: idProduct.payload.descripcion,
            })
      )

    } 
    // else {
    //   e.target.value = input.descripcion;
    //   return alert(
    //     "Ya has añadido este producto a la lista. Seleccione otro producto o continúe completando el formulario."
    //   );
    // }
  }

  const handleCantidad = (e) => {
    if (input.descripcion && e.target.value > 0){
     let cant = e.target.value
    
      if(cant[cant.length-2]=== '.'){
        cant = cant.split(".").join('');
        e.target.value = cant
      }
      setInput({
        ...input,
        cantidad: cant,        
        subTotal: input.costo * cant,
        
      });
     
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setErrors(Validate(input));
    const errors = Validate(input);

    if(data.state.edit === true){
      await dispatch(putTransac(input))
      history.push('/order/'+input.orderNumber);
    }

    if(data.state.edit === false){
      await dispatch(postTransac(input));
      
      const initValue = "default";
      
      document.getElementById("Products").value = initValue;
      
      setInput({
        vendedorId: input.vendedorId,
        clienteId: input.clienteId,
        fecha: "",
        products: [],
        cantidad: 1,
        costo: "",
        subTotal: "",
        descripcion: "",
        inventarioId: "",
        orderNumber: "",
      });
    }
    }
    
  async function handleFinishOrder(e) {
    e.preventDefault();
    Swal.fire({
      title: 'Confirmación!',
      text: 'Desea continuar?',
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Guardar',
      denyButtonText: 'Verificar pedido',
      denyButtonColor: "#23C41C"
    }).then((result)=>{
      if (result.isConfirmed) {
        modifyOrderNumber();
        Swal.fire('Pedido cargado!', '', 'success')
      } else if (result.isDenied) {
        history.push('/order/'+input.orderNumber);
      }
    })
    
    setInput({
      vendedorId: "",
      clienteId: "",
      fecha: "",
      products: [],
      cantidad: 1,
      costo: "",
      subTotal: "",
      descripcion: "",
      inventarioId: "",
      orderNumber: "",
    });

    history.push('/user');
    const initValue = "default";

      document.getElementById("Products").value =
        initValue;

  }

  const handleChangue = () =>{

  }

  const handleCargar = () =>{
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

        setInput({
          id: "",
          vendedorId: input.vendedorId,
          clienteId: input.clienteId,
          fecha: "",
          cantidad: 1,
          costo: "",
          subTotal: "",
          descripcion: "",
          inventarioId: "",
          orderNumber: "",
         })

        modifyOrderNumber();
        pedidos && pedidos.map(async(el)=>{          
          await dispatch(postTransac(el));
        }) 

        Swal.fire('Pedido cargado!', '', 'success')
      } else if (result.isDenied) {
        dispatch(cargaPedido(input));

        setInput({
          id: "",
          vendedorId: input.vendedorId,
          clienteId: input.clienteId,
          fecha: "",
          cantidad: 1,
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
    dispatch(getAllProducts());
    dispatch(getClientsBySeller(cookies.get("userId")));

  }, [dispatch]);

  const products = useSelector((state) => state.allProducts);
  const productId = useSelector((state) => state.productId);
  const chosenSeller = useSelector((state) => state.seller);
  const chosenClient = useSelector((state) => state.client);
  const dataUser = useSelector((state) => state.user);
  const clients = useSelector((state) => state.clienstBySeller)
  
  return (

    <div>
      <h1 className={Styles.TitleForm}>Formulario Transacciones</h1>
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
            <div>{precioTotal}</div>
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
            onChange={(e) => handleChangue(e)}
          ></input>
        </div>
        <div className={Styles.input}>
          <label>Descripción</label>
          {/* <input
            name='descripcion'
            id={"descripcion"}
            type='text'
            className={Styles.input}
            onChange={(e) => handleChangue(e)}
          ></input> */}
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
           
            // pattern="^[0-9]+"
            
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
