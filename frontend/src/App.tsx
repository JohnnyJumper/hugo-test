import React from "react";
import {
  Box,
  CssBaseline,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import theme from "./theme";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { routes } from "./routes";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box height="100vh" display="flex" flexDirection="column">
        <BrowserRouter>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.key}
                path={route.path}
                element={<route.component />}
              />
            ))}
          </Routes>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
}

export default App;
