import React, { useState, useEffect } from "react";
import { fromUnixTime } from "date-fns";
import moment from "moment";
import {
  Box,
  AppBar,
  TextField,
  Button,
  MenuItem,
  Select,
  Modal,
} from "@mui/material";
import { DOCTORS } from "../../constants/constantsInfo";
import { useMutation } from "@apollo/client";
import DateInput from "../Main/DateInput";
import { CHANGE_RECORD } from "../../request/recordRequest";
import "./ModalForm.scss";

const ModalEdit = ({
  open,
  openModal,
  recordEdit,
  setAllRecords,
  snackbarParams,
  setRecordEdit,
}) => {
  const [changeRecord, { data }] = useMutation(CHANGE_RECORD);

  const [checkDate, setCheckDate] = useState(false);

  const handleChange = (nameKey, event) => {
    setCheckDate(false);
    setRecordEdit({
      ...recordEdit,
      [nameKey]: event,
    });
  };

  delete recordEdit.__typename;

  useEffect(() => {
    if (data) {
      setAllRecords([...data.changeRecord]);
      if (checkDate) {
        snackbarParams(
          "Запись изменина! Но дата заменена на текущую!",
          "warning",
          false
        );
      } else {
        snackbarParams("УДАЧА! Запись изменина!", "success", false);
      }
      setCheckDate(false);
      openModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (new Date(recordEdit.date).toString() === "Invalid Date") {
    recordEdit.date = new Date(fromUnixTime(recordEdit.date / 1000));
  }

  const { patient, doctor, date, symptoms } = recordEdit;

  const checkNewRecord = () => {
    if (patient === "") {
      throw new Error("Поле имени пацента пустое!");
    }
    if (doctor === "") {
      throw new Error("Не выбран врач!");
    }
    if (symptoms === "") {
      throw new Error("Не указаны жалобы!");
    }
    if (
      !(
        (new Date(date) >= new Date("01-01-2021") &&
          new Date(date) <= new Date("12-31-2022")) ||
        checkDate
      )
    ) {
      setCheckDate(true);
      throw new Error(
        "Не верная дата! Дата должна быть в диапазоне от 01/01/2021 до 31/12/2022"
      );
    }
  };

  const editRecord = async () => {
    try {
      recordEdit.date = moment(date).format("YYYY-MM-DD");
      checkNewRecord();
      if (checkDate) {
        recordEdit.date = moment().format("YYYY-MM-DD");
      }
      await changeRecord({ variables: { input: { ...recordEdit } } });
    } catch (err) {
      if (err.message === "Неправильный/Устаревший токен") {
        snackbarParams(err.message, "error", true);
      } else {
        snackbarParams(err.message, "warning", false);
      }
    }
  };

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="box-style">
          <AppBar className="header-title">
            <h1>Изменить прием</h1>
          </AppBar>
          <Box className="box-small">
            <div className="group-input">
              <p>Имя:</p>
              <TextField
                className="input-mui"
                id="outlined-basic"
                variant="outlined"
                value={patient}
                onChange={(event) =>
                  handleChange("patient", event.target.value)
                }
              />
            </div>
            <div className="group-input">
              <p>Врач:</p>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                className="input-mui"
                value={doctor}
                onChange={(event) => handleChange("doctor", event.target.value)}
              >
                {DOCTORS.map((item, index) => {
                  return (
                    <MenuItem className="input-mui" key={index} value={item}>
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
                handleChange={handleChange}
              />
            </div>
            <div className="group-input">
              <p>Жалобы:</p>
              <TextField
                id="outlined-basic"
                variant="outlined"
                className="input-mui"
                value={symptoms}
                onChange={(event) =>
                  handleChange("symptoms", event.target.value)
                }
              />
            </div>
          </Box>
          <AppBar className="header-end">
            <Button
              variant="outlined"
              onClick={() => {
                setCheckDate(false);
                openModal(false);
              }}
            >
              Cancel
            </Button>
            <Button variant="outlined" onClick={() => editRecord()}>
              Save
            </Button>
          </AppBar>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalEdit;
