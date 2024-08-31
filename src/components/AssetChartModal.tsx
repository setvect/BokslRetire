import CloseIcon from "@mui/icons-material/Close";
import { Box, Checkbox, DialogTitle, FormControlLabel, IconButton, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatNumber } from "../util/Util";

type AssetChartProps = {
  data: any[];
  open: boolean;
  onClose: () => void;
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "70%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const AssetChartModal: React.FC<AssetChartProps> = ({ data, open, onClose }) => {
  const [isLogScale, setIsLogScale] = useState(false);

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

  const handleLogScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLogScale(event.target.checked);
  };

  useEffect(() => {
    if (open) {
      setIsLogScale(false);
    }
  }, [open]);

  const hasNegativeValues = data.some((item) => item.remainingAssetsPresentValue <= 0);
  const maxValue = Math.max(...data.map((item) => item.remainingAssetsPresentValue));
  const marginFactor = 1.05; // 5% margin 추가
  const adjustedMaxValue = maxValue * marginFactor;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box sx={style}>
        <DialogTitle>
          <Typography variant="h6" component="h2" sx={{ textAlign: "center", flexGrow: 1 }}>
            자산 변화 차트
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          {!hasNegativeValues && (
            <FormControlLabel
              sx={{
                position: "absolute",
                right: 20,
                top: 50,
                color: (theme) => theme.palette.grey[500],
              }}
              control={<Checkbox checked={isLogScale} onChange={handleLogScaleChange} />}
              label="로그 스케일"
            />
          )}
        </DialogTitle>

        <ResponsiveContainer width="100%" height="95%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="year" stroke="#ddd" />
            <YAxis
              tickFormatter={yAxisTickFormatter}
              scale={isLogScale ? "log" : "linear"}
              domain={isLogScale ? ["auto", adjustedMaxValue] : [0, adjustedMaxValue]}
              stroke="#ddd"
              width={120}
              tick={{ fill: "#ddd" }}
              tickMargin={10}
            />
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
    </Modal>
  );
};

export default AssetChartModal;
