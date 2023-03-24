import { TextField, Theme } from "@mui/material";
import React from "react";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme: Theme) => ({
  inputField: {
    marginBottom: theme.spacing(2),
    "&.MuiFormHelperText-root": {
      marginTop: `-${theme.spacing(4)}`,
      marginBottom: theme.spacing(4),
    },
  },
}));

type Props<T> = {
  name: string;
  label: string;
  fullWidth?: boolean;
  type?: React.HTMLInputTypeAttribute | undefined;
  formik: T & { handleChange: (e: React.ChangeEvent<any>) => void };
};

// a little hacky solution to ease readability.
function FormField<T>({
  name,
  label,
  formik,
  type,
  fullWidth = true,
}: Props<T>) {
  const classes = useStyles();
  return (
    <TextField
      InputProps={{ className: classes.inputField }}
      fullWidth={fullWidth}
      id={name}
      name={name}
      type={type}
      label={label}
      // @ts-ignore
      value={formik.values[name]}
      onChange={formik.handleChange}
      // @ts-ignore
      error={formik.touched[name] && Boolean(formik.errors[name])}
      // @ts-ignore
      helperText={formik.touched[name] && formik.errors[name]}
    />
  );
}

export default FormField;
