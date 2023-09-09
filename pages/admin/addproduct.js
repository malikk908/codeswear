import React from 'react'
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../src/theme/theme";
import FullLayout from "../../src/layouts/FullLayout";

const Addproduct = () => {
    return (
        <ThemeProvider theme={theme}>
            <style jsx global>{`
        footer {
          display: none;
        }
      `}</style>
            <FullLayout>

                Add product

            </FullLayout>
        </ThemeProvider>
    )
}

export default Addproduct
