import React from "react";
import axios from "axios";
import { Box, AppBar } from "@mui/material";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import "./ModalForm.scss";

const ModalDelet = ({
  open,
  openModal,
  idDelete,
  setAllRecords,
  snackbarParams,
}) => {
  const token = localStorage.getItem("token");

  const deleteRecord = async () => {
    await axios
      .delete("http://localhost:8000/record/removeRecord", {
        data: {
          _id: idDelete,
        },
        headers: {
          authorization: token,
        },
      })
      .then((res) => {
        snackbarParams("УДАЧА! Запись удалена!", "success", false);
        openModal(true);
        setAllRecords(res.data.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          snackbarParams("Ошибка авторизации!!!", "error", true);
          openModal(true);
        } else {
          snackbarParams(
            "Ошибка удаления записи! Запись не найдена!",
            "warning",
            false
          );
          openModal(true);
        }
      });
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
            <h1>Удалить прием</h1>
          </AppBar>
          <Box className="box-small">
            <p>Вы действительно хотите удалить прием?</p>
          </Box>
          <AppBar className="header-end">
            <Button variant="outlined" onClick={() => openModal(true)}>
              Cancel
            </Button>
            <Button variant="outlined" onClick={() => deleteRecord()}>
              Delete
            </Button>
          </AppBar>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalDelet;
