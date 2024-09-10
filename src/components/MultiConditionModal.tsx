import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  IconButton,
  Modal,
  TextField,
  Button,
  Grid,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { ReportCondtion } from "../common/CommonType";
import { SelectChangeEvent } from "@mui/material/Select";

const MODAL_STYLE = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  height: 800,
  maxWidth: 1400,
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

type MultiConditionFormValue = {
  netWorth: string;
  step: {
    startYear: string;
    annualSavings: string;
    savingsGrowthRate: string;
    targetReturnRate: string;
    annualInflationRate: string;
    spend: string;
  }[];
};

const MultiConditionModal: React.FC<MultiConditionProps> = ({ open, onClose, onSubmit }) => {
  const theme = useTheme();
  const [multiCondition, setMultiCondition] = useState<MultiConditionFormValue>({
    netWorth: "",
    step: [
      {
        startYear: "0",
        annualSavings: "",
        savingsGrowthRate: "",
        targetReturnRate: "",
        annualInflationRate: "",
        spend: "",
      },
    ],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const validateField = (field: string, value: string, index?: number) => {
    let error = "";
    const numValue = parseFloat(value);

    switch (field) {
      case "netWorth":
        if (!value) error = "순자산을 입력하세요.";
        break;
      case "startYear":
        if (!value) error = "시작 년도를 선택하세요.";
        if (index !== undefined && index > 0) {
          const prevYear = parseInt(multiCondition.step[index - 1].startYear);
          const currentYear = parseInt(value);
          if (currentYear <= prevYear) {
            error = `${prevYear + 1}년 이후를 선택하세요.`;
          }
        }
        break;
      case "annualSavings":
        if (!value) error = "저축가능금액을 입력하세요.";
        break;
      case "savingsGrowthRate":
        if (!value) error = "저축 증가률을 입력하세요.";
        else if (numValue > 50) error = "저축 증가율은 50이하로 입력하세요.";
        break;
      case "targetReturnRate":
        if (!value) error = "목표 수익률을 입력하세요.";
        else if (numValue > 30) error = "목표 수익률은 30이하로 입력하세요.";
        break;
      case "annualInflationRate":
        if (!value) error = "물가상승률을 입력하세요.";
        else if (numValue > 20) error = "물가상승률은 20이하로 입력하세요.";
        break;
      case "spend":
        if (!value) error = "순지출을 입력하세요.";
        break;
    }

    return error;
  };

  const handleInputChange =
    (field: keyof MultiConditionFormValue["step"][0], index: number, removeDecimal = false) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value.replace(/,/g, "");
      if (removeDecimal) {
        value = value.replace(/\./g, "");
      }
      if (value === "-" || !isNaN(Number(value))) {
        const newStep = [...multiCondition.step];
        newStep[index] = { ...newStep[index], [field]: formatNumber(value) };
        setMultiCondition({ ...multiCondition, step: newStep });

        // Validate the changed field
        const error = validateField(field, value, index);
        setErrors((prev) => ({
          ...prev,
          [`step.${index}.${field}`]: error,
        }));
      }
    };

  const handleNetWorthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/,/g, "").replace(/\./g, "");
    if (value === "-" || !isNaN(Number(value))) {
      setMultiCondition({ ...multiCondition, netWorth: formatNumber(value) });

      // Validate netWorth
      const error = validateField("netWorth", value);
      setErrors((prev) => ({
        ...prev,
        netWorth: error,
      }));
    }
  };

  const handleFormSubmit = () => {
    if (validateForm()) {
      const reportCondition = convertToReportCondition(multiCondition);
      onSubmit(reportCondition);
      onClose();
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    newErrors["netWorth"] = validateField("netWorth", multiCondition.netWorth);

    multiCondition.step.forEach((step, index) => {
      Object.keys(step).forEach((field) => {
        const error = validateField(field, step[field as keyof typeof step], index);
        if (error) {
          newErrors[`step.${index}.${field}`] = error;
        }
      });
    });

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
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
    if (multiCondition.step.length < 5) {
      const lastYear = parseInt(multiCondition.step[multiCondition.step.length - 1].startYear);
      setMultiCondition({
        ...multiCondition,
        step: [
          ...multiCondition.step,
          {
            startYear: (lastYear + 1).toString(),
            annualSavings: "",
            savingsGrowthRate: "",
            targetReturnRate: "",
            annualInflationRate: "",
            spend: "",
          },
        ],
      });
    }
  };

  const removeStep = (index: number) => {
    const newStep = multiCondition.step.filter((_, i) => i !== index);
    setMultiCondition({ ...multiCondition, step: newStep });
  };

  const getYearOptions = (index: number) => {
    if (index === 0) {
      return [{ value: "0", label: "현재" }];
    } else {
      const prevYear = parseInt(multiCondition.step[index - 1].startYear);
      return Array.from({ length: 50 - prevYear }, (_, i) => i + prevYear + 1).map((year) => ({
        value: year.toString(),
        label: `+${year}년`,
      }));
    }
  };

  const handleStartYearChange = (index: number) => (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    const newStep = [...multiCondition.step];
    newStep[index] = { ...newStep[index], startYear: value };
    setMultiCondition({ ...multiCondition, step: newStep });

    // Validate the changed field
    const error = validateField("startYear", value, index);
    setErrors((prev) => ({
      ...prev,
      [`step.${index}.startYear`]: error,
    }));
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box
        sx={{
          ...MODAL_STYLE,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.text.secondary,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: theme.palette.background.default }}>
          <Typography variant="h6" gutterBottom color="text.primary">
            다단계 조건 입력 방법
          </Typography>
          <Typography variant="body2" color="text.secondary">
            순자산 입력 → 현재 계획 입력 → 변화 필요 시 "새로운 단계 추가" → 변경 값만 입력 → 완료 후 "결과보기" 클릭 (최대 5단계)
          </Typography>
        </Paper>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={2}>
            <TextField
              label="순자산"
              type="text"
              value={multiCondition.netWorth}
              onChange={handleNetWorthChange}
              fullWidth
              margin="normal"
              error={!!errors["netWorth"]}
              helperText={errors["netWorth"]}
              InputProps={{
                endAdornment: <InputAdornment position="end">만원</InputAdornment>,
                inputProps: { style: { textAlign: "right" }, maxLength: 7 },
              }}
            />
          </Grid>
        </Grid>

        {multiCondition.step.map((step, index) => (
          <Grid container spacing={2} key={index} alignItems="center">
            <Grid item xs={2}>
              <FormControl fullWidth margin="dense" error={!!errors[`step.${index}.startYear`]}>
                <InputLabel>시작 년도</InputLabel>
                <Select value={step.startYear} onChange={handleStartYearChange(index)} label="시작 년도" disabled={index === 0}>
                  {getYearOptions(index).map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors[`step.${index}.startYear`] && <FormHelperText>{errors[`step.${index}.startYear`]}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={11 / 6}>
              <TextField
                label="저축가능금액"
                type="text"
                value={step.annualSavings}
                onChange={handleInputChange("annualSavings", index, true)}
                fullWidth
                margin="dense"
                error={!!errors[`step.${index}.annualSavings`]}
                helperText={errors[`step.${index}.annualSavings`]}
                InputProps={{
                  endAdornment: <InputAdornment position="end">만원</InputAdornment>,
                  inputProps: { style: { textAlign: "right" }, maxLength: 7 },
                }}
              />
            </Grid>
            <Grid item xs={11 / 6}>
              <TextField
                label="저축 증가률"
                type="text"
                value={step.savingsGrowthRate}
                onChange={handleInputChange("savingsGrowthRate", index)}
                fullWidth
                margin="dense"
                error={!!errors[`step.${index}.savingsGrowthRate`]}
                helperText={errors[`step.${index}.savingsGrowthRate`]}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { style: { textAlign: "right" }, maxLength: 5 },
                }}
              />
            </Grid>
            <Grid item xs={11 / 6}>
              <TextField
                label="목표 수익률"
                type="text"
                value={step.targetReturnRate}
                onChange={handleInputChange("targetReturnRate", index)}
                fullWidth
                margin="dense"
                error={!!errors[`step.${index}.targetReturnRate`]}
                helperText={errors[`step.${index}.targetReturnRate`]}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { style: { textAlign: "right" }, maxLength: 5 },
                }}
              />
            </Grid>
            <Grid item xs={11 / 6}>
              <TextField
                label="물가상승률"
                type="text"
                value={step.annualInflationRate}
                onChange={handleInputChange("annualInflationRate", index)}
                fullWidth
                margin="dense"
                error={!!errors[`step.${index}.annualInflationRate`]}
                helperText={errors[`step.${index}.annualInflationRate`]}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { style: { textAlign: "right" }, maxLength: 5 },
                }}
              />
            </Grid>
            <Grid item xs={11 / 6}>
              <TextField
                label="월 순지출"
                type="text"
                value={step.spend}
                onChange={handleInputChange("spend", index, true)}
                fullWidth
                margin="dense"
                error={!!errors[`step.${index}.spend`]}
                helperText={errors[`step.${index}.spend`]}
                InputProps={{
                  endAdornment: <InputAdornment position="end">만원</InputAdornment>,
                  inputProps: { style: { textAlign: "right" }, maxLength: 7 },
                }}
              />
            </Grid>
            <Grid item xs={0.8} container justifyContent="center" alignItems="center">
              {index !== 0 && (
                <IconButton onClick={() => removeStep(index)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Grid>
          </Grid>
        ))}

        <Button
          startIcon={<AddIcon />}
          onClick={addNewStep}
          sx={{ mt: 2, color: theme.palette.text.primary }}
          disabled={multiCondition.step.length >= 5}
        >
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
