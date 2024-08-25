import PetsIcon from "@mui/icons-material/Pets";
import { AppBar, Box, Container, createTheme, CssBaseline, ThemeProvider, Toolbar, Typography } from "@mui/material";
import React from "react";
import "./App.css";
import ConditionForm, { ReportCondition } from "./components/ConditionForm";
import Report from "./components/Report";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"Pretendard Variable", "Pretendard", "NanumGothic", "nanum-square-round-otf", serif',
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
      },
    },
  },
});

function App() {
  const [condition, setCondition] = React.useState<ReportCondition>({
    netWorth: "",
    annualSavings: "",
    savingsGrowthRate: "",
    targetReturnRate: "",
    annualInflationRate: "",
    expectedRetirementAge: "",
    retireSpend: "",
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar sx={{ minHeight: "50px !important", height: "50px" }}>
          <PetsIcon sx={{ color: "#ffee77", marginBottom: "3px", marginRight: "5px" }} />
          <Typography variant="h6">복슬은퇴 계산기</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: "55px" }}>
        <Container maxWidth={false}>
          <ConditionForm condition={condition} setCondition={setCondition} />
          <Report />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
