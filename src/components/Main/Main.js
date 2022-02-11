import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { AppBar, Button, MenuItem, Select } from "@mui/material";
import AddRecord from "../AddRecord/AddRecord";
import TableRecords from "../TableRecords/TableRecords";
import { GET_ALL_RECORDS } from "../../request/recordRequest";
import { HEADER_NAME, DIRECTION } from "../../constants/constantsInfo";
import FilterComponent from "../FilterComponent/FilterComponent";
import SnackbarComponent from "../SnackbarComponent/SnackbarComponent";
import logo from "../../img/logo.png";
import "./Main.scss";

const Main = () => {
  const { error, data } = useQuery(GET_ALL_RECORDS);

  const [allRecords, setAllRecords] = useState([]);

  const [directionCheck, setDirectionCheck] = useState({
    sortClassName: "sort-hidden",
    directValue: "asc",
  });

  const [sortValue, setValue] = useState("_id");

  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    status: "",
    errorToken: false,
  });

  const navigation = useNavigate();

  useEffect(() => {
    if (!error && data) {
      setAllRecords([...data.getAllRecords]);
    } else if (error) {
      if (error.message === "Неправильный/Устаревший токен") {
        snackbarParams(error.message, "error", true);
      } else {
        snackbarParams(error.message, "warning", false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error]);

  const snackbarParams = (message, status, errorToken) => {
    setSnackbar({
      message,
      status,
      errorToken,
    });
    handleClick();
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

  const { message, status, errorToken } = snackbar;
  const { sortClassName, directValue } = directionCheck;

  const sortAllRecords = (key, sortDirect) => {
    setAllRecords(
      allRecords.sort((record1, record2) =>
        record1[key] > record2[key] ? 1 : record1[key] < record2[key] ? -1 : 0
      )
    );
    if (sortDirect === "desc" && sortClassName !== "sort-hidden") {
      setAllRecords(allRecords.reverse());
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
      <AddRecord
        setAllRecords={setAllRecords}
        snackbarParams={snackbarParams}
        setValue={setValue}
        setDirectionCheck={setDirectionCheck}
      />
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
                setAllRecords(data ? [...data.getAllRecords] : []);
              }
            }}
          >
            {HEADER_NAME.map((item, index) => {
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
            {DIRECTION.map((item, index) => {
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
        <FilterComponent
          allRecords={data ? [...data.getAllRecords] : []}
          setFilter={setAllRecords}
        />
      </div>
      {allRecords.length ? (
        <TableRecords
          allRecords={allRecords}
          setAllRecords={setAllRecords}
          snackbarParams={snackbarParams}
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
