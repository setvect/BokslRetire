import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  CssBaseline,
  createTheme,
  ThemeProvider,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";

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

type ReportCalculationParam = {
  netWorth: string;
  annualSavings: string;
  savingsGrowthRate: string;
  targetReturnRate: string;
  annualInflationRate: string;
  expectedRetirementAge: string;
};

function App() {
  const [reportCalculation, setReportCalculation] = React.useState<ReportCalculationParam>({
    netWorth: "",
    annualSavings: "",
    savingsGrowthRate: "",
    targetReturnRate: "",
    annualInflationRate: "",
    expectedRetirementAge: "",
  });

  const handleExpectedRetirementAgeChange = (event: SelectChangeEvent<string>) => {
    setReportCalculation((prevState) => ({
      ...prevState,
      expectedRetirementAge: event.target.value,
    }));
  };

  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleChange =
    (field: keyof ReportCalculationParam, removeDecimal = false) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value.replace(/,/g, "");
      if (removeDecimal) {
        value = value.replace(/\./g, "");
      }
      if (value === "-" || !isNaN(Number(value))) {
        setReportCalculation((prevState) => ({
          ...prevState,
          [field]: formatNumber(value),
        }));
      }
    };

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
          <div style={{ display: "flex", alignItems: "center", width: "100%", gap: "16px" }}>
            <TextField
              label="순자산"
              type="text"
              sx={{ m: 1, flex: 1, width: "25ch", input: { textAlign: "right" } }}
              value={reportCalculation.netWorth}
              onChange={handleChange("netWorth", true)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start" sx={{ marginLeft: "5px" }}>
                    만원
                  </InputAdornment>
                ),
                inputProps: { maxLength: 10 },
                style: { textAlign: "right" },
              }}
              variant="standard"
            />
            <TextField
              label="한해 예상 저축금액"
              type="text"
              sx={{ m: 1, flex: 1, width: "25ch", input: { textAlign: "right" } }}
              value={reportCalculation.annualSavings}
              onChange={handleChange("annualSavings")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start" sx={{ marginLeft: "5px" }}>
                    만원
                  </InputAdornment>
                ),
                inputProps: { maxLength: 10 },
                style: { textAlign: "right" },
              }}
              variant="standard"
            />
            <TextField
              label="저축 증가률"
              type="text"
              sx={{ m: 1, flex: 1, width: "25ch", input: { textAlign: "right" } }}
              value={reportCalculation.savingsGrowthRate}
              onChange={handleChange("savingsGrowthRate")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start" sx={{ marginLeft: "5px" }}>
                    %
                  </InputAdornment>
                ),
                inputProps: { maxLength: 5 },
                style: { textAlign: "right" },
              }}
              variant="standard"
            />
            <TextField
              label="목표 수익률"
              type="text"
              sx={{ m: 1, flex: 1, width: "25ch", input: { textAlign: "right" } }}
              value={reportCalculation.targetReturnRate}
              onChange={handleChange("targetReturnRate")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start" sx={{ marginLeft: "5px" }}>
                    %
                  </InputAdornment>
                ),
                inputProps: { maxLength: 5 },
                style: { textAlign: "right" },
              }}
              variant="standard"
            />
            <TextField
              label="연평균 물가 상승률"
              type="text"
              sx={{ m: 1, flex: 1, width: "25ch", input: { textAlign: "right" } }}
              value={reportCalculation.annualInflationRate}
              onChange={handleChange("annualInflationRate")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start" sx={{ marginLeft: "5px" }}>
                    %
                  </InputAdornment>
                ),
                inputProps: { maxLength: 5 },
                style: { textAlign: "right" },
              }}
              variant="standard"
            />
            <FormControl sx={{ m: 1, flex: 1, minWidth: 250 }}>
              <InputLabel id="demo-simple-select-helper-label">예상(희망) 은퇴 시기</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={reportCalculation.expectedRetirementAge}
                onChange={handleExpectedRetirementAgeChange}
                variant="standard"
              >
                <MenuItem value="">
                  <em>-- 선택해주세요 --</em>
                </MenuItem>
                {[...Array(51)].map((_, index) => (
                  <MenuItem key={index} value={index}>
                    {index === 0 ? "지금당장" : `${index}년후`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="success" sx={{ m: 2, flex: 1 }}>
              결과확인
            </Button>
          </div>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
