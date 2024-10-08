import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PetsIcon from "@mui/icons-material/Pets";
import { AppBar, Box, Button, Container, createTheme, CssBaseline, Link, ThemeProvider, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import { ReportCondtion } from "./common/CommonType";
import { convertSimpleCondition, convertSimpleConditionToReportCondition as convertToReportCondition } from "./common/CommonUtil";
import ConditionForm, { ConditionFormHandle, SimpleCondtion } from "./components/ConditionForm";
import HowToUseModal from "./components/HowToUseModal";
import MultiConditionModal from "./components/MultiConditionModal";
import ReportTabPanel, { ReportTabHandle } from "./components/ReportTabPanel";
import { useAppContext } from "./context/AppContext";

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
  const { state } = useAppContext();

  const conditionSubmit = useCallback((reportCondition: ReportCondtion) => {
    const queryString = conditionToQueryString(reportCondition);
    window.history.replaceState(null, "", `?${queryString}`);
    reportTabRef.current?.addCondtion(reportCondition);
  }, []);

  useEffect(() => {
    if (state.multiCondition) {
      conditionSubmit(state.multiCondition);
    }
  }, [state.multiCondition, conditionSubmit]);

  const [openHowToUse, setOpenHowToUse] = useState(false);
  const [openMultiCondition, setOpenMultiCondition] = useState(false);

  const handleOpenHowToUse = () => setOpenHowToUse(true);
  const handleCloseHowToUse = () => setOpenHowToUse(false);
  const handleOpenMultiCondition = () => setOpenMultiCondition(true);
  const handleCloseMultiCondition = () => setOpenMultiCondition(false);

  const conditionFormRef = useRef<ConditionFormHandle>(null);
  const reportTabRef = useRef<ReportTabHandle>(null);

  const applyCondition = (simpleCondition: SimpleCondtion) => {
    conditionFormRef.current?.initFomrmValue(simpleCondition);
    const reportCondition: ReportCondtion = convertToReportCondition(simpleCondition);
    conditionSubmit(reportCondition);
  };

  const applyMultiCondition = (multiCondition: ReportCondtion) => {
    conditionSubmit(multiCondition);
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
      if (!parsedCondition) {
        return;
      }
      if (parsedCondition.type === "single") {
        const simpleCondition = convertSimpleCondition(parsedCondition);
        conditionFormRef.current?.initFomrmValue(simpleCondition);
      }
      conditionSubmit(parsedCondition);
    }
  }, [conditionSubmit]);

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
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenMultiCondition}
            sx={{ marginLeft: "auto", padding: "4px 8px", fontSize: "0.8rem" }}
          >
            다중 조건
          </Button>
          <HowToUseModal open={openHowToUse} onClose={handleCloseHowToUse} onApplyCondition={applyCondition} />
          <MultiConditionModal
            open={openMultiCondition}
            onClose={handleCloseMultiCondition}
            onSubmit={applyMultiCondition}
            initialCondition={null}
          />
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: "55px", mb: "25px", display: "flex", flexDirection: "column" }}>
        <Container maxWidth={false} sx={{ flex: "0 0 auto" }}>
          <ConditionForm ref={conditionFormRef} onSubmit={conditionSubmit} />
        </Container>
        <ReportTabPanel ref={reportTabRef} onApplyCondition={applyCondition} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
