import React, {useState, useEffect} from "react";
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
} from "../../redux/action";
import getDate from "../../utils/functions/getDate";
import Cookies from "universal-cookie";

export default function NewTransactions() {
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(async () => {
    await dispatch(openTransaction());
  }, [dispatch]);

  const [input, setInput] = useState({
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

  const fecha = getDate();

  function handleSelectSellers(e) {
    dispatch(getSellersId(e.target.value));
    setInput({
      ...input,
      vendedorId: e.target.value,
    });
    dispatch(getClientsBySeller(e.target.value));
  }

  if (input.vendedorId) {
    const initValue = "sellerSelect";
    document.getElementById("Sellers").value = initValue;
  }

  function handleSelectClients(e) {
    dispatch(getClientById(e.target.value));

    setInput({
      ...input,
      clienteId: e.target.value,
    });
  }

  if (input.clienteId) {
    const initValue = "clientSelect";
    document.getElementById("Clients").value = initValue;
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
      console.log(nroPedido.payload[0].nroPedido);
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
    } else {
      e.target.value = input.descripcion;
      return alert(
        "Ya has añadido este producto a la lista. Seleccione otro producto o continúe completando el formulario."
      );
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
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

  async function handleFinishOrder(e) {
    e.preventDefault();
    await modifyOrderNumber();
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

    const initValue = "default";

    document.getElementById("Sellers").value =
      document.getElementById("Clients").value =
      document.getElementById("Products").value =
        initValue;

    // dispatch(closeTransaction());
    history.push("/");
  }

  useEffect(() => {
    dispatch(getAllSellers());
    dispatch(getAllProducts());
  }, [dispatch]);

  const products = useSelector((state) => state.allProducts);

  const productId = useSelector((state) => state.productId);

  const sellers = useSelector((state) => state.allSellers);

  const clients = useSelector((state) => state.clienstBySeller);

  const chosenSeller = useSelector((state) => state.seller);

  const chosenClient = useSelector((state) => state.client);
  console.log(chosenClient);

  return (
    <div className={Styles.containMaster}>
      <div className={Styles.contain}>
        <div className={Styles.description}>
          <form className={Styles.form} onSubmit={(e) => handleSubmit(e)}>
            <div className={Styles.masterOrden}>
              <div className={Styles.containOrden}>
                <div>Orden de compra nro: {input.orderNumber}</div>
                <div>{fecha}</div>
              </div>
            </div>
            <div className={Styles.masterSellClient}>
              <div className={Styles.containSellClient}>
                <select
                  className={Styles.select}
                  id={"Sellers"}
                  defaultValue={"default"}
                  onChange={(e) => handleSelectSellers(e)}
                >
                  <option name={"default"} value={"default"} disabled>
                    Seleccionar Vendedor
                  </option>
                  {!input.vendedorId ? (
                    sellers &&
                    sellers.map((el) => (
                      <option value={el.vendedor.id} key={el.vendedor.name}>
                        {el.vendedor.name}
                      </option>
                    ))
                  ) : (
                    <option value={"sellerSelect"}>
                      Vendedor seleccionado
                    </option>
                  )}
                </select>
                <select
                  className={Styles.select}
                  id={"Clients"}
                  defaultValue={"default"}
                  onChange={(e) => handleSelectClients(e)}
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

            <div className={Styles.masterChosenPeople}>
              <div className={Styles.containChosenPeople}>
                <div className={Styles.chosenSeller}>{chosenSeller}</div>
                <div className={Styles.chosenClient}>{chosenClient}</div>
              </div>
            </div>
            {/* <div className={Styles.principalProduct}> */}
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
                  <div className={Styles.buttonAdd}>
                    <input
                      className={Styles.btn}
                      type='submit'
                      value='Agregar'
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* </div> */}
          </form>
          <div className={Styles.containFinishOrder}>
            <div className={Styles.finishOrder}>
              <button
                className={Styles.btn}
                onClick={(e) => handleFinishOrder(e)}
              >
                Finalizar Pedido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
