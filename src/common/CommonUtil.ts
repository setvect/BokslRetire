import { SimpleCondtion } from "../components/ConditionForm";
import { ReportCondtion, ReportStepCondtion } from "./CommonType";

export function convertSimpleConditionToReportCondition(simpleCondition: SimpleCondtion) {
  const retirementSpend = simpleCondition.spend;

  const stepList: ReportStepCondtion[] = [];
  let annualSavings = 0;
  let spend = 0;

  if (simpleCondition.expectedRetirementAge > 0) {
    annualSavings = simpleCondition.annualSavings;
  } else {
    spend = retirementSpend;
  }

  // 은퇴 이전시점, 은퇴 후 시점 조건 생성
  const step = {
    startYear: 0,
    annualSavings,
    savingsGrowthRate: simpleCondition.savingsGrowthRate,
    targetReturnRate: simpleCondition.targetReturnRate,
    annualInflationRate: simpleCondition.annualInflationRate,
    spend,
  } as ReportStepCondtion;
  stepList.push(step, { ...step, startYear: simpleCondition.expectedRetirementAge, annualSavings: 0, spend: retirementSpend });

  return {
    netWorth: simpleCondition.netWorth,
    type: "single",
    step: stepList,
  } as ReportCondtion;
}
