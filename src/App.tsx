import PetsIcon from "@mui/icons-material/Pets";
import { AppBar, Box, Button, Container, createTheme, CssBaseline, ThemeProvider, Toolbar, Typography } from "@mui/material";
import { useRef, useState } from "react";
import "./App.css";
import ConditionForm, { ConditionFormHandle, ReportCondtion } from "./components/ConditionForm";
import HowToUseModal from "./components/HowToUseModal";
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
  const [condition, setCondition] = useState<ReportCondtion | null>(null);
  const [openHowToUse, setOpenHowToUse] = useState(false);

  const conditionSubmit = (reportCondition: ReportCondtion) => {
    setCondition(reportCondition);
  };
  const handleOpenHowToUse = () => setOpenHowToUse(true);
  const handleCloseHowToUse = () => setOpenHowToUse(false);

  const conditionFormRef = useRef<ConditionFormHandle>(null);

  const callCustomFunction = () => {
    conditionFormRef.current?.initFomrmValue({
      netWorth: 25000,
      annualSavings: 1500,
      savingsGrowthRate: 7,
      targetReturnRate: 6.5,
      annualInflationRate: 3.1,
      expectedRetirementAge: 15,
      retireSpend: 250,
    });
  };

  const applyCondition = (reportCondition: ReportCondtion) => {
    conditionFormRef.current?.initFomrmValue(reportCondition);
    setCondition(reportCondition);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar sx={{ minHeight: "50px !important", height: "50px" }}>
          <PetsIcon sx={{ color: "#ffee77", marginBottom: "3px", marginRight: "5px" }} />
          <Typography variant="h6">복슬은퇴 계산기</Typography>
          <Button onClick={callCustomFunction}>조건값 초기화</Button>
          <Button onClick={handleOpenHowToUse}>사용법 안내</Button>
          <HowToUseModal open={openHowToUse} onClose={handleCloseHowToUse} onApplyCondition={applyCondition} />
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: "55px" }}>
        <Container maxWidth={false}>
          <ConditionForm ref={conditionFormRef} onSubmit={conditionSubmit} />
          <Report condition={condition} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
