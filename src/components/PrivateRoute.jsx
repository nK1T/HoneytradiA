
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../main";

const PrivateRoute = ({ children }) => {
  const {isAuthorized} = useContext(Context)

  if (isAuthorized ) {
    return children
  }
    
  return <Navigate to="/login" />
}
export default PrivateRoute;
