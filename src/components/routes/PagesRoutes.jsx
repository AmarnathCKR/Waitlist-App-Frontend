import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
  subscribeToken,
  subscribeUser,
  unsuscribeToken,
  toogleLoading,
} from "../../store/store";
import { NavbarDefault } from "../Layout/NavbarDefault";
import HomePage from "../pages/HomePage";
import { getAnyApi } from "../../api/api";

function PagesRoutes() {
  const [login, setLogin] = useState(false);
  const [sign, setSign] = useState(false);
  const [token, setToken] = useState(null);
  const dispatch = useDispatch();
    useEffect(() => {
      const localToken = localStorage.getItem("token");

      if (localToken) {
        dispatch(toogleLoading());
        getAnyApi("user/verifytoken", localToken)
          .then((res) => {
            dispatch(subscribeUser(res.data));
            dispatch(subscribeToken(localToken));
            dispatch(toogleLoading());
          })
          .catch((err) => {
            if (err.response.data.data.errors[0].code === "USER_BLOCKED") {
              localStorage.removeItem("token");
              dispatch(unsuscribeToken());
              dispatch(toogleLoading());
            }
          });
          setToken(true);
      }else{
        setToken(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const auth = useSelector((state) => state.token);
    console.log(auth);
    if (token === null) {
      return;
    }

  return (
    <div className="w-full p-2 bg-white dark:bg-gray-900">
      <BrowserRouter>
        <NavbarDefault
          toggleLogin={() => {
            setLogin(!login);
          }}
          toggleSign={() => {
            setSign(!sign);
          }}
          className="z-0"
        />

        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                login={login}
                sign={sign}
                toggleLogin={() => {
                  setLogin(!login);
                }}
                toggleSign={() => {
                  setSign(!sign);
                }}
              />
            }
          />
          {/* <Route
            path="account/*"
            element={
              <AccountRouter
                login={login}
                toggleLogin={() => {
                  setLogin(!login);
                }}
              />
            }
          />

          <Route
            path="manage/*"
            element={
              auth ? (
                <ManageMovies />
              ) : (
                <AccountRouter
                  login={login}
                  toggleLogin={() => {
                    setLogin(!login);
                  }}
                />
              )
            }
          />
          <Route path="details/:id" element={<MovieDetail />} />
          <Route
            path="watchlater/*"
            element={
              auth ? (
                <WatchLater />
              ) : (
                <AccountRouter
                  login={login}
                  toggleLogin={() => {
                    setLogin(!login);
                  }}
                />
              )
            }
          /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default PagesRoutes;
