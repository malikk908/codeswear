// import * as React from "react";
// import PropTypes from "prop-types";
// import Head from "next/head";
// import { ThemeProvider } from "@mui/material/styles";
// import theme from "../src/theme/theme";
// import FullLayout from "../src/layouts/FullLayout";
// import "../styles/style.css";
// // Client-side cache, shared for the whole session of the user in the browser.

// export default function MyApp(props) {
//   const { Component, pageProps } = props;

//   return (
//     <>
//       <Head>
//         <title>Flexy NextJs Starter kit page</title>
//         <meta name="viewport" content="initial-scale=1, width=device-width" />
//       </Head>
//       <ThemeProvider theme={theme}>
//       <style jsx global>{`
//         footer {
//           display: none;
//         }
//       `}</style>
//         <FullLayout>
//           <Component {...pageProps} />
//         </FullLayout>
//       </ThemeProvider>
//     </>
//   );
// }

// MyApp.propTypes = {
//   Component: PropTypes.elementType.isRequired,
//   emotionCache: PropTypes.object,
//   pageProps: PropTypes.object.isRequired,
// };
