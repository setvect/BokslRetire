export type ReportCondtion = {
  netWorth: number; // 순자산
  type: "single" | "multi";
  step: ReportStepCondtion[];
};

export type ReportStepCondtion = {
  startYear: number; // 시작 년도
  annualSavings: number; // 한해 저축가능금액
  savingsGrowthRate: number; // 저축 증가률
  targetReturnRate: number; // 목표 수익률
  annualInflationRate: number; // 연평균 물가상승률
  // expectedRetirementAge: number; // 예상 은퇴시기
  spend: number; // 순지출(현재가치)
};
