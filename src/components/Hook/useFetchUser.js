
import { useContext, useCallback } from "react";
import axios from "axios";
import { Context } from "../../main";

const useFetchUser = () => {
  const { setUser, setIsAuthorized, setLoading, user } = useContext(Context);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const {data} = await axios.get(`${import.meta.env.VITE_API_URL}/me`, {
        withCredentials: true,
      });
      if(data.admin.role === "admin"){
        setUser(data.user);
        setIsAuthorized(true);
      }
    } catch (error) {
      setIsAuthorized(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [setUser, setIsAuthorized, setLoading]);

  return { fetchUser, user };
};

export default useFetchUser;
