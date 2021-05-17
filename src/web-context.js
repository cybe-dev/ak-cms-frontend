import { createContext, useContext, useReducer } from "react";

const WebContext = createContext();

export const useWeb = () => useContext(WebContext);

const reducer = (state, action) => {
  switch (action.type) {
    case "auth":
      return {
        ...state,
        auth: action.value,
      };
    case "sidebarToggle":
      return {
        ...state,
        sidebarExpanded: !state.sidebarExpanded,
      };
    case "sidebarExpanded":
      return {
        ...state,
        sidebarExpanded: action.value,
      };
    case "titlePage":
      return {
        ...state,
        titlePage: action.value,
      };
    case "formMapping":
      return {
        ...state,
        formMapping: action.value,
      };
    case "basicInformation":
      return {
        ...state,
        basicInformation: {
          ...state.basicInformation,
          ...action.value,
        },
      };
    default:
      throw new Error();
  }
};

export default function WebProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    auth: false,
    sidebarExpanded: true,
    titlePage: "Dashboard",
    formMapping: {},
    basicInformation: {},
  });
  return (
    <WebContext.Provider value={{ state, dispatch }}>
      {children}
    </WebContext.Provider>
  );
}
