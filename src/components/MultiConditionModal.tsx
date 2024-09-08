import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { Box, IconButton, Modal, TextField, Button, Grid, InputAdornment, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import React, { useState } from "react";
import { ReportCondtion } from "../common/CommonType";

const MODAL_STYLE = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%", // 넓이를 95%로 증가
  maxWidth: 1400, // 최대 넓이를 1400px로 증가
  maxHeight: "90vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  overflowY: "auto",
};

interface MultiConditionProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reportCondition: ReportCondtion) => void;
}

export type MultiConditionFormValue = {
  netWorth: string;
  step: MultiStepCondtionForm[];
};

export type MultiStepCondtionForm = {
  startYear: string;
  annualSavings: string;
  savingsGrowthRate: string;
  targetReturnRate: string;
  annualInflationRate: string;
  spend: string;
};

const MultiConditionModal: React.FC<MultiConditionProps> = ({ open, onClose, onSubmit }) => {
  const [multiCondition, setMultiCondition] = useState<MultiConditionFormValue>({
    netWorth: "",
    step: [
      {
        startYear: "",
        annualSavings: "",
        savingsGrowthRate: "",
        targetReturnRate: "",
        annualInflationRate: "",
        spend: "",
      },
    ],
  });

  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleInputChange =
    (field: keyof MultiStepCondtionForm, index: number, removeDecimal = false) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value.replace(/,/g, "");
      if (removeDecimal) {
        value = value.replace(/\./g, "");
      }
      if (value === "" || !isNaN(Number(value))) {
        const newStep = [...multiCondition.step];
        newStep[index] = { ...newStep[index], [field]: removeDecimal ? formatNumber(value) : value };
        setMultiCondition({ ...multiCondition, step: newStep });
      }
    };

  const handleFormSubmit = () => {
    const reportCondition = convertToReportCondition(multiCondition);
    onSubmit(reportCondition);
  };

  const convertToReportCondition = (condition: MultiConditionFormValue): ReportCondtion => {
    return {
      netWorth: parseFloat(condition.netWorth.replace(/,/g, "")),
      type: "multi",
      step: condition.step.map((step) => ({
        startYear: parseInt(step.startYear),
        annualSavings: parseFloat(step.annualSavings.replace(/,/g, "")),
        savingsGrowthRate: parseFloat(step.savingsGrowthRate),
        targetReturnRate: parseFloat(step.targetReturnRate),
        annualInflationRate: parseFloat(step.annualInflationRate),
        spend: parseFloat(step.spend.replace(/,/g, "")),
      })),
    };
  };

  const addNewStep = () => {
    setMultiCondition({
      ...multiCondition,
      step: [
        ...multiCondition.step,
        {
          startYear: "",
          annualSavings: "",
          savingsGrowthRate: "",
          targetReturnRate: "",
          annualInflationRate: "",
          spend: "",
        },
      ],
    });
  };

  const yearOptions = Array.from({ length: 51 }, (_, i) => i);

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box sx={MODAL_STYLE}>
        <IconButton
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

        <TextField
          label="순자산"
          type="text"
          value={multiCondition.netWorth}
          onChange={(e) => setMultiCondition({ ...multiCondition, netWorth: formatNumber(e.target.value.replace(/,/g, "")) })}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: <InputAdornment position="end">만원</InputAdornment>,
            inputProps: { style: { textAlign: "right" }, maxLength: 7 },
          }}
        />

        {multiCondition.step.map((step, index) => (
          <Grid container spacing={2} key={index} alignItems="center">
            <Grid item xs={1.5}>
              <FormControl fullWidth margin="dense">
                <InputLabel>시작 년도</InputLabel>
                <Select
                  value={step.startYear}
                  onChange={(e) => handleInputChange("startYear", index)(e as React.ChangeEvent<HTMLInputElement>)}
                  label="시작 년도"
                >
                  {yearOptions.map((year) => (
                    <MenuItem key={year} value={year.toString()}>
                      {year === 0 ? "현재" : `+${year}년`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={1.5}>
              <TextField
                label="저축가능금액"
                type="text"
                value={step.annualSavings}
                onChange={handleInputChange("annualSavings", index, true)}
                fullWidth
                margin="dense"
                InputProps={{
                  endAdornment: <InputAdornment position="end">만원</InputAdornment>,
                  inputProps: { style: { textAlign: "right" }, maxLength: 7 },
                }}
              />
            </Grid>
            <Grid item xs={1.5}>
              <TextField
                label="저축 증가률"
                type="text"
                value={step.savingsGrowthRate}
                onChange={handleInputChange("savingsGrowthRate", index)}
                fullWidth
                margin="dense"
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { style: { textAlign: "right" }, maxLength: 5 },
                }}
              />
            </Grid>
            <Grid item xs={1.5}>
              <TextField
                label="목표 수익률"
                type="text"
                value={step.targetReturnRate}
                onChange={handleInputChange("targetReturnRate", index)}
                fullWidth
                margin="dense"
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { style: { textAlign: "right" }, maxLength: 5 },
                }}
              />
            </Grid>
            <Grid item xs={1.5}>
              <TextField
                label="물가상승률"
                type="text"
                value={step.annualInflationRate}
                onChange={handleInputChange("annualInflationRate", index)}
                fullWidth
                margin="dense"
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { style: { textAlign: "right" }, maxLength: 5 },
                }}
              />
            </Grid>
            <Grid item xs={1.5}>
              <TextField
                label="순지출"
                type="text"
                value={step.spend}
                onChange={handleInputChange("spend", index, true)}
                fullWidth
                margin="dense"
                InputProps={{
                  endAdornment: <InputAdornment position="end">만원</InputAdornment>,
                  inputProps: { style: { textAlign: "right" }, maxLength: 7 },
                }}
              />
            </Grid>
          </Grid>
        ))}

        <Button startIcon={<AddIcon />} onClick={addNewStep} sx={{ mt: 2 }}>
          새로운 단계 추가
        </Button>

        <Button variant="contained" color="primary" onClick={handleFormSubmit} sx={{ mt: 2, ml: 2 }}>
          결과보기
        </Button>
      </Box>
    </Modal>
  );
};

export default MultiConditionModal;
