import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { formatNumber } from "../util/Util";
import AssetChart from "./AssetChart";
import { ReportCondtion } from "./ConditionForm";
import InsertChartIcon from "@mui/icons-material/InsertChart";

type RetirementCalculatorYear = {
  year: number; // 해당 연도
  startAmount: number; // 시작금액
  investmentIncome: number; // 투자소득
  savingsAmount: number; // 저축금액
  totalAssets: number; // 누적 자산
  cumulativeInflationRate: number; // 누적 물가상승률
  livingExpenses: number; // 은퇴후 생활비
  remainingAssets: number; // 남은자산
  remainingAssetsPresentValue: number; // 현재가치로 평가한 남은자산
};

interface ReportProps {
  condition: ReportCondtion | null;
}

function Report({ condition }: ReportProps) {
  const [retirementCalculatorYearList, setRetirementCalculatorYearList] = useState<RetirementCalculatorYear[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const getBackgroundColor = (index: number) => {
    const group = Math.floor((index - 1) / 5);
    switch (group % 2) {
      case 0:
        return "#333";
      case 1:
        return "inherit";
    }
  };

  const togglePopup = () => {
    setIsVisible(!isVisible);
  };

  // 통계 리포트
  function calcReport(condition: ReportCondtion) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const yearData: RetirementCalculatorYear[] = [];

    const startAmount = condition.netWorth;
    const investmentIncome = startAmount > 0 ? (startAmount * condition.targetReturnRate) / 100 : 0;
    const savingsAmount = condition.expectedRetirementAge === 0 ? 0 : condition.annualSavings;
    const totalAssets = condition.netWorth + investmentIncome + condition.annualSavings;
    const cumulativeInflationRate = 0;
    const livingExpenses = condition.expectedRetirementAge === 0 ? condition.retireSpend * 12 : 0;
    const remainingAssets = totalAssets - livingExpenses;
    const remainingAssetsPresentValue = remainingAssets / Math.pow(1 + cumulativeInflationRate / 100, 100);

    yearData.push({
      year: currentYear,
      startAmount,
      investmentIncome,
      savingsAmount,
      totalAssets,
      cumulativeInflationRate,
      livingExpenses,
      remainingAssets,
      remainingAssetsPresentValue,
    });

    const maxYearCount = Math.min(condition.expectedRetirementAge + 50, 70);

    for (let yearIdx = 1; yearIdx <= maxYearCount; yearIdx++) {
      const beforeValue = yearData[yearIdx - 1];

      const startAmount = beforeValue.remainingAssets;

      let investmentIncome = 0;
      if (startAmount > 0) {
        investmentIncome = (startAmount * condition.targetReturnRate) / 100;
      }

      let savingsAmount = 0;
      if (condition.expectedRetirementAge > yearIdx) {
        savingsAmount = condition.annualSavings * Math.pow(1 + condition.savingsGrowthRate / 100, yearIdx);
      }
      const totalAssets = startAmount + investmentIncome + savingsAmount;
      const cumulativeInflationRate =
        ((1 + beforeValue.cumulativeInflationRate / 100) * (1 + condition.annualInflationRate / 100) - 1) * 100;

      let livingExpenses = 0;
      if (condition.expectedRetirementAge <= yearIdx) {
        livingExpenses = condition.retireSpend * (1 + cumulativeInflationRate / 100) * 12;
      }
      const remainingAssets = totalAssets - livingExpenses;
      const remainingAssetsPresentValue = remainingAssets / (1 + cumulativeInflationRate / 100);

      yearData.push({
        year: currentYear + yearIdx,
        startAmount,
        investmentIncome,
        savingsAmount,
        totalAssets,
        cumulativeInflationRate,
        livingExpenses,
        remainingAssets,
        remainingAssetsPresentValue,
      });
    }
    setRetirementCalculatorYearList(yearData);
  }

  useEffect(() => {
    if (!condition) {
      return;
    }

    calcReport(condition);
  }, [condition]);
  const handleCloseChart = () => {
    setIsVisible(false);
  };

  const formatCondition = (condition: ReportCondtion): string => {
    return `
      <strong>결과</strong> - 
      순자산: <span class="condition-value">${formatNumber(condition.netWorth, "0,0")}만원</span>, 
      저축금액: <span class="condition-value">$${formatNumber(condition.annualSavings, "0,0")}만원</span>, 
      저축 증가율: <span class="condition-value">$${condition.savingsGrowthRate}%</span>, 
      목표 수익률: <span class="condition-value">$${condition.targetReturnRate}%</span>, 
      물가 상승률: <span class="condition-value">$${condition.annualInflationRate}%</span>, 
      은퇴 시기: <span class="condition-value">$${condition.expectedRetirementAge}년후</span>, 
      은퇴후 월 생활비: <span class="condition-value">$${formatNumber(condition.retireSpend, "0,0")}만원</span>
    `;
  };

  // 데이터 준비
  const data = retirementCalculatorYearList.map((row) => ({
    year: row.year,
    remainingAssetsPresentValue: row.remainingAssetsPresentValue,
  }));

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <Typography variant="body1" sx={{ margin: "8px 0" }}>
        {condition && <span dangerouslySetInnerHTML={{ __html: formatCondition(condition) }} />}
        <Button onClick={togglePopup} startIcon={<InsertChartIcon />}>
          차트보기
        </Button>
      </Typography>

      <TableContainer component={Paper} sx={{ maxHeight: "calc(100vh - 200px)" }} className="custom-scrollbar">
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
              <TableCell align="center">투자소득</TableCell>
              <TableCell align="center">저축금액</TableCell>
              <TableCell align="center">누적 자산</TableCell>
              <TableCell align="center">누적 물가 상승률</TableCell>
              <TableCell align="center">한해 순지출</TableCell>
              <TableCell align="center">남은 자산</TableCell>
              <TableCell align="center">남은 자산(현재가치)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {retirementCalculatorYearList.map((row, index) => (
              <TableRow key={index} sx={{ backgroundColor: getBackgroundColor(index) }}>
                <TableCell component="th" scope="row">
                  {row.year}년 ({index === 0 ? "올해" : `+${index}년`})
                </TableCell>
                <TableCell align="right" className={row.startAmount < 0 ? "negative-value" : ""}>
                  {formatNumber(row.startAmount, "0,0")}만원
                </TableCell>
                <TableCell align="right" className={row.investmentIncome < 0 ? "negative-value" : ""}>
                  {formatNumber(row.investmentIncome, "0,0")}만원
                </TableCell>
                <TableCell align="right" className={row.savingsAmount < 0 ? "negative-value" : ""}>
                  {formatNumber(row.savingsAmount, "0,0")}만원
                </TableCell>
                <TableCell align="right" className={row.totalAssets < 0 ? "negative-value" : ""}>
                  {formatNumber(row.totalAssets, "0,0")}만원
                </TableCell>
                <TableCell align="right" className={row.cumulativeInflationRate < 0 ? "negative-value" : ""}>
                  {formatNumber(row.cumulativeInflationRate, "0,0.00")}%
                </TableCell>
                <TableCell align="right" className={row.livingExpenses < 0 ? "negative-value" : ""}>
                  {formatNumber(row.livingExpenses, "0,0")}만원
                </TableCell>
                <TableCell align="right" className={row.remainingAssets < 0 ? "negative-value" : ""}>
                  {formatNumber(row.remainingAssets, "0,0")}만원
                </TableCell>
                <TableCell align="right" className={row.remainingAssetsPresentValue < 0 ? "negative-value" : ""}>
                  {formatNumber(row.remainingAssetsPresentValue, "0,0")}만원
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AssetChart data={retirementCalculatorYearList} open={isVisible} onClose={handleCloseChart} />
    </div>
  );
}

export default Report;
