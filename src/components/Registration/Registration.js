import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AppBar,
  Box,
  TextField,
  Container,
  Button,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import logo from "../../img/logo.png";
import Vector from "../../img/Vector.png";
import "../LoginRegist.scss";

const Registration = () => {
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

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const Alert = React.forwardRef((props, ref) => {
    return (
      <MuiAlert
        elevation={6}
        ref={ref}
        variant="filled"
        {...props}
      />
    );
  });

  const state = {
    vertical: "top",
    horizontal: "center",
  };

  const { message, status } = snackbar;
  const { vertical, horizontal } = state;
  const { login, password, rePassword } = dataLogin;

  const passwordRegular = password.match(/^(?=.*\d)[a-z\d]{6,}$/gi);
  const loginRegular = login.match(/^[a-z\d]{6,}$/gi);

  const messageWarPassword = `Длина пароля не меньше 6 символов. 
  Все символы латинского алфавита.Пароль должен содержать обязательно 
  хотя бы одно число.!!!`;
  const messageWarLogin = `Длина логина не меньше 6 символов. 
  Все символы латинского алфавита или цифры!!!`;

  const snackbarParams = (message, status) => {
    setSnackbar({
      message,
      status,
    });
    handleClick();
  };

  const loginSystem = async () => {
    if (loginRegular) {
      if (passwordRegular) {
        if (password === rePassword) {
          await axios
            .post("http://localhost:8000/user/addNewUser", {
              login: login.trim(),
              password: password.trim(),
            })
            .then((results) => {
              localStorage.setItem("token", results.data.data.token);
              navigation("/main");
            })
            .catch((err) => {
              dataLoginEdit({
                login: "",
                password: "",
                rePassword: "",
              });
              snackbarParams("Логин занят!!!", "error");
            });
        } else {
          dataLoginEdit({
            login,
            password,
            rePassword: "",
          });
          snackbarParams("Пароли не совпадают!", "warning");
        }
      } else {
        dataLoginEdit({
          login,
          password: "",
          rePassword: "",
        });
        snackbarParams(messageWarPassword, "warning");
      }
    } else {
      dataLoginEdit({
        login: "",
        password,
        rePassword,
      });
      snackbarParams(messageWarLogin, "warning");
    }
  };

  return (
    <div className="login-main">
      <AppBar className="label-header">
        <img src={logo} alt="logo" />
        <h1>Зарегистрироваться в системе</h1>
      </AppBar>
      <Container className="container-style">
        <img
          src={Vector}
          alt="Vector"
          className="img-vector"
        />
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
        <Alert
          onClose={handleClose}
          severity={status}
          className="alert-style"
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Registration;
