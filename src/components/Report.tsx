import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import _ from "lodash";

type RetirementCalculatorYear = {
  year: number;
  startAmount: number;
  savingsAmount: number;
  cumulativeInflationRate: number;
  investmentIncome: number;
  totalAssets: number;
  livingExpenses: number;
  remainingAssets: number;
  remainingAssetsPresentValue: number;
};

function Report() {
  const rows: RetirementCalculatorYear[] = _.range(1, 101).map((idx) => ({
    year: 2023 + idx,
    startAmount: 9,
    savingsAmount: 10,
    cumulativeInflationRate: 11,
    investmentIncome: 12,
    totalAssets: 13,
    livingExpenses: 14,
    remainingAssets: 15,
    remainingAssetsPresentValue: 16,
  }));

  const getBackgroundColor = (index: number) => {
    const group = Math.floor((index - 1) / 5);
    switch (group % 2) {
      case 0:
        return "#333";
      case 1:
        return "inherit";
    }
  };

  return (
    <div>
      <Typography variant="h6" component="h2">
        결과
      </Typography>
      <TableContainer component={Paper} sx={{ maxHeight: "calc(100vh - 180px)" }} className="custom-scrollbar">
        <Table
          stickyHeader
          sx={{
            tableLayout: "fixed",
            "& .MuiTableCell-root": {
              border: "1px solid #555",
            },
            "& .MuiTableHead-root .MuiTableCell-root": {
              fontWeight: "bold",
              backgroundColor: "background.paper",
              zIndex: 1,
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">년도</TableCell>
              <TableCell align="center">시작금액</TableCell>
              <TableCell align="center">저축금액</TableCell>
              <TableCell align="center">투자소득</TableCell>
              <TableCell align="center">누적 자산</TableCell>
              <TableCell align="center">누적 물가 상승률</TableCell>
              <TableCell align="center">생활비</TableCell>
              <TableCell align="center">남은 자산</TableCell>
              <TableCell align="center">현재가치 환산</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index} sx={{ backgroundColor: getBackgroundColor(index) }}>
                <TableCell component="th" scope="row">
                  {row.year}년 (올해)
                </TableCell>
                <TableCell align="right">{row.startAmount}만원</TableCell>
                <TableCell align="right">{row.savingsAmount}만원</TableCell>
                <TableCell align="right">{row.investmentIncome}만원</TableCell>
                <TableCell align="right">{row.totalAssets}만원</TableCell>
                <TableCell align="right">{row.cumulativeInflationRate}%</TableCell>
                <TableCell align="right">{row.livingExpenses}만원</TableCell>
                <TableCell align="right">{row.remainingAssets}만원</TableCell>
                <TableCell align="right">{row.remainingAssetsPresentValue}만원</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Report;
