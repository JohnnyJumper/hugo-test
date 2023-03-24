import React from "react";
import DateView from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ErrorMessage, Field, FieldProps, FormikProps } from "formik";
import makeStyles from "@mui/styles/makeStyles";
import { Theme } from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  dateView: {
    alignSelf: "center",
    width: "inherit",
  },
}));

// loose definition for ability to pass down props
interface Props {
  label: string;
  name: string;
  value: Date;
  setFieldValue: (name: string, value: Date) => void;
}

const DatePicker: React.FC<Props> = ({ label, name, value, setFieldValue }) => {
  const classes = useStyles();

  return (
    <div className={`${classes.root} form-control`}>
      <label htmlFor={name}>{label}</label>
      <DateView
        className={classes.dateView}
        id={name}
        selected={value}
        onChange={(value) => setFieldValue(name, value ?? new Date())}
      />

      <ErrorMessage name={name} />
    </div>
  );
};

export default DatePicker;
