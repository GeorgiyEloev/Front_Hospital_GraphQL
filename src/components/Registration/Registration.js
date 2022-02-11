import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  TextField,
  Container,
  Button,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useMutation } from "@apollo/client";
import logo from "../../img/logo.png";
import Vector from "../../img/Vector.png";
import { SIGN_UP } from "../../request/userRequest";
import {
  WAR_LOGIN,
  WAR_PASSWORD,
  PAS_NO_MATCHES,
} from "../../constants/snackbarMessage";
import "../LoginRegist.scss";

const Registration = () => {
  const [singUp, { data }] = useMutation(SIGN_UP);

  const [dataLogin, dataLoginEdit] = useState({
    login: "",
    password: "",
    rePassword: "",
  });

  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    status: "",
  });

  const navigation = useNavigate();

  useEffect(() => {
    if (data) {
      localStorage.setItem("token", `Bearer ${data.addNewUser.token}`);
      navigation("/main");
    }
  }, [data, navigation]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const Alert = React.forwardRef((props, ref) => {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const state = {
    vertical: "top",
    horizontal: "center",
  };

  const { message, status } = snackbar;
  const { vertical, horizontal } = state;
  const { login, password, rePassword } = dataLogin;

  const snackbarParams = (message, status) => {
    setSnackbar({
      message,
      status,
    });
    handleClick();
  };

  const checkPasswordAndLogin = (errorStatus) => {
    if (!login.match(/^[a-z\d]{6,}$/gi)) {
      errorStatus.status = "warning";
      errorStatus.cleanForm = {
        login: "",
      };
      throw new Error(WAR_LOGIN);
    }
    if (!password.match(/^(?=.*\d)[a-z\d]{6,}$/gi)) {
      errorStatus.status = "warning";
      errorStatus.cleanForm = {
        password: "",
        rePassword: "",
      };
      throw new Error(WAR_PASSWORD);
    }
    if (!(password === rePassword)) {
      errorStatus.status = "warning";
      errorStatus.cleanForm = {
        rePassword: "",
      };
      throw new Error(PAS_NO_MATCHES);
    }
  };

  const loginSystem = async () => {
    const errorStatus = {
      status: "error",
      cleanForm: { login: "", password: "", rePassword: "" },
    };
    try {
      checkPasswordAndLogin(errorStatus);
      await singUp({ variables: { input: { login, password } } });
    } catch (err) {
      dataLoginEdit({
        ...dataLogin,
        ...errorStatus.cleanForm,
      });
      snackbarParams(err.message, errorStatus.status);
    }
  };

  return (
    <div className="login-main">
      <AppBar className="label-header">
        <img src={logo} alt="logo" />
        <h1>Зарегистрироваться в системе</h1>
      </AppBar>
      <Container className="container-style">
        <img src={Vector} alt="Vector" className="img-vector" />
        <Box className="box-style">
          <div className="group-login">
            <h1>Регистрация</h1>
            <p>Login:</p>
            <TextField
              id="outlined-required"
              value={login}
              onChange={(event) =>
                dataLoginEdit({
                  login: event.target.value,
                  password,
                  rePassword,
                })
              }
            />
            <p>Password:</p>
            <TextField
              hiddenLabel
              id="outlined-password-input-1"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) =>
                dataLoginEdit({
                  login,
                  password: event.target.value,
                  rePassword,
                })
              }
            />
            <p>Repeat password:</p>
            <TextField
              hiddenLabel
              id="outlined-password-input-2"
              type="password"
              autoComplete="current-password"
              value={rePassword}
              onChange={(event) =>
                dataLoginEdit({
                  login,
                  password,
                  rePassword: event.target.value,
                })
              }
            />
          </div>
          <div className="group-button">
            <Button
              className="button-style"
              variant="outlined"
              onClick={() => loginSystem()}
            >
              Зарегистрироваться
            </Button>
            <Button
              className="button-style"
              variant="text"
              onClick={() => navigation("/login")}
            >
              Авторизоваться
            </Button>
          </div>
        </Box>
      </Container>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={10000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={status} className="alert-style">
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Registration;
