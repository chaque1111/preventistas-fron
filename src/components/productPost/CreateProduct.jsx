import {React, useState} from "react";
import {useDispatch} from "react-redux";
import {createProduct} from "../../redux/action";
import styles from "../productPost/CreateProduct.module.css";
export default function CreateProduct() {
  const dispatch = useDispatch();
  const [error, setError] = useState({});
  const [product, setProduct] = useState({
    id: "",
    descripcion: false,
    rubro: false,
    imagen: "",
    rubro2: false,
    costo: false,
    stockActual: false,
    tipoStock: false,
  });

  const [loading, setLoading] = useState(false);

  const upLoadImage = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "PreventistasImages");
    setLoading(true);
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dw83apcj7/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const file = await res.json();
    setProduct({
      ...product,
      imagen: file.secure_url,
    });
  };

  const handleChangueForm = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
    setError(
      validate({
        ...product,
        [e.target.name]: e.target.value,
      })
    );
    console.log(error);
  };

  const handleSubmit = () => {
    dispatch(createProduct(product));
  };

  const validate = (input) => {
    let error = {};
    //id
    if (input.id === "") {
      error.id = "Campo obligatorio";
    } else if (parseInt(input.id) <= 0) {
      error.id = "Ingresa números positivos";
    } //descripcion
    else if (!input.descripcion && input.descripcion === "") {
      error.descripcion = "Campo obligatorio";
    } //rubro
    else if (!input.rubro && input.rubro === "") {
      error.rubro = "Campo obligatorio";
    } else if (parseInt(input.rubro) <= 0) {
      error.rubro = "Ingresa números positivos";
    } //rubro2
    else if (!input.rubro2 && input.rubro2 === "") {
      error.rubro2 = "Campo obligatorio";
    } else if (parseInt(input.rubro2) <= 0) {
      error.rubro2 = "Ingresa números positivos";
    } //costo
    else if (input.costo !== false && input.costo === "") {
      error.costo = "Campo obligatorio";
    } else if (input.costo !== false && input.costo <= 0) {
      error.costo = "Ingresa números positivos";
    } //stockActual
    else if (input.stockActual !== false && input.stockActual === "") {
      error.stockActual = "Campo obligatorio";
    } else if (input.stockActual !== false && input.stockActual <= 0) {
      error.stockActual = "Ingresa números positivos";
    } //tipoStock
    else if (input.tipoStock !== false && input.tipoStock === "") {
      error.tipoStock = "Campo obligatorio";
    }

    return error;
  };

  return (
    <div className={styles.container}>
      <div className={styles.containContenido}>
        <div className={styles.header}>
          <h1 className={styles.title}>Crea tu Producto</h1>
        </div>

        <div className={styles.containForm}>
          <div className={styles.titleFormContain}>
            <img
              className={styles.productIcon}
              src='https://res.cloudinary.com/dw83apcj7/image/upload/v1674185052/boxes-stacked-solid_ypy7tb.svg'
              alt=''
            />
            <h1 className={styles.titleForm}>
              Ingresa los datos correspondientes
            </h1>
          </div>
          <div className={styles.containInputs}>
            <div className={styles.divisionContainer}>
              <div className={styles.inputsText}>
                <h1 className={styles.codigo}>
                  {" "}
                  <div className={styles.containError}>
                    Código
                    <input
                      key='id'
                      name='id'
                      onChange={(e) => handleChangueForm(e)}
                      className={styles.input}
                      type='text'
                      placeholder={error.id}
                      autoComplete='off'
                    />{" "}
                    {error.id && (
                      <img
                        className={styles.errorIcon}
                        src='https://res.cloudinary.com/dw83apcj7/image/upload/v1674268302/exclamation_axotld.svg'
                        alt=''
                      />
                    )}{" "}
                  </div>
                  {error.id && error.id !== "Campo obligatorio" && (
                    <p className={styles.error}>{error.id}</p>
                  )}
                </h1>
                <h1 className={styles.codigo}>
                  <div className={styles.containError}>
                    Nombre{" "}
                    <input
                      key='descripcion'
                      name='descripcion'
                      onChange={(e) => handleChangueForm(e)}
                      className={styles.input}
                      type='text'
                      placeholder={error.descripcion}
                      autoComplete='off'
                    />
                    {error.descripcion && (
                      <img
                        className={styles.errorIcon}
                        src='https://res.cloudinary.com/dw83apcj7/image/upload/v1674268302/exclamation_axotld.svg'
                        alt=''
                      />
                    )}
                  </div>
                  {error.descripcion &&
                    error.descripcion !== "Campo obligatorio" && (
                      <p className={styles.error}>{error.descripcion}</p>
                    )}
                </h1>
                <h1 className={styles.codigo}>
                  <div className={styles.containError}>
                    Rubro 1{" "}
                    <input
                      key='rubro'
                      name='rubro'
                      onChange={(e) => handleChangueForm(e)}
                      className={styles.input}
                      type='number'
                      placeholder={error.rubro}
                      autoComplete='off'
                    />
                    {error.rubro && (
                      <img
                        className={styles.errorIcon}
                        src='https://res.cloudinary.com/dw83apcj7/image/upload/v1674268302/exclamation_axotld.svg'
                        alt=''
                      />
                    )}{" "}
                  </div>
                  {error.rubro && error.rubro !== "Campo obligatorio" && (
                    <p className={styles.error}>{error.rubro}</p>
                  )}
                </h1>
                <h1 className={styles.codigo}>
                  {" "}
                  <div className={styles.containError}>
                    Rubro 2{" "}
                    <input
                      key='rubro2'
                      name='rubro2'
                      onChange={(e) => handleChangueForm(e)}
                      className={styles.input}
                      type='number'
                      placeholder={error.rubro2}
                      autoComplete='off'
                    />{" "}
                    {error.rubro2 && (
                      <img
                        className={styles.errorIcon}
                        src='https://res.cloudinary.com/dw83apcj7/image/upload/v1674268302/exclamation_axotld.svg'
                        alt=''
                      />
                    )}{" "}
                  </div>
                  {error.rubro2 && error.rubro2 !== "Campo obligatorio" && (
                    <p className={styles.error}>{error.rubro2}</p>
                  )}
                </h1>

                <h1 className={styles.codigo}>
                  <div className={styles.containError}>
                    Costo{" "}
                    <input
                      name='costo'
                      onChange={(e) => handleChangueForm(e)}
                      className={styles.input}
                      placeholder={error.costo}
                      autoComplete='off'
                    />{" "}
                    {error.costo && (
                      <img
                        className={styles.errorIcon}
                        src='https://res.cloudinary.com/dw83apcj7/image/upload/v1674268302/exclamation_axotld.svg'
                        alt=''
                      />
                    )}{" "}
                  </div>
                  {error.costo && error.costo !== "Campo obligatorio" && (
                    <p className={styles.error}>{error.costo}</p>
                  )}
                </h1>
                <h1 className={styles.codigo}>
                  <div className={styles.containError}>
                    Stock actual{" "}
                    <input
                      name='stockActual'
                      onChange={(e) => handleChangueForm(e)}
                      className={styles.input}
                      type='number'
                      placeholder={error.stockActual}
                      autoComplete='off'
                    />
                  </div>
                  {error.stockActual &&
                    error.stockActual !== "Campo obligatorio" && (
                      <p className={styles.error}>{error.stockActual}</p>
                    )}
                </h1>
                <h1 className={styles.codigo}>
                  {" "}
                  <div className={styles.containError}>
                    Tipo de stock{" "}
                    <input
                      name='tipoStock'
                      onChange={(e) => handleChangueForm(e)}
                      className={styles.input}
                      type='text'
                      placeholder={error.tipoStock}
                      autoComplete='off'
                    />{" "}
                    {error.tipoStock && (
                      <img
                        className={styles.errorIcon}
                        src='https://res.cloudinary.com/dw83apcj7/image/upload/v1674268302/exclamation_axotld.svg'
                        alt=''
                      />
                    )}{" "}
                  </div>
                  {error.tipoStock &&
                    error.tipoStock !== "Campo obligatorio" && (
                      <p className={styles.error}>{error.tipoStock}</p>
                    )}
                </h1>
              </div>
              {!product.imagen.length ? (
                <div id='12' className={styles.inputFileContainer}>
                  <h1 className={styles.selecImageTextFalse}>Agregar Imagen</h1>
                  <label for='files' className={styles.label}>
                    <h1>+</h1>
                  </label>
                  <input
                    onChange={upLoadImage}
                    id='files'
                    className={styles.inputFile}
                    type='file'
                  />
                </div>
              ) : (
                <div id='13' className={styles.inputFileContainer}>
                  <h1 className={styles.selecImageTextTrue}>Imagen Agregada</h1>
                  <label for='files' className={styles.label}>
                    <img
                      className={styles.imageProduct}
                      src={product.imagen}
                      alt=''
                    />
                  </label>
                  <input
                    onChange={upLoadImage}
                    id='files'
                    className={styles.inputFile}
                    type='file'
                  />
                </div>
              )}
            </div>
            <button onClick={(e) => handleSubmit()} className={styles.button}>
              Crear
            </button>
          </div>
        </div>
      </div>
      <div className={styles.containImage}>
        <img
          className={styles.image}
          src='https://res.cloudinary.com/dw83apcj7/image/upload/v1674495650/logo2_d7kkf1.png'
        />
      </div>
    </div>
  );
}
