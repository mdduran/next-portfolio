import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import Content from "../src/components/Content";
import theme from "../src/styles/theme";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Marco Daniel Duran</title>
      </Head>
      <div className="site">
        <ThemeProvider theme={theme}>
          <Header />
          <Content />
          <Footer />
        </ThemeProvider>
      </div>
      <style jsx global>{`
        html {
          height: 100%;
          backgroundcolor: ${theme.palette.primary};
        }
        body {
          padding: 0;
          margin: 0;
        }
        .site {
          display: flex;
          min-height: 100vh;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
}
