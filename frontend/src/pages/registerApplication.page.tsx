import { Button, Theme, Paper, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useFormik, FormikProvider } from "formik";
import React, { useState } from "react";
import * as yup from "yup";
import UserForm, { UserInitialValues } from "../components/userForm";
import { VehicleType } from "../components/vehicleForm";
import VehicleForm from "../components/vehicleForms";
import { isOlderThanSixteen } from "../utils";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    padding: theme.spacing(2),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.primary.light,
    height: "100vh",
  },
  formContainer: {
    backgroundColor: theme.palette.primary.dark,
    padding: theme.spacing(4),
  },
  inputField: {
    marginBottom: theme.spacing(2),
  },
  mainHeader: {
    marginBottom: theme.spacing(2) + " !important",
  },
}));

type Props = {};

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

const RegisterApplicationPage: React.FC<Props> = () => {
  const [step, setStep] = useState<number>(1);
  const [userState, setUserState] = useState({});
  const [vehicles, setVehicles] = useState<VehicleType[]>([]);

  const increaseStep = () => {
    if (step < 1) {
      setStep(step + 1);
    }
  };

  const decreaseStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const onUserData = (values: typeof UserInitialValues) => {
    console.log({ values });
    setUserState(values);
    increaseStep();
  };

  const onVehicleData = (vehicles: VehicleType[]) => {
    console.log({ vehicles });
    setVehicles(vehicles);
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper className={classes.formContainer} elevation={3}>
        {step === 0 && <UserForm onFinish={onUserData} />}
        {step === 1 && <VehicleForm onFinish={onVehicleData} />}
      </Paper>
    </div>
  );
};

export default RegisterApplicationPage;
