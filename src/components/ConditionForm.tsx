import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  FormHelperText,
} from "@mui/material";

export type ReportCondition = {
  netWorth: string;
  annualSavings: string;
  savingsGrowthRate: string;
  targetReturnRate: string;
  annualInflationRate: string;
  expectedRetirementAge: string;
  retireSpend: string;
};

type ConditionFormProps = {
  condition: ReportCondition;
  setCondition: React.Dispatch<React.SetStateAction<ReportCondition>>;
  onSubmit: () => void;
};

function ConditionForm({ condition, setCondition, onSubmit }: ConditionFormProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof ReportCondition, string>>>({});

  const handleExpectedRetirementAgeChange = (event: SelectChangeEvent<string>) => {
    setCondition((prevState) => ({
      ...prevState,
      expectedRetirementAge: event.target.value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, expectedRetirementAge: "" }));
  };

  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleChange =
    (field: keyof ReportCondition, removeDecimal = false) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value.replace(/,/g, "");
      if (removeDecimal) {
        value = value.replace(/\./g, "");
      }
      if (value === "-" || !isNaN(Number(value))) {
        setCondition((prevState) => ({
          ...prevState,
          [field]: formatNumber(value),
        }));
      }
      setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    };

  const validateForm = () => {
    let valid = true;
    const newErrors: Partial<Record<keyof ReportCondition, string>> = {};

    if (!condition.netWorth) {
      newErrors.netWorth = "순자산을 입력하세요.";
      valid = false;
    }
    if (!condition.annualSavings) {
      newErrors.annualSavings = "한해 저축금액을 입력하세요.";
      valid = false;
    }
    if (!condition.savingsGrowthRate) {
      newErrors.savingsGrowthRate = "저축 증가률을 입력하세요.";
      valid = false;
    }
    if (condition.expectedRetirementAge === "") {
      newErrors.expectedRetirementAge = "예상(희망) 은퇴 시기를 입력하세요.";
      valid = false;
    }
    if (!condition.retireSpend) {
      newErrors.retireSpend = "은퇴후 월 생활비를 입력하세요.";
      valid = false;
    }
    if (!condition.targetReturnRate) {
      newErrors.targetReturnRate = "목표 수익률을 입력하세요.";
      valid = false;
    }
    if (!condition.annualInflationRate) {
      newErrors.annualInflationRate = "연평균 물가 상승률을 입력하세요.";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleFormSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%", gap: "16px" }}>
      <TextField
        label="순자산"
        type="text"
        sx={{ m: 1, flex: 1, width: "25ch", input: { textAlign: "right" } }}
        value={condition.netWorth}
        onChange={handleChange("netWorth", true)}
        error={!!errors.netWorth}
        helperText={errors.netWorth}
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
        label="한해 저축금액"
        type="text"
        sx={{ m: 1, flex: 1, width: "25ch", input: { textAlign: "right" } }}
        value={condition.annualSavings}
        onChange={handleChange("annualSavings", true)}
        error={!!errors.annualSavings}
        helperText={errors.annualSavings}
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
        value={condition.savingsGrowthRate}
        onChange={handleChange("savingsGrowthRate")}
        error={!!errors.savingsGrowthRate}
        helperText={errors.savingsGrowthRate}
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
      <FormControl sx={{ m: 1, flex: 1, minWidth: 250 }} error={!!errors.expectedRetirementAge}>
        <InputLabel id="demo-simple-select-helper-label">예상(희망) 은퇴 시기</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={condition.expectedRetirementAge}
          onChange={handleExpectedRetirementAgeChange}
          variant="standard"
        >
          <MenuItem value="">
            <em>-- 선택해주세요 --</em>
          </MenuItem>
          {[...Array(51)].map((_, index) => (
            <MenuItem key={index} value={index}>
              {index === 0 ? "지금 당장" : `${index}년후`}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{errors.expectedRetirementAge}</FormHelperText>
      </FormControl>
      <TextField
        label="은퇴후 월 생활비(현재가치)"
        type="text"
        sx={{ m: 1, flex: 1.3, width: "25ch", input: { textAlign: "right" } }}
        value={condition.retireSpend}
        onChange={handleChange("retireSpend", true)}
        error={!!errors.retireSpend}
        helperText={errors.retireSpend}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start" sx={{ marginLeft: "5px" }}>
              만원
            </InputAdornment>
          ),
          inputProps: { maxLength: 6 },
          style: { textAlign: "right" },
        }}
        variant="standard"
      />
      <TextField
        label="목표 수익률"
        type="text"
        sx={{ m: 1, flex: 1, width: "25ch", input: { textAlign: "right" } }}
        value={condition.targetReturnRate}
        onChange={handleChange("targetReturnRate")}
        error={!!errors.targetReturnRate}
        helperText={errors.targetReturnRate}
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
        value={condition.annualInflationRate}
        onChange={handleChange("annualInflationRate")}
        error={!!errors.annualInflationRate}
        helperText={errors.annualInflationRate}
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

      <Button
        variant="contained"
        color="success"
        sx={{ m: 1, flex: 0.5, marginTop: "20px" }}
        onClick={handleFormSubmit}
      >
        계산하기
      </Button>
    </div>
  );
}

export default ConditionForm;
