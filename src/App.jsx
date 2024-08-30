import { useContext, useEffect } from "react";
import "./App.scss";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Context } from "./main";
import Loader from "./components/Loader/Loader";
import Login from "./pages/Login/Login";
import PostSignal from "./pages/PostSignal/PostSignal";
import PrivateRoute from "./components/PrivateRoute";
import useFetchUser from "./components/Hook/useFetchUser";
import Navbar from "./components/Navbar/Navbar";
import Signals from "./pages/Signals/Signals";
import VerifyMembership from "./pages/VerifyMemebership/VerifyMembership";

function App() {
  const { isAuthorized, loading } = useContext(Context);
  const { fetchUser } = useFetchUser();
  useEffect(() => {
    fetchUser();
  }, [isAuthorized]);
  return (
    <Router>
      <Navbar/>
      {loading ? (
        <Loader />
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route
            path="/verify-membership"
            element={
              <PrivateRoute isAuthorized={isAuthorized}>
                <VerifyMembership />
              </PrivateRoute>
            }
          />
          <Route
            path="/post-signal"
            element={
              <PrivateRoute isAuthorized={isAuthorized}>
                <PostSignal />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute isAuthorized={isAuthorized}>
                <Signals />
              </PrivateRoute>
            }
          />
        </Routes>
      )}
    </Router>
  );
}

export default App;
