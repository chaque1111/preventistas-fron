import React, {useEffect, useState} from "react";
import {useDispatch, useSelector, useStore} from "react-redux";
import {getAllProducts, refreshProducts} from "../../redux/action";
import ProductCard from "./Card/ProductCard";
import SeachBarProduct from "./SearchBar/SearchBarProduct.jsx";
import Paginado from "../Products/Paginado/ProductPaginado";
import styles from "../Products/Products.module.css";

import {Link} from "react-router-dom";
export default function () {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.allProducts);
  const [productPerPage, SetProductPerPage] = useState(15);
  const [ProductPage, SetProductPage] = useState(1);
  const indexLastProduct = productPerPage * ProductPage;
  const indexFirstProduct = indexLastProduct - productPerPage;
  const productSlice = products.slice(indexFirstProduct, indexLastProduct);

  const handleRefresh = () => {
    SetProductPage(1);
    dispatch(refreshProducts());
  };

  const setPageProduct = (number) => {
    SetProductPage(number);
  };

  useEffect(() => {
    dispatch(getAllProducts());
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.containTitle}>
          <h1 className={styles.title}>Productos</h1>
        </div>{" "}
        <div className={styles.containButton}>
          <button className={styles.logout}>
            <img
              className={styles.img}
              src='https://res.cloudinary.com/dw83apcj7/image/upload/v1674792204/3917349_p0mgkg.svg'
              alt=''
            />{" "}
            Cerrar Sesión
          </button>
        </div>
      </div>
      <div className={styles.containBody}>
        <div className={styles.containMenu}>
          <div className={styles.containOptions}>
            <h1 className={styles.text}>Buscar</h1>
            <div className={styles.search}>
              <SeachBarProduct />
            </div>
            <h1 className={styles.text}>Opciones</h1>
            <select className={styles.selectFilter}>
              <option disabled selected hidden>
                Filtrar...
              </option>
            </select>{" "}
            <Link className={styles.productPostLink} to={"/productPost"}>
              <button className={styles.addButton}>
                <img
                  className={styles.iconAdd}
                  src='https://res.cloudinary.com/dw83apcj7/image/upload/v1675369486/crearIcon_ik4nrk_q7bc04.svg'
                  alt=''
                />{" "}
                agregar producto
              </button>
            </Link>
            <button onClick={(e) => handleRefresh()} className={styles.refresh}>
              <img
                className={styles.iconReload}
                src='https://res.cloudinary.com/dw83apcj7/image/upload/v1674866264/3917765_oub0vd.svg'
                alt=''
              />{" "}
              Recargar
            </button>
          </div>
          <div className={styles.containPaginado}>
            <Paginado
              products={products.length}
              productsPerPage={productPerPage}
              setPage={setPageProduct}
            />
          </div>
        </div>

        <div className={styles.cardContain}>
          {productSlice.length ? (
            productSlice.map((e) => {
              return (
                <div className={styles.card} key={e.id}>
                  <Link className={styles.link} to={"/product/" + e.id}>
                    <ProductCard
                      name={e.descripcion}
                      costo={Math.floor(e.costo)}
                      imagen={e.imagen}
                    />
                  </Link>
                </div>
              );
            })
          ) : (
            <h1>loading</h1>
          )}
        </div>
      </div>
    </div>
  );
}
