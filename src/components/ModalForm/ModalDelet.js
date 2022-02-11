import React, { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { Box, AppBar } from "@mui/material";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { DELETE_RECORD } from "../../request/recordRequest";
import "./ModalForm.scss";

const ModalDelet = ({
  open,
  openModal,
  idDelete,
  setAllRecords,
  snackbarParams,
}) => {
  const [removeRecord, { data }] = useMutation(DELETE_RECORD);

  useEffect(() => {
    if (data) {
      snackbarParams("УДАЧА! Запись удалена!", "success", false);
      openModal(true);
      setAllRecords([...data.removeRecord]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const deleteRecord = async () => {
    try {
      await removeRecord({ variables: { _id: `${idDelete}` } });
    } catch (err) {
      if (err.message === "Неправильный/Устаревший токен") {
        snackbarParams(err.message, "error", true);
      } else {
        snackbarParams(err.message, "warning", false);
      }
    }
    // await axios
    //   .delete("http://localhost:8000/record/removeRecord", {
    //     data: {
    //       _id: idDelete,
    //     },
    //     headers: {
    //       authorization: token,
    //     },
    //   })
    //   .then((res) => {
    //     snackbarParams("УДАЧА! Запись удалена!", "success", false);
    //     openModal(true);
    //     setAllRecords(res.data.data);
    //   })
    //   .catch((err) => {
    //     if (err.response.status === 401) {
    //       snackbarParams("Ошибка авторизации!!!", "error", true);
    //       openModal(true);
    //     } else {
    //       snackbarParams(
    //         "Ошибка удаления записи! Запись не найдена!",
    //         "warning",
    //         false
    //       );
    //       openModal(true);
    //     }
    //   });
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
