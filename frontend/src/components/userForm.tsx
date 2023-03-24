import { Typography, Button, Theme } from "@mui/material";
import { FormikProps, FormikProvider, useFormik } from "formik";
import React from "react";
import { isOlderThanSixteen } from "../utils";
import DatePicker from "../utils/DatePicker";
import FormField from "../utils/FormField";
import * as yup from "yup";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme: Theme) => ({
  mainHeader: {
    marginBottom: theme.spacing(2) + " !important",
  },
}));

const validationSchema = yup.object({
  first_name: yup
    .string()
    .label("Enter your first name")
    .min(2)
    .required("First name is required"),
  last_name: yup
    .string()
    .label("Enter your last name")
    .required("Last name is required"),
  dob: yup
    .date()
    .test("dob", "Should be greater than 16", (value, ctx) => {
      if (!value || !isOlderThanSixteen(value)) {
        ctx.createError();
        return false;
      }
      return true;
    })
    .label("Enter your date of birth")
    .required("Date of birth is required"),
  address_street: yup
    .string()
    .label("Enter your street name")
    .required("Street is required"),
  address_city: yup
    .string()
    .label("Enter your city name")
    .required("city name is required"),
  address_state: yup
    .string()
    .min(2)
    .max(2)
    .label("Enter your state")
    .required("State is required"),
  address_zipcode: yup
    .number()
    .label("Enter your zipcode")
    .required("Zip code is required"),
});

export const UserInitialValues = {
  first_name: "John",
  last_name: "Wick",
  dob: new Date("04/23/1990"),
  address_street: "",
  address_city: "",
  address_state: "",
  address_zipcode: 99997,
};

type Props = {
  onFinish: (values: typeof UserInitialValues) => void;
};

const UserForm: React.FC<Props> = ({ onFinish }) => {
  const classes = useStyles();

  const formik = useFormik({
    initialValues: UserInitialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onFinish(values);
    },
  });

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <Typography variant="h4" className={classes.mainHeader}>
          Tell us about yourself
        </Typography>
        <FormField<typeof formik>
          name="first_name"
          label="Enter your first name"
          formik={formik}
        />
        <FormField<typeof formik>
          name="last_name"
          label="Enter your last name"
          formik={formik}
        />

        <DatePicker
          label="Enter your date of birth"
          name="dob"
          setFieldValue={formik.setFieldValue}
          value={formik.values.dob}
        />
        <FormField<typeof formik>
          name="address_street"
          label="Enter your street name"
          formik={formik}
        />
        <FormField<typeof formik>
          name="address_city"
          label="Enter your city name"
          formik={formik}
        />
        <FormField<typeof formik>
          name="address_state"
          label="Enter your state"
          formik={formik}
        />
        <FormField<typeof formik>
          name="address_zipcode"
          label="Enter your zip code"
          type="number"
          formik={formik}
        />
        <Button color="primary" variant="contained" fullWidth type="submit">
          Submit
        </Button>
      </form>
    </FormikProvider>
  );
};

export default UserForm;
