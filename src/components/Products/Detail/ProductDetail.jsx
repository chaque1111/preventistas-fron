import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {
  getProductId,
  deleteProduct,
  getAllProducts,
} from "../../../redux/action";
import styles from "../Detail/ProductDetail.module.css";

export default function ProductDetail(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.productId);

  const handleDelete = (e) => {
    dispatch(deleteProduct(e.target.value));
    dispatch(getAllProducts());
    history.push("/products");
  };

  useEffect(() => {
    dispatch(getProductId(props.match.params.id));
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.containInfo}>
        <div className={styles.cardInfo}>
          <div className={styles.buttons}>
            <button
              value={product.id}
              onClick={(e) => handleDelete(e)}
              className={styles.eliminar}
            >
              eliminar{" "}
            </button>
            <button className={styles.editar}>editar</button>
          </div>
          <h1>{product.descripcion}</h1>
          <img className={styles.imageProduct} src={product.imagen} alt='' />
          <h2>codigo: {product.id}</h2>
          <h2>Stock Actual: {product.stockActual ? product.stockActual : 0}</h2>
          <h2>Costo: ${product.costo}</h2>
          <h2>
            tipo de stock:{" "}
            {!product.tipoStock ? "no definido" : product.tipoStock}
          </h2>{" "}
        </div>
      </div>
    </div>
  );
}
