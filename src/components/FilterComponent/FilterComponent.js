import React, { useState } from "react";
import moment from "moment";
import { fromUnixTime } from "date-fns";
import { Button } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DateInput from "../Main/DateInput";
import "./FilterComponent.scss";

const FilterComponent = ({ allRecords, setFilter }) => {
  const [hiddenFilter, setHidden] = useState({
    closeFilter: "filter",
    openFilter: "filter-hidden",
  });

  const [dateFilter, setDateFilter] = useState({
    minDate: "",
    maxDate: "",
  });

  const [open, setOpen] = useState(false);

  const checkDate = (date) => {
    return (
      moment(date).isValid() &&
      moment(date).format("YYYY-MM-DD") >=
        moment("01-01-2021").format("YYYY-MM-DD") &&
      moment(date).format("YYYY-MM-DD") <=
        moment("12-31-2022").format("YYYY-MM-DD")
    );
  };

  const filterDate = () => {
    const dateFirst = checkDate(minDate)
      ? moment(minDate).format("YYYY-MM-DD")
      : moment("01-01-2021").format("YYYY-MM-DD");
    const dateLast = checkDate(maxDate)
      ? moment(maxDate).format("YYYY-MM-DD")
      : moment("12-31-2022").format("YYYY-MM-DD");
    console.log(allRecords);
    console.log("-------------------------------");
    console.log(
      allRecords.filter(
        (record) =>
          moment(fromUnixTime(record.date / 1000)).format("YYYY-MM-DD") >=
            dateFirst &&
          moment(fromUnixTime(record.date / 1000)).format("YYYY-MM-DD") <=
            dateLast
      )
    );
    console.log(
      moment(fromUnixTime(allRecords[0].date / 1000)).format("YYYY-MM-DD")
    );
    setFilter(
      allRecords.filter(
        (record) =>
          moment(fromUnixTime(record.date / 1000)).format("YYYY-MM-DD") >=
            dateFirst &&
          moment(fromUnixTime(record.date / 1000)).format("YYYY-MM-DD") <=
            dateLast
      )
    );
  };

  const removeFilter = () => {
    setDateFilter({
      minDate: "",
      maxDate: "",
    });
    setFilter(allRecords);
    setHidden({
      closeFilter: "filter",
      openFilter: "filter-hidden",
    });
    setOpen(false);
  };

  const handleChange = (nameKey, event) => {
    setDateFilter({
      ...dateFilter,
      [nameKey]: event,
    });
  };

  const { closeFilter, openFilter } = hiddenFilter;
  const { minDate, maxDate } = dateFilter;

  return (
    <>
      <div className={closeFilter}>
        <p>Добавить фильтр по дате:</p>
        <AddBoxIcon
          onClick={() => {
            setOpen(true);
            setDateFilter({
              minDate: "",
              maxDate: "",
            });
            setHidden({
              closeFilter: "filter-hidden",
              openFilter: "filter-open",
            });
          }}
        />
      </div>
      {open && (
        <div className={openFilter}>
          <div className="filter">
            <p>С:</p>
            <DateInput
              addClass="filter-date"
              defValue={minDate}
              nameKey="minDate"
              handleChange={handleChange}
            />
          </div>
          <div className="filter">
            <p>По:</p>
            <DateInput
              addClass="filter-date"
              defValue={maxDate}
              nameKey="maxDate"
              handleChange={handleChange}
            />
          </div>
          <div className="filter">
            <Button
              variant="outlined"
              className="button-filter"
              onClick={() => filterDate()}
            >
              Фильтровать
            </Button>
          </div>
          <DeleteOutlineIcon
            className="icon-delete-filter"
            onClick={() => removeFilter()}
          />
        </div>
      )}
    </>
  );
};

export default FilterComponent;
