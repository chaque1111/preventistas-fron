import Cookies from "universal-cookie";

const initialState = {
  localidades: [],
  allClients: [],
  clienstBySeller: [],
  clienstBySellerCopy: [],
  client: "",
  seller: "",
  allProducts: [],
  allProductsCopy: [],
  allSellers: [],
  user: [],
  productId: {},
  orderNumber: "",
  orderByNumber: [],
  estado: true,
};

function reducer(state = initialState, {type, payload}) {
  const cookie = new Cookies();
  switch (type) {
    case "GET_SELLERS":
      return {
        ...state,
        allSellers: payload,
      };

    case "GET_SELLERS_ID":
      return {
        ...state,
        seller: payload.name,
      };

    case "GET_ORDER_BY_NUMBER":
      return {
        ...state,
        orderByNumber: payload,
      };

    case "FILTER_BY_SELLERS":
      const allSellers = state.allSellers;

      const sellerFilter = allSellers.filter(
        (el) => el.vendedor.name === payload
      );

      return {
        ...state,
        selectClients: sellerFilter,
      };
    case "GET_CLIENTS":
      return {
        ...state,
        allClients: payload,
      };

    case "LOG_ING":
      cookie.set("userId", payload.id, {path: "/"});
      cookie.set("userName", payload.name, {path: "/"});
      cookie.set("userlocalidad", payload.localidad, {path: "/"});
      return {
        ...state,
        user: payload,
      };
    case "GET_CLIENTS":
      return {
        ...state,
        allClients: payload,
      };
    case "CLIENTS_BY_SELLER":
      return {
        ...state,
        clienstBySeller: payload,
        clienstBySellerCopy: payload,
      };
    case "GET_CLIENT_BY_ID":
      cookie.set("clientId", payload.id, {path: "/"});
      cookie.set("clientName", payload.name, {path: "/"});
      return {
        ...state,
        selectClient: payload,
        client: payload.name,
      };
    case "SEARCH_CLIENT":
      return {
        ...state,
        clienstBySeller: payload,
      };

    case "FILTER_CLIENTS":
      return {
        ...state,
        clienstBySeller: payload,
      };
    case "REFRESH_CLIENTS":
      return {
        ...state,
        clienstBySeller: state.clienstBySellerCopy,
      };

    //products
    case "GET_PRODUCTS":
      return {
        ...state,
        allProducts: payload,
        allProductsCopy: payload,
      };
    case "SEARCH_PRODUCT":
      return {
        ...state,
        allProducts: payload,
      };

    case "GET_PRODUCT_ID":
      return {
        ...state,
        productId: payload,
      };
    case "REFRESH_PRODUCTS":
      return {
        ...state,
        allProducts: state.allProductsCopy,
        allProductsCopy: state.allProductsCopy,
      };

    case "GET_ORDER_NUMBER":
      return {
        ...state,
        orderNumber: payload,
      };

    case "OPEN_TRANSACTION":
      return {
        ...state,
        estado: false,
      };

    case "CLOSE_TRANSACTION":
      return {
        ...state,
        estado: true,
      };
    case "GET_LOCALIDADES":
      return {
        ...state,
        localidades: payload,
      };

    default:
      return state;
  }
}

export default reducer;
