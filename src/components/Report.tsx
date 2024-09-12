import GetAppIcon from "@mui/icons-material/GetApp";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import {
  Button,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  TooltipProps,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import "../App.css";
import { ReportCondtion } from "../common/CommonType";
import { formatNumber } from "../util/Util";
import AssetChartModal from "./AssetChartModal";
import { convertSimpleCondition } from "../common/CommonUtil";
import MultiConditionModal from "./MultiConditionModal";

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
  onApplyMultiCondition: (condition: ReportCondtion) => void;
}

function Report({ condition, onApplyMultiCondition }: ReportProps) {
  const [retirementCalculatorYearList, setRetirementCalculatorYearList] = useState<RetirementCalculatorYear[]>([]);
  const [isOpenChart, setIsOpenChart] = useState(false);
  const [isOpenMultiConditionModal, setIsOpenMultiConditionModal] = useState(false);
  const tableRef = useRef<HTMLTableElement | null>(null);
  const headerRef = useRef<HTMLTableSectionElement | null>(null);
  const stickyHeaderRef = useRef<HTMLTableSectionElement | null>(null);

  const handleOpenMultiConditionModal = () => {
    setIsOpenMultiConditionModal(true);
  };

  const handleCloseMultiConditionModal = () => {
    setIsOpenMultiConditionModal(false);
  };

  const getBackgroundColor = (index: number) => {
    const group = Math.floor((index - 1) / 5);
    switch (group % 2) {
      case 0:
        return "#333";
      case 1:
        return "inherit";
    }
  };

  const openChartModal = () => {
    setIsOpenChart(!isOpenChart);
  };

  const handleDownload = () => {
    const table = tableRef.current;
    if (!table) {
      return;
    }

    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "복슬은퇴_계산기_결과.xlsx");
  };

  // 통계 리포트
  function calcReport(condition: ReportCondtion) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const yearData: RetirementCalculatorYear[] = [];

    const startAmount = condition.netWorth;
    const investmentIncome = startAmount > 0 ? (startAmount * condition.step[0].targetReturnRate) / 100 : 0;
    const savingsAmount = condition.step[0].annualSavings;
    const totalAssets = condition.netWorth + investmentIncome + condition.step[0].annualSavings;
    const cumulativeInflationRate = 0;
    const livingExpenses = condition.step[0].spend * 12;
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

    const maxYearCount = 70;

    let stepStartYear = condition.step.map((step) => step.startYear);
    let stepIdx = 0;
    for (let yearIdx = 1; yearIdx <= maxYearCount; yearIdx++) {
      const beforeValue = yearData[yearIdx - 1];
      if (stepIdx + 1 < condition.step.length && yearIdx === stepStartYear[stepIdx + 1]) {
        stepIdx++;
      }
      const startAmount = beforeValue.remainingAssets;
      const targetReturnRate = condition.step[stepIdx].targetReturnRate;
      const annualSavings = condition.step[stepIdx].annualSavings;
      const savingsGrowthRate = condition.step[stepIdx].savingsGrowthRate;
      const annualInflationRate = condition.step[stepIdx].annualInflationRate;
      const spend = condition.step[stepIdx].spend;

      let investmentIncome = 0;
      if (startAmount > 0) {
        investmentIncome = (startAmount * targetReturnRate) / 100;
      }

      let savingsAmount = 0;

      savingsAmount = annualSavings * Math.pow(1 + savingsGrowthRate / 100, yearIdx);
      const totalAssets = startAmount + investmentIncome + savingsAmount;

      const cumulativeInflationRate = ((1 + beforeValue.cumulativeInflationRate / 100) * (1 + annualInflationRate / 100) - 1) * 100;

      let livingExpenses = 0;
      livingExpenses = spend * (1 + cumulativeInflationRate / 100) * 12;
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

  const LargeTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)(
    ({ theme }) => ({
      "& .MuiTooltip-tooltip": {
        fontSize: "1rem",
        padding: "10px 15px",
        maxWidth: "none", // 툴팁의 최대 너비 제한을 해제
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      },
    })
  );

  const formatCondition = (condition: ReportCondtion): React.ReactNode => {
    if (condition.type === "single") {
      const simpleCondition = convertSimpleCondition(condition);
      const conditionText = `
      순자산: ${formatNumber(simpleCondition.netWorth, "0,0")}만원
      저축금액: ${formatNumber(simpleCondition.annualSavings, "0,0")}만원
      저축 증가율: ${simpleCondition.savingsGrowthRate}%
      은퇴 시기: ${simpleCondition.expectedRetirementAge}년후
      은퇴후 월 순지출: ${formatNumber(simpleCondition.spend, "0,0")}만원
      목표 수익률: ${simpleCondition.targetReturnRate}%
      물가 상승률: ${simpleCondition.annualInflationRate}%
          `
        .trim()
        .replace(/^ +/gm, "");

      return (
        <LargeTooltip title={<pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{conditionText}</pre>} arrow>
          <Button variant="outlined" size="small">
            조건 보기
          </Button>
        </LargeTooltip>
      );
    } else {
      return (
        <Button variant="outlined" size="small" onClick={handleOpenMultiConditionModal}>
          다중 조건
        </Button>
      );
    }
  };

  const setupStickyHeader = () => {
    const table = tableRef.current;
    const header = headerRef.current;

    if (!table || !header) {
      return;
    }

    const stickyHeader = header.cloneNode(true) as HTMLTableSectionElement;
    stickyHeader.classList.add("sticky-header");
    document.body.appendChild(stickyHeader);
    stickyHeaderRef.current = stickyHeader;
    stickyHeader.style.display = "none";

    const handleScroll = () => {
      const rect = table.getBoundingClientRect();
      const tableTop = rect.top;
      const tableBottom = rect.bottom;

      if (tableTop < 50 && tableBottom > 0) {
        stickyHeader.style.display = "block";
        stickyHeader.style.width = table.offsetWidth + "px";
        const ths = stickyHeader.querySelectorAll("th");
        const originalThs = header.querySelectorAll("th");
        ths.forEach((th, index) => {
          th.style.width = originalThs[index].offsetWidth + "px";
        });
      } else {
        stickyHeader.style.display = "none";
      }
    };

    const handleResize = () => {
      stickyHeader.style.width = table.offsetWidth + "px";
      const ths = stickyHeader.querySelectorAll("th");
      const originalThs = header.querySelectorAll("th");
      ths.forEach((th, index) => {
        th.style.width = originalThs[index].offsetWidth + "px";
      });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      document.body.removeChild(stickyHeader);
    };
  };

  useEffect(() => {
    if (!condition) {
      return;
    }

    calcReport(condition);
  }, [condition]);
  const handleCloseChart = () => {
    setIsOpenChart(false);
  };

  useEffect(() => {
    return setupStickyHeader();
  }, []);

  return (
    <div className="table-container">
      {condition && (
        <Typography variant="body1" sx={{ margin: "8px 0" }}>
          {formatCondition(condition)}
          <Button onClick={openChartModal} startIcon={<InsertChartIcon />}>
            차트보기
          </Button>
          <Button onClick={handleDownload} startIcon={<GetAppIcon />}>
            다운로드
          </Button>
        </Typography>
      )}
      <TableContainer component={Paper}>
        <Table
          ref={tableRef}
          sx={{
            tableLayout: "fixed",
            "& .MuiTableCell-root": {
              border: "1px solid #555",
            },
            "& .MuiTableHead-root .MuiTableCell-root": {
              fontWeight: "bold",
              backgroundColor: "background.paper",
            },
          }}
        >
          <TableHead ref={headerRef}>
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
      <AssetChartModal data={retirementCalculatorYearList} open={isOpenChart} onClose={handleCloseChart} />
      <MultiConditionModal
        open={isOpenMultiConditionModal}
        onClose={handleCloseMultiConditionModal}
        onSubmit={(newCondition) => {
          onApplyMultiCondition(newCondition);
          handleCloseMultiConditionModal();
        }}
        initialCondition={condition}
      />
    </div>
  );
}

export default Report;
