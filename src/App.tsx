import React, { FC } from "react";
import { useSelector } from "react-redux";
import AppView from "./views/appView/app";
import AuthView from "./views/authView";

interface IRootState {
  auth: {
    isLogged: boolean;
    id: string | null;
    username: string | null;
    image: string | null;
    token: string | null;
  };
}

const App: FC = () => {
  const isAuth = useSelector((state: IRootState) => state.auth.isLogged);

  return isAuth ? <AppView /> : <AuthView />;
};

export default App;
