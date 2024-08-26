import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import _ from "lodash";
import { ReportCondtion } from "./ConditionForm";
import { useEffect, useState } from "react";
import { formatNumber } from "../util/Util";

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

interface ReportProps {
  condition: ReportCondtion | null;
}

function Report({ condition }: ReportProps) {
  const [retirementCalculatorYearList, setRetirementCalculatorYearList] = useState<RetirementCalculatorYear[]>([]);

  const getBackgroundColor = (index: number) => {
    const group = Math.floor((index - 1) / 5);
    switch (group % 2) {
      case 0:
        return "#333";
      case 1:
        return "inherit";
    }
  };

  useEffect(() => {
    if (!condition) {
      return;
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const rows: RetirementCalculatorYear[] = _.range(0, 101).map((idx) => ({
      year: currentYear + idx,
      startAmount: condition.netWorth,
      savingsAmount: 10,
      cumulativeInflationRate: 3.5576,
      investmentIncome: 12,
      totalAssets: 13,
      livingExpenses: 14,
      remainingAssets: 15,
      remainingAssetsPresentValue: 16,
    }));

    setRetirementCalculatorYearList(rows);
  }, [condition]);

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
            {retirementCalculatorYearList.map((row, index) => (
              <TableRow key={index} sx={{ backgroundColor: getBackgroundColor(index) }}>
                <TableCell component="th" scope="row">
                  {row.year}년 ({index === 0 ? "올해" : `+${index}년`})
                </TableCell>
                <TableCell align="right">{formatNumber(row.startAmount, "0,0")}만원</TableCell>
                <TableCell align="right">{formatNumber(row.savingsAmount, "0,0")}만원</TableCell>
                <TableCell align="right">{formatNumber(row.investmentIncome, "0,0")}만원</TableCell>
                <TableCell align="right">{formatNumber(row.totalAssets, "0,0")}만원</TableCell>
                <TableCell align="right">{formatNumber(row.cumulativeInflationRate, "0.00")}%</TableCell>
                <TableCell align="right">{formatNumber(row.livingExpenses, "0,0")}만원</TableCell>
                <TableCell align="right">{formatNumber(row.remainingAssets, "0,0")}만원</TableCell>
                <TableCell align="right">{formatNumber(row.remainingAssetsPresentValue, "0,0")}만원</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Report;
