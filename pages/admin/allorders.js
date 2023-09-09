import React from 'react'
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../src/theme/theme";
import FullLayout from "../../src/layouts/FullLayout";


const Allorders = () => {
  return (
    <ThemeProvider theme={theme}>
            <style jsx global>{`
        footer {
          display: none;
        }
      `}</style>
            <FullLayout>

                All Orders

            </FullLayout>
        </ThemeProvider>
  )
}

export default Allorders