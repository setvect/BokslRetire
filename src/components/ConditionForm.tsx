import React, { useState, forwardRef, useImperativeHandle } from "react";
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

export type ConditionFormValue = {
  netWorth: string;
  annualSavings: string;
  savingsGrowthRate: string;
  targetReturnRate: string;
  annualInflationRate: string;
  expectedRetirementAge: string;
  retireSpend: string;
};

export type ReportCondtion = {
  netWorth: number; // 순자산
  annualSavings: number; // 한해 저축가능금액
  savingsGrowthRate: number; // 저축 증가률
  targetReturnRate: number; // 목표 수익률
  annualInflationRate: number; // 연평균 물가상승률
  expectedRetirementAge: number; // 예상 은퇴시기
  retireSpend: number; // 은퇴후 월 생활비(현재가치)
};

type ConditionFormProps = {
  onSubmit: (reportCondition: ReportCondtion) => void;
};

export interface ConditionFormHandle {
  initFomrmValue: (init: ReportCondtion) => void;
}

const ConditionForm = forwardRef<ConditionFormHandle, ConditionFormProps>((props, ref) => {
  const [errors, setErrors] = useState<Partial<Record<keyof ConditionFormValue, string>>>({});

  const [condition, setCondition] = React.useState<ConditionFormValue>({
    netWorth: "",
    annualSavings: "",
    savingsGrowthRate: "",
    targetReturnRate: "",
    annualInflationRate: "",
    expectedRetirementAge: "",
    retireSpend: "",
  });

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

  useImperativeHandle(ref, () => ({
    initFomrmValue(init: ReportCondtion) {
      setCondition({
        netWorth: formatNumber(init.netWorth.toString()),
        annualSavings: formatNumber(init.annualSavings.toString()),
        savingsGrowthRate: formatNumber(init.savingsGrowthRate.toString()),
        targetReturnRate: formatNumber(init.targetReturnRate.toString()),
        annualInflationRate: formatNumber(init.annualInflationRate.toString()),
        expectedRetirementAge: formatNumber(init.expectedRetirementAge.toString()),
        retireSpend: formatNumber(init.retireSpend.toString()),
      });
    },
  }));

  const handleChange =
    (field: keyof ConditionFormValue, removeDecimal = false) =>
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
    const newErrors: Partial<Record<keyof ConditionFormValue, string>> = {};

    if (!condition.netWorth) {
      newErrors.netWorth = "순자산을 입력하세요.";
      valid = false;
    }
    if (!condition.annualSavings) {
      newErrors.annualSavings = "은퇴전 한해 저축금액을 입력하세요.";
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

  const convertToReportCondition = (condition: ConditionFormValue): ReportCondtion => {
    return {
      netWorth: parseFloat(condition.netWorth.replace(/,/g, "")),
      annualSavings: parseFloat(condition.annualSavings.replace(/,/g, "")),
      savingsGrowthRate: parseFloat(condition.savingsGrowthRate.replace(/,/g, "")),
      targetReturnRate: parseFloat(condition.targetReturnRate.replace(/,/g, "")),
      annualInflationRate: parseFloat(condition.annualInflationRate.replace(/,/g, "")),
      expectedRetirementAge: parseInt(condition.expectedRetirementAge, 10),
      retireSpend: parseFloat(condition.retireSpend.replace(/,/g, "")),
    };
  };
  const handleFormSubmit = () => {
    if (validateForm()) {
      const reportCondition = convertToReportCondition(condition);
      props.onSubmit(reportCondition);
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
        label="은퇴전 한해 저축금액"
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

      <Button variant="contained" color="success" sx={{ m: 1, flex: 0.5, marginTop: "20px" }} onClick={handleFormSubmit}>
        계산하기
      </Button>
    </div>
  );
});

export default ConditionForm;
