import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { formatNumber } from "../util/Util";

type AssetChartProps = {
  data: any[];
  open: boolean;
  onClose: () => void;
};

// 범례 포맷터 함수
const legendFormatter = (value: string) => {
  switch (value) {
    case "remainingAssetsPresentValue":
      return "자산(현재가치 기준)";
    default:
      return value;
  }
};

// 툴팁 포맷터 함수
const tooltipFormatter = (value: any, name: string) => {
  const formattedValue = formatNumber(value, "0,0") + "만원";
  switch (name) {
    case "remainingAssetsPresentValue":
      return [formattedValue, "자산(현재가치 기준)"];
    default:
      return [formattedValue, name];
  }
};

// 툴팁 레이블 포맷터 함수
const labelFormatter = (label: any) => {
  const focusYear = Number(label);
  const nowYear = new Date().getFullYear();
  return `${label}년(+${focusYear - nowYear}년)`;
};

// Y축 틱 포맷터 함수
const yAxisTickFormatter = (value: number) => {
  return `${formatNumber(value, "0,0")}만원`;
};

const AssetChart = ({ data, open, onClose }: AssetChartProps): React.ReactElement | null => {
  if (!open) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "absolute",
        top: "30%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "80%",
        height: "550px",
        padding: 2,
        backgroundColor: "#555",
        boxShadow: 3,
        borderRadius: 2,
        zIndex: 1000,
      }}
    >
      <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <Typography variant="h6" align="center" color="#ddd" gutterBottom>
        자산 변화 차트
      </Typography>
      <ResponsiveContainer width="100%" height="95%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="year" stroke="#ddd" />
          <YAxis tickFormatter={yAxisTickFormatter} stroke="#ddd" width={120} tick={{ fill: "#ddd" }} tickMargin={10} />
          <Tooltip
            contentStyle={{ backgroundColor: "#333", border: "none" }}
            itemStyle={{ color: "#ddd" }}
            formatter={tooltipFormatter}
            labelFormatter={labelFormatter}
          />
          <Legend formatter={legendFormatter} />
          <ReferenceLine y={0} stroke="#b77" strokeWidth={2} />
          <Line type="monotone" dataKey="remainingAssetsPresentValue" stroke="#82ca9d" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default AssetChart;
