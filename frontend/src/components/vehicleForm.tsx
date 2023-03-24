import { Typography, Button, Theme, Paper } from "@mui/material";
import { FormikProps, FormikProvider, useFormik } from "formik";
import React, { useState } from "react";
import { isOlderThanSixteen } from "../utils";
import DatePicker from "../utils/DatePicker";
import FormField from "../utils/FormField";
import * as yup from "yup";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme: Theme) => ({
  mainHeader: {
    marginBottom: theme.spacing(2) + " !important",
  },
  root: {
    width: "300px",
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const validationSchema = yup.object({
  make: yup
    .string()
    .label("Enter your manufacture name")
    .required("Name of manufacture is required"),
  model: yup
    .string()
    .label("Enter your model name")
    .required("Name of model is required"),
  year: yup
    .number()
    .label("Enter your car age")
    .test("year", (value, ctx) => {
      if (
        !value ||
        isNaN(value) ||
        value < 1985 ||
        value > new Date().getFullYear() + 1
      ) {
        ctx.createError();
        return false;
      }
      return true;
    })
    .required("Age of a car is required"),
  vin: yup
    .string()
    .label("Enter your vehical identification number (VIN)")
    .required()
    .test("vin", (value, ctx) => {
      const simpleRegex: RegExp = /^[A-HJ-NP-Z0-9]{11}[0-9]{6}$/;
      if (!simpleRegex.test(value)) {
        ctx.createError();
        return false;
      }
      return true;
    }),
});

export type VehicleType = {
  make: string;
  model: string;
  year: number;
  vin: string;
};

const vehicleInitialValues: VehicleType = {
  make: "Ford",
  model: "Mustang",
  year: 2022,
  vin: "1FA6P8CF9L5103227",
};

type Props = {
  onFinish: (value: VehicleType) => void;
  onRemove: () => void;
  withInitialValues?: boolean;
};

const VehicleForm: React.FC<Props> = ({
  onFinish,
  onRemove,
  withInitialValues = false,
}) => {
  const [added, setAdded] = useState(false);
  const classes = useStyles();
  const formik = useFormik({
    initialValues: withInitialValues
      ? vehicleInitialValues
      : { make: "", model: "", year: 0, vin: "" },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onFinish(values);
      setAdded(true);
    },
    onReset: (values) => {
      onRemove();
      setAdded(false);
    },
  });

  return (
    <FormikProvider value={formik}>
      <form
        onSubmit={formik.handleSubmit}
        onReset={formik.handleReset}
        className={classes.root}
      >
        <FormField<typeof formik>
          fullWidth={false}
          name="make"
          label="Enter your Manufacture name"
          formik={formik}
        />
        <FormField<typeof formik>
          fullWidth={false}
          name="model"
          label="Enter your model name"
          formik={formik}
        />
        <FormField<typeof formik>
          fullWidth={false}
          name="year"
          type="number"
          label="Enter your car's age"
          formik={formik}
        />
        <FormField<typeof formik>
          fullWidth={false}
          name="vin"
          label="Enter your Vehicle Identification Number (VIN)"
          formik={formik}
        />
        {!added && (
          <Button color="secondary" variant="contained" type="submit">
            Add
          </Button>
        )}
        {added && (
          <Button color="secondary" variant="contained" type="reset">
            Remove
          </Button>
        )}
      </form>
    </FormikProvider>
  );
};

export default VehicleForm;
