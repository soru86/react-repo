import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useRedisCache } from "../../hooks/useRedisCache";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [authData, setAuthData] = useRedisCache(null);
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const postLogin = async (data) => {
    if (data?.user?.auth_type === 'google') {
      const aData = await setAuthData('login', data?.user, data?.user);
      setUser({
        user: {
          ...aData
        }
      });
    } else if (data?.user?.auth_type === 'basic') {
      setUser(data);
      await setAuthData('login', data?.user, data?.user);
    }
    navigate("/landing", { replace: true });
  };

  // call this function to sign out logged in user
  const postLogout = async (lsData) => {
    setUser(null);
    await setAuthData('logout', lsData?.user, null);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      authData,
      postLogin,
      postLogout,
    }),
    [user, authData]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};