import React, {useState, useEffect} from "react";
import {useLocation} from "react-router";
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
} from "../../redux/action";
import getDate from "../../utils/functions/getDate";
import Cookies from "universal-cookie";

const Swal = require("sweetalert2");

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
  const order = useSelector((state) => state.orderId);
  useEffect(async () => {
    await dispatch(openTransaction());
    await dispatch(getSellersId(cookies.get("userId")));
  }, [dispatch]);

  const [errors, setErrors] = useState({});
  let data = useLocation();
  const [input, setInput] = useState({
    id: "",
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

  const sellers = cookies.get("userName");

  const fecha = getDate();

  let estado = "";

  data.state.edit === true ? (estado = "Modificar") : (estado = "Agregar");

  if (data.state.edit === true && !input.clienteId && !input.descripcion) {
    (async function editImput() {
      const order = await dispatch(getOrderById(data.state.orderId));
      console.log(order.payload[0]);
      let cantidad = order.payload[0].cantidad;
      let descripcion = order.payload[0].descripcion;
      let products = [];

      for (let i = 0; i < cantidad; i++) {
        products.push(descripcion);
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
      });
      document.getElementById("Products").value = order.payload[0].inventarioId;
    })();
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
    document.getElementById("Clients").style.display = "none";
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

  function handleAddProd(e) {
    e.preventDefault();
    if (input.descripcion) {
      setInput({
        ...input,
        cantidad: input.cantidad + 1,
        products: [...input.products, input.descripcion],
        subTotal: input.costo * (input.cantidad + 1),
      });
    }
  }

  function handleSubProd(e) {
    e.preventDefault();
    if (input.descripcion && input.cantidad > 1) {
      input.products.splice(input.products.length - 1, 1);
      setInput({
        ...input,
        cantidad: input.cantidad - 1,
        products: input.products,
        subTotal: input.costo * (input.cantidad - 1),
      });
    }
  }

  async function handleSelectProducts(e) {
    if (
      !input.products.includes(e.target.value) &&
      e.target.value !== "Seleccionar producto"
    ) {
      input.products.splice(0, input.products.length);
      setInput({
        ...input,
        cantidad: 1,
        products: input.products,
        descripcion: "",
      });

      const idProduct = await dispatch(getProductId(e.target.value));
      const iva = 1 + idProduct.payload.porcentaje / 100;
      const unitCost = parseInt(idProduct.payload.costoBonif);
      const unitCostIva = unitCost + iva;

      setInput({
        ...input,
        cantidad: 1,
        products: [...input.products, idProduct.payload.descripcion],
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
      );
    } else {
      e.target.value = input.descripcion;
      return alert(
        "Ya has añadido este producto a la lista. Seleccione otro producto o continúe completando el formulario."
      );
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setErrors(Validate(input));
    const errors = Validate(input);

    if (data.state.edit === true) {
      await dispatch(putTransac(input));
      history.push("/order/" + input.orderNumber);
    }

    if (data.state.edit === false) {
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
      title: "Confirmación!",
      text: "Desea continuar?",
      icon: "question",
      showDenyButton: true,
      confirmButtonText: "Guardar",
      denyButtonText: "Verificar pedido",
      denyButtonColor: "#23C41C",
    }).then((result) => {
      if (result.isConfirmed) {
        modifyOrderNumber();
        Swal.fire("Pedido cargado!", "", "success");
      } else if (result.isDenied) {
        history.push("/order/" + input.orderNumber);
      }
    });

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

    history.push("/user");
    const initValue = "default";

    document.getElementById("Products").value = initValue;
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
  const clients = useSelector((state) => state.clienstBySeller);

  return (
    <div className={Styles.containMaster}>
      <div className={Styles.contain}>
        <div className={Styles.description}>
          <form className={Styles.form} onSubmit={(e) => handleSubmit(e)}>
            <div className={Styles.containOrden}>
              <h1>Vendedor: {sellers}</h1>
              <div className={Styles.containNumberOrder}>
                <h1>Orden de Compra Número: {input.orderNumber}</h1>
                <h1>{fecha}</h1>
              </div>
            </div>

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
                {input.clienteId ? (
                  <div id={"chosenClient"} className={Styles.chosenClient}>
                    Cliente: {cookies.get("clientName")}
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
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

                <div>Cantidad: {input.cantidad}</div>
                <div className={Styles.principalCantidad}>
                  <div className={Styles.masterButton}>
                    <div className={Styles.containButton}>
                      <button
                        className={Styles.btnCant}
                        onClick={(e) => handleAddProd(e)}
                      >
                        +
                      </button>

                      <button
                        className={Styles.btnCant}
                        onClick={(e) => handleSubProd(e)}
                      >
                        -
                      </button>
                    </div>
                  </div>
                </div>
                <div className={Styles.containButtonAdd}>
                  <div id={"add"} className={Styles.buttonAdd}>
                    <input
                      className={Styles.btn}
                      type='submit'
                      value={estado}
                    />
                  </div>
                </div>
              </div>
            </div>
            {errors.products && <h6>{errors.products}</h6>}
          </form>
        </div>
      </div>{" "}
      {data.state.edit === false ? (
        <div className={Styles.containFinishOrder}>
          <div className={Styles.finishOrder}>
            <button
              id='Finish'
              className={Styles.btn}
              onClick={(e) => handleFinishOrder(e)}
            >
              Finalizar Pedido
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
