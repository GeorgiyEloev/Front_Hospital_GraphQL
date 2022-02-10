import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useQuery } from "@apollo/client";
import { AppBar, TextField, Button, MenuItem, Select } from "@mui/material";
import DateInput from "./DateInput";
import { GET_ALL_RECORDS } from "../../request/recordRequest";
import TableRecords from "../TableRecords/TableRecords";
import FilterComponent from "../FilterComponent/FilterComponent";
import SnackbarComponent from "../SnackbarComponent/SnackbarComponent";
import logo from "../../img/logo.png";
import "./Main.scss";

const Main = () => {
  const { loading, error, data } = useQuery(GET_ALL_RECORDS);

  const [filterRecords, setFilter] = useState([]);
  const [allRecords, setAllRecords] = useState([]);

  const [directionCheck, setDirectionCheck] = useState({
    sortClassName: "sort-hidden",
    directValue: "asc",
  });

  const [sortValue, setValue] = useState("_id");

  const [newRecord, setNewRecord] = useState({
    patient: "",
    doctor: "",
    date: new Date(),
    symptoms: "",
  });

  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    status: "",
    errorToken: false,
  });

  const [checkDate, setCheckDate] = useState(false);

  const navigation = useNavigate();

  const token = localStorage.getItem("token");

  const handleChange = (nameKey, event) => {
    setCheckDate(false);
    setNewRecord({
      ...newRecord,
      [nameKey]: event,
    });
  };

  const uploadAllRecords = async () => {
    // await axios
    //   .get("http://localhost:8000/record/allRecord", {
    //     headers: { authorization: token },
    //   })
    //   .then((res) => {
    //     setAllRecords(res.data.data);
    //   })
    //   .catch((err) => {
    //     if (err.response.status === 401) {
    //       snackbarParams("Ошибка авторизации!!!", "error", true);
    //     } else {
    //       snackbarParams(
    //         "Ошибка чтения записей! Обновите страницу!!!!",
    //         "warning",
    //         false
    //       );
    //     }
    //   });
  };

  useEffect(() => {
    if (!error && data) {
      setAllRecords(data.getAllRecords);
    } else if (error) {
      snackbarParams(error.message, "error", true);
    }
  }, [data, error]);

  const snackbarParams = (message, status, errorToken) => {
    setSnackbar({
      message,
      status,
      errorToken,
    });
    handleClick();
  };

  const addNewRecord = async () => {
    newRecord.date = moment(date).format("YYYY-MM-DD");
    if (patient !== "") {
      if (doctor !== "") {
        if (symptoms !== "") {
          if (
            (new Date(date) >= new Date("01-01-2021") &&
              new Date(date) <= new Date("12-31-2022")) ||
            checkDate
          ) {
            if (checkDate) {
              newRecord.date = moment().format("YYYY-MM-DD");
            }
            await axios
              .post("http://localhost:8000/record/addNewRecord", newRecord, {
                headers: { authorization: token },
              })
              .then((res) => {
                setAllRecords(res.data.data);
                if (checkDate) {
                  snackbarParams(
                    "Запись сохранена! Но дата заменена на текущую!",
                    "warning",
                    false
                  );
                } else {
                  snackbarParams("УДАЧА! Запись сохранена!", "success", false);
                }
                setNewRecord({
                  patient: "",
                  doctor: "",
                  date: new Date(),
                  symptoms: "",
                });
                setValue("_id");
                setDirectionCheck({
                  sortClassName: "sort-hidden",
                  directValue: "asc",
                });
                setCheckDate(false);
              })
              .catch((err) => {
                if (err.response.status === 401) {
                  snackbarParams("Ошибка авторизации!!!", "error", true);
                } else {
                  snackbarParams(
                    "Ошибка новой записи! Запись не сохранена!",
                    "warning",
                    false
                  );
                }
              });
          } else {
            setCheckDate(true);
            snackbarParams(
              "Не верная дата! Дата должна быть в диапазоне от 01/01/2021 до 31/12/2022",
              "warning",
              false
            );
          }
        } else {
          snackbarParams("Не указаны жалобы!", "warning", false);
        }
      } else {
        snackbarParams("Не выбран врач!", "warning", false);
      }
    } else {
      snackbarParams("Поле имени пацента пустое!", "warning", false);
    }
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const exitPage = () => {
    localStorage.clear();
    navigation("/login");
  };

  const doctors = [
    "Кириллов Алан Валерьевич",
    "Комиссаров Гаянэ Валерьянович",
    "Крылов Родион Оскарович",
    "Волкова Нина Аристарховна",
    "Громова Августа Семеновна",
    "Ковалёв Лукьян Аристархович",
    "Волкова Алина Аристарховна",
  ];

  const headerNames = [
    { key: "_id", text: "" },
    { key: "patient", text: "Имя" },
    { key: "doctor", text: "Врач" },
    { key: "date", text: "Дата" },
    { key: "symptoms", text: "Жалобы" },
  ];

  const direction = [
    { direction: "asc", text: "По возрастанию" },
    { direction: "desc", text: "По убыванию" },
  ];

  const { patient, doctor, date, symptoms } = newRecord;
  const { message, status, errorToken } = snackbar;
  const { sortClassName, directValue } = directionCheck;

  const sortAllRecords = (key, sortDirect) => {
    setFilter(
      (filterRecords.length ? filterRecords : allRecords).sort(
        (record1, record2) =>
          record1[key] > record2[key] ? 1 : record1[key] < record2[key] ? -1 : 0
      )
    );
    if (sortDirect === "desc" && sortClassName !== "sort-hidden") {
      setFilter((filterRecords.length ? filterRecords : allRecords).reverse());
    }
  };

  return (
    <div className="main">
      <AppBar className="label-header">
        <img src={logo} alt="logo" />
        <h1>Приемы</h1>
        <Button
          variant="outlined"
          className="button-exit"
          onClick={() => exitPage()}
        >
          Выход
        </Button>
      </AppBar>
      <AppBar className="label-add">
        <div className="group-input">
          <p>Имя:</p>
          <TextField
            className="input-mui"
            id="outlined-basic"
            variant="outlined"
            value={patient}
            onChange={(event) => handleChange("patient", event.target.value)}
          />
        </div>
        <div className="group-input">
          <p>Врач:</p>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            className="input-mui select-input"
            value={doctor}
            onChange={(event) => handleChange("doctor", event.target.value)}
          >
            {doctors.map((item, index) => {
              return (
                <MenuItem
                  className="input-mui select-input"
                  key={index}
                  value={item}
                >
                  {item}
                </MenuItem>
              );
            })}
          </Select>
        </div>
        <div className="group-input">
          <p>Дата:</p>
          <DateInput
            addClass="input-mui"
            defValue={date}
            nameKey="date"
            handlChange={handleChange}
          />
        </div>
        <div className="group-input">
          <p>Жалобы:</p>
          <TextField
            id="outlined-basic"
            variant="outlined"
            className="input-mui"
            value={symptoms}
            onChange={(event) => handleChange("symptoms", event.target.value)}
          />
        </div>
        <Button
          className="button-add"
          variant="outlined"
          onClick={() => addNewRecord()}
        >
          Добавить
        </Button>
      </AppBar>
      <div className="sort-filter">
        <div className="sort">
          <p>Сортировать по:</p>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            className="input-sort"
            value={sortValue}
            onChange={(event) => {
              setValue(event.target.value);
              if (event.target.value !== "_id") {
                setDirectionCheck({
                  sortClassName: "sort",
                  directValue,
                });
                sortAllRecords(event.target.value, directValue);
              } else {
                setDirectionCheck({
                  sortClassName: "sort-hidden",
                  directValue: "asc",
                });
                sortAllRecords(event.target.value, directValue);
                setFilter([]);
              }
            }}
          >
            {headerNames.map((item, index) => {
              return (
                <MenuItem
                  className="input-sort input-sort-height"
                  key={index}
                  value={item.key}
                >
                  {item.text}
                </MenuItem>
              );
            })}
          </Select>
        </div>
        <div className={sortClassName}>
          <p>Направление:</p>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            className="input-sort"
            value={directValue}
            onChange={(event) => {
              setDirectionCheck({
                sortClassName,
                directValue: event.target.value,
              });
              sortAllRecords(sortValue, event.target.value);
            }}
          >
            {direction.map((item, index) => {
              return (
                <MenuItem
                  className="input-sort input-sort-height"
                  key={index}
                  value={item.direction}
                >
                  {item.text}
                </MenuItem>
              );
            })}
          </Select>
        </div>
        <FilterComponent allRecords={allRecords} setFilter={setFilter} />
      </div>
      {allRecords.length ? (
        <TableRecords
          allRecords={filterRecords.length ? filterRecords : allRecords}
          setAllRecords={setAllRecords}
          snackbarParams={snackbarParams}
          doctors={doctors}
        />
      ) : (
        <></>
      )}
      {errorToken ? (
        <SnackbarComponent
          open={open}
          status={status}
          message={message}
          funClose={exitPage}
        />
      ) : (
        <SnackbarComponent
          open={open}
          status={status}
          message={message}
          funClose={handleClose}
        />
      )}
    </div>
  );
};

export default Main;
