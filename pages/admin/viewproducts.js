import React from 'react'
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../src/theme/theme";
import FullLayout from "../../src/layouts/FullLayout";


const Viewproducts = () => {
  return (
    <ThemeProvider theme={theme}>
            <style jsx global>{`
        footer {
          display: none;
        }
      `}</style>
            <FullLayout>

                View Products

            </FullLayout>
        </ThemeProvider>
  )
}

export default Viewproducts