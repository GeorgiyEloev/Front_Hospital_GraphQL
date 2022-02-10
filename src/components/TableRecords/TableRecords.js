import React, { useState } from "react";
import { format, fromUnixTime } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { DeleteOutlined, Edit } from "@mui/icons-material";
import ModalEdit from "../ModalForm/ModalEdit";
import ModalDelet from "../ModalForm/ModalDelet";
import "./TableRecords.scss";

const TableRecords = ({
  allRecords,
  setAllRecords,
  snackbarParams,
  doctors,
}) => {
  const [open, setOpen] = useState(false);

  const [idDelete, setIdDelete] = useState("");
  const [recordEdit, setRecordEdit] = useState({
    _id: "",
    patient: "",
    doctor: "",
    date: new Date(),
    symptoms: "",
  });
  const [whoOpen, setWhoOpen] = useState();

  const openModal = (who) => {
    setOpen(!open);
    setWhoOpen(who);
  };

  const headerNames = ["Имя", "Врач", "Дата", "Жалобы", ""];

  allRecords.map((row) => {
    console.log(fromUnixTime(row.date / 1000));
    console.log(format(fromUnixTime(row.date / 1000), "MM"));
  });

  return (
    <>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow className="table-row">
              {headerNames.map((headerName, index) => (
                <TableCell key={index} align="center">
                  {headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {allRecords.map((row) => (
              <TableRow className="row" key={row._id}>
                <TableCell className="cell-patient" align="center">
                  {row.patient}
                </TableCell>
                <TableCell className="cell-doctor" align="center">
                  {row.doctor}
                </TableCell>
                <TableCell className="cell-date" align="center">
                  {fromUnixTime(row.date / 1000)}
                </TableCell>
                <TableCell className="cell-symptoms" align="justify">
                  {row.symptoms}
                </TableCell>
                <TableCell className="cell-img" align="center">
                  <DeleteOutlined
                    onClick={() => {
                      setIdDelete(row._id);
                      openModal(true);
                    }}
                  />
                  <Edit
                    onClick={() => {
                      setRecordEdit({ ...row });
                      setIdDelete(row._id);
                      openModal(false);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {whoOpen ? (
        <ModalDelet
          open={open}
          openModal={openModal}
          idDelete={idDelete}
          setAllRecords={setAllRecords}
          snackbarParams={snackbarParams}
        />
      ) : (
        <ModalEdit
          open={open}
          openModal={openModal}
          idEdit={idDelete}
          recordEdit={recordEdit}
          setAllRecords={setAllRecords}
          snackbarParams={snackbarParams}
          doctors={doctors}
          setRecordEdit={setRecordEdit}
        />
      )}
    </>
  );
};

export default TableRecords;
