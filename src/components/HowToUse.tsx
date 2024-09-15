import { Box, Button, Divider, Grid, Link, List, ListItem, Paper, Typography } from "@mui/material";
import React from "react";
import mainImage from "../images/about.png";
import { SimpleCondtion } from "./ConditionForm";

interface HowToUseProps {
  onApplyCondition: (condition: SimpleCondtion) => void;
}

const HowToUse: React.FC<HowToUseProps> = ({ onApplyCondition }) => {
  const applyExample = (condition: SimpleCondtion) => {
    onApplyCondition(condition);
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img src={mainImage} alt="복슬은퇴 계산기" style={{ width: "80%", maxWidth: "110px", borderRadius: "50%" }} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Typography variant="h4" component="h1" gutterBottom>
            복슬은퇴 계산기
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            지금부터 은퇴 후 생활까지 자신의 자산 변화를 어림짐작으로 계산하는 프로그램입니다.
          </Typography>
          <Link href="https://github.com/setvect/BokslRetire" target="_blank" rel="noopener" sx={{ float: "right" }}>
            Github Project 바로가기
          </Link>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" component="h2" gutterBottom>
        입력값 설명
      </Typography>
      <List dense>
        {[
          { primary: "순자산", secondary: "자산 - 부채" },
          { primary: "은퇴전 한해 저축금액", secondary: "한해 동안 저축가능한 금액" },
          { primary: "저축 증가률", secondary: "은퇴 전까지 해마다 늘어가는 저축 증가률" },
          { primary: "예상(희망) 은퇴 시기", secondary: "언제 은퇴하게 될것인지" },
          { primary: "은퇴후 월 순지출", secondary: "은퇴후 '지출 - 소득' 금액 현재가치로 작성" },
          { primary: "목표 수익률", secondary: "순자산를 기준으로한 목표 투자수익률(투자 금액 대비 수익률 아님)" },
          { primary: "연평균 물가 상승률", secondary: "예상하는 연평균 물가 상승률" },
        ].map((item, index) => (
          <ListItem key={index} sx={{ py: 0.5 }}>
            <Box display="flex" alignItems="center" width="100%">
              <Typography variant="subtitle2" component="span" sx={{ flexShrink: 0, minWidth: "20%", mr: 1 }}>
                {item.primary}:
              </Typography>
              <Typography variant="body2" component="span" color="text.secondary">
                {item.secondary}
              </Typography>
            </Box>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" component="h2" gutterBottom>
        계산 예시
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              예시 1: 청년 투자자
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              30년 후 은퇴, 적극적 투자, 풍족한 삶
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={() =>
                applyExample({
                  netWorth: 5000,
                  annualSavings: 2500,
                  savingsGrowthRate: 6,
                  targetReturnRate: 7,
                  annualInflationRate: 3.5,
                  expectedRetirementAge: 30,
                  spend: 500,
                })
              }
            >
              적용하기
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              예시 2: 중년 안정형
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              15년 후 은퇴 목표, 안정적 투자
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={() =>
                applyExample({
                  netWorth: 25000,
                  annualSavings: 3500,
                  savingsGrowthRate: 5,
                  targetReturnRate: 5,
                  annualInflationRate: 3,
                  expectedRetirementAge: 15,
                  spend: 250,
                })
              }
            >
              적용하기
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              예시 3: 생존형
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              5년 후 은퇴, 저축만하자 그리고 아까자!
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={() =>
                applyExample({
                  netWorth: 60000,
                  annualSavings: 3000,
                  savingsGrowthRate: 5,
                  targetReturnRate: 3.5,
                  annualInflationRate: 3,
                  expectedRetirementAge: 5,
                  spend: 200,
                })
              }
            >
              적용하기
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" component="h2" gutterBottom>
        은퇴 관련 통계
      </Typography>
      <Grid container spacing={2}>
        {[
          { label: "기대수명", url: "https://www.index.go.kr/unity/potal/indicator/IndexInfo.do?clasCd=2&idxCd=4234" },
          { label: "소비자물가 상승률", url: "https://www.index.go.kr/unify/idx-info.do?idxCd=4226" },
          { label: "가구 순자산", url: "https://www.index.go.kr/unity/potal/indicator/IndexInfo.do?clasCd=10&idxCd=F0139" },
          { label: "성별 연령대별 소득", url: "https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1EP_2010&conn_path=I2" },
          {
            label: "가구소비지출",
            url: "https://kosis.kr/visual/nsportalStats/detailContents.do?statJipyoId=3695&vStatJipyoId=5129&listId=F",
          },
          {
            label: "가구 인원별 소득, 소비지출",
            url: "https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1L9U005&vw_cd=MT_ZTITLE&list_id=&scrId=&seqNo=&lang_mode=ko&obj_var_id=&itm_id=&conn_path=E1&docId=0382660325&markType=S",
          },
          { label: "서울시 은퇴 후 적정 생활비", url: "https://data.seoul.go.kr/dataList/10414/S/2/datasetView.do" },
          { label: "국민연금 급여지급통계", url: "https://www.nps.or.kr/jsppage/stats/stats_map.jsp" },
        ].map((link, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Link href={link.url} target="_blank" underline="hover">
              {link.label}
            </Link>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default HowToUse;
