import { Typography, Button, Theme, Paper, Box } from "@mui/material";
import { FormikProps, FormikProvider, useFormik } from "formik";
import React, { useState } from "react";
import { isOlderThanSixteen } from "../utils";
import DatePicker from "../utils/DatePicker";
import FormField from "../utils/FormField";
import * as yup from "yup";
import makeStyles from "@mui/styles/makeStyles";
import VehicleForm, { VehicleType } from "./vehicleForm";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
  },
  vehicleFormContainer: {
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(4),
  },
  header: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
}));

type Props = {
  onFinish: (values: VehicleType[]) => void;
};

type VehicleNumber = 1 | 2 | 3;

const VehicleForms: React.FC<Props> = ({ onFinish }) => {
  const classes = useStyles();
  const [vehicle1, setVehicle1] = useState<VehicleType>();
  const [vehicle2, setVehicle2] = useState<VehicleType>();
  const [vehicle3, setVehicle3] = useState<VehicleType>();

  const setVehicle = (vehicleNumber: VehicleNumber, values: VehicleType) => {
    switch (vehicleNumber) {
      case 1: {
        setVehicle1(values);
        return;
      }
      case 2: {
        setVehicle2(values);
        return;
      }
      case 3: {
        setVehicle3(values);
        return;
      }
    }
  };

  const removeVehicle = (vehicleNumber: VehicleNumber) => {
    switch (vehicleNumber) {
      case 1: {
        setVehicle1(undefined);
        return;
      }
      case 2: {
        setVehicle2(undefined);
        return;
      }
      case 3: {
        setVehicle3(undefined);
        return;
      }
    }
  };

  const onSubmit = () => {
    const vehicles = [];
    if (vehicle1) {
      vehicles.push(vehicle1);
    }
    if (vehicle2) {
      vehicles.push(vehicle2);
    }
    if (vehicle3) {
      vehicles.push(vehicle3);
    }

    onFinish(vehicles);
  };

  const addedVehicles = (): number => {
    let added = 0;
    if (vehicle1) {
      added += 1;
    }
    if (vehicle2) {
      added += 1;
    }
    if (vehicle3) {
      added += 1;
    }
    return added;
  };

  return (
    <Paper className={classes.root} elevation={0}>
      <Box className={classes.header}>
        <Typography variant="h4">Let's add a vehicles</Typography>
        <Typography variant="overline">( {addedVehicles()} / 3)</Typography>
      </Box>
      <Paper className={classes.vehicleFormContainer} elevation={0}>
        <VehicleForm
          onFinish={(values) => setVehicle(1, values)}
          onRemove={() => removeVehicle(1)}
          withInitialValues
        />
        <VehicleForm
          onFinish={(values) => setVehicle(2, values)}
          onRemove={() => removeVehicle(2)}
        />
        <VehicleForm
          onFinish={(values) => setVehicle(3, values)}
          onRemove={() => removeVehicle(3)}
        />
      </Paper>
      <Button color="primary" variant="contained" fullWidth onClick={onSubmit}>
        Submit
      </Button>
    </Paper>
  );
};

export default VehicleForms;
