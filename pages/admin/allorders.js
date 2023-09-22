import React from 'react'
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../src/theme/theme";
import FullLayout from "../../src/layouts/FullLayout";
import { Grid } from "@mui/material";
import Orders from './components/dashboard/Orders';


const Allorders = () => {
  return (
    <ThemeProvider theme={theme}>
      <style jsx global>{`
        footer {
          display: none;
        }
      `}</style>
      <FullLayout>

        <Grid container spacing={0}>
          <Grid item xs={12} lg={12}>
            <Orders />
          </Grid>
        </Grid>

      </FullLayout>
    </ThemeProvider>
  )
}

export default Allorders