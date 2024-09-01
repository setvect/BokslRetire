import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PetsIcon from "@mui/icons-material/Pets";
import { AppBar, Box, Button, Container, createTheme, CssBaseline, Link, ThemeProvider, Toolbar, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import ConditionForm, { ConditionFormHandle, ReportCondtion } from "./components/ConditionForm";
import HowToUseModal from "./components/HowToUseModal";
import ReportTabPanel, { ReportTabHandle } from "./components/ReportTabPanel";

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

  const handleOpenHowToUse = () => setOpenHowToUse(true);
  const handleCloseHowToUse = () => setOpenHowToUse(false);

  const conditionFormRef = useRef<ConditionFormHandle>(null);
  const reportTabRef = useRef<ReportTabHandle>(null);

  const conditionSubmit = (reportCondition: ReportCondtion) => {
    setCondition(reportCondition);
    const queryString = conditionToQueryString(reportCondition);
    window.history.replaceState(null, "", `?${queryString}`);
    reportTabRef.current?.addCondtion(reportCondition);
  };

  const applyCondition = (reportCondition: ReportCondtion) => {
    conditionFormRef.current?.initFomrmValue(reportCondition);
    conditionSubmit(reportCondition);
  };

  const conditionToQueryString = (condition: ReportCondtion) => {
    const encodedCondition = encodeURIComponent(JSON.stringify(condition));
    return `q=${encodedCondition}`;
  };

  const queryStringToCondition = (queryString: string): ReportCondtion | null => {
    const params = new URLSearchParams(queryString);
    const encodedCondition = params.get("q");
    if (encodedCondition) {
      try {
        return JSON.parse(decodeURIComponent(encodedCondition)) as ReportCondtion;
      } catch (error) {
        console.error("Failed to parse condition from query string:", error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const queryString = window.location.search;
    if (queryString) {
      const parsedCondition = queryStringToCondition(queryString.substring(1));
      if (parsedCondition) {
        setCondition(parsedCondition);
        conditionFormRef.current?.initFomrmValue(parsedCondition);
      }
    }
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar sx={{ minHeight: "50px !important", height: "50px" }}>
          <PetsIcon sx={{ color: "#ffee77", marginBottom: "3px", marginRight: "5px" }} />
          <Typography variant="h6">
            <Link underline="none" href="/" sx={{ color: "inherit" }}>
              복슬은퇴 계산기
            </Link>
          </Typography>
          <Button onClick={handleOpenHowToUse} startIcon={<HelpOutlineIcon sx={{ margin: "-2px -2px 0 0" }} />} sx={{ marginLeft: "10px" }}>
            사용법 안내
          </Button>
          <HowToUseModal open={openHowToUse} onClose={handleCloseHowToUse} onApplyCondition={applyCondition} />
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: "55px", display: "flex", flexDirection: "column", height: "calc(100vh - 55px)" }}>
        <Container maxWidth={false} sx={{ flex: "0 0 auto" }}>
          <ConditionForm ref={conditionFormRef} onSubmit={conditionSubmit} />
        </Container>
        <ReportTabPanel ref={reportTabRef} onApplyCondition={applyCondition} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
