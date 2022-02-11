import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useMutation } from "@apollo/client";
import { AppBar, TextField, Button, MenuItem, Select } from "@mui/material";
import DateInput from "./DateInput";
import { ADD_NEW_RECORD } from "../../request/recordRequest";

const AddRecord = ({
  setAllRecords,
  snackbarParams,
  setValue,
  setDirectionCheck,
}) => {
  const [addRecord, { data }] = useMutation(ADD_NEW_RECORD);

  const [checkDate, setCheckDate] = useState(false);
  const [newRecord, setNewRecord] = useState({
    patient: "",
    doctor: "",
    date: new Date(),
    symptoms: "",
  });

  const doctors = [
    "Кириллов Алан Валерьевич",
    "Комиссаров Гаянэ Валерьянович",
    "Крылов Родион Оскарович",
    "Волкова Нина Аристарховна",
    "Громова Августа Семеновна",
    "Ковалёв Лукьян Аристархович",
    "Волкова Алина Аристарховна",
  ];

  const { patient, doctor, date, symptoms } = newRecord;

  const checkNewRecord = () => {
    if (patient === "") {
      throw new Error("Поле имени пацента пустое!");
    }
    if (doctor !== "") {
      throw new Error("Не выбран врач!");
    }
    if (symptoms !== "") {
      throw new Error("Не указаны жалобы!");
    }
    if (
      (new Date(date) <= new Date("01-01-2021") &&
        new Date(date) >= new Date("12-31-2022")) ||
      !checkDate
    ) {
      setCheckDate(true);
      throw new Error("Не указаны жалобы!");
    }
  };

  const addNewRecord = async () => {
    const errorStatus = {
      status: "warning",
      token: false,
    };
    try {
      checkNewRecord();
      newRecord.date = moment(date).format("YYYY-MM-DD");
    } catch (err) {}

    //       if (
    //         (new Date(date) >= new Date("01-01-2021") &&
    //           new Date(date) <= new Date("12-31-2022")) ||
    //         checkDate
    //       ) {
    //         if (checkDate) {
    //           newRecord.date = moment().format("YYYY-MM-DD");
    //         }
    //         await axios
    //           .post("http://localhost:8000/record/addNewRecord", newRecord, {})
    //           .then((res) => {
    //             setAllRecords(res.data.data);
    //             if (checkDate) {
    //               snackbarParams(
    //                 "Запись сохранена! Но дата заменена на текущую!",
    //                 "warning",
    //                 false
    //               );
    //             } else {
    //               snackbarParams("УДАЧА! Запись сохранена!", "success", false);
    //             }
    //             setNewRecord({
    //               patient: "",
    //               doctor: "",
    //               date: new Date(),
    //               symptoms: "",
    //             });
    //             setValue("_id");
    //             setDirectionCheck({
    //               sortClassName: "sort-hidden",
    //               directValue: "asc",
    //             });
    //             setCheckDate(false);
    //           })
    //           .catch((err) => {
    //             if (err.response.status === 401) {
    //               snackbarParams("Ошибка авторизации!!!", "error", true);
    //             } else {
    //               snackbarParams(
    //                 "Ошибка новой записи! Запись не сохранена!",
    //                 "warning",
    //                 false
    //               );
    //             }
    //           });
    //       } else {
    //         setCheckDate(true);
    //         snackbarParams(
    //           "Не верная дата! Дата должна быть в диапазоне от 01/01/2021 до 31/12/2022",
    //           "warning",
    //           false
    //         );
    //       }
    //     } else {
    //     }
    //   } else {
    //   }
    // } else {
    // }
  };

  const handleChange = (nameKey, event) => {
    setCheckDate(false);
    setNewRecord({
      ...newRecord,
      [nameKey]: event,
    });
  };
  return (
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
  );
};

export default AddRecord;
