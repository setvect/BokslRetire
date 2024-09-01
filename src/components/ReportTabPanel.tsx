import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Box, Container, Tabs, Tab, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import Report from "./Report";
import { ReportCondtion } from "./ConditionForm";
import HowToUse from "./HowToUse";

interface TabPanelProps {
  onApplyCondition: (condition: ReportCondtion) => void;
}

export interface ReportTabHandle {
  addCondtion: (init: ReportCondtion) => void;
}

const ReportTabPanel = forwardRef<ReportTabHandle, TabPanelProps>((props, ref) => {
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState<{ label: string; condition: ReportCondtion }[]>([]);

  useImperativeHandle(ref, () => ({
    addCondtion: (condition: ReportCondtion) => {
      setTabs((prevTabs) => [...prevTabs, { label: `결과 ${prevTabs.length + 1}`, condition }]);
      setActiveTab(tabs.length);
    },
  }));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => setActiveTab(newValue);
  const handleCloseTab = (index: number) => {
    setTabs((prevTabs) => prevTabs.filter((_, i) => i !== index));
    setActiveTab((prevActiveTab) => (prevActiveTab === index ? 0 : prevActiveTab > index ? prevActiveTab - 1 : prevActiveTab));
  };
  const handleCloseAllTabs = () => {
    setTabs([]);
    setActiveTab(0);
  };

  return (
    <Box sx={{ flex: "1 1 auto", overflow: "auto" }}>
      <Container maxWidth={false} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ width: "auto" }}>
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {tab.label}
                    <IconButton
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleCloseTab(index);
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                }
              />
            ))}
          </Tabs>
          {tabs.length > 1 && (
            <IconButton onClick={handleCloseAllTabs} sx={{ ml: 2 }}>
              <CancelPresentationIcon />
            </IconButton>
          )}
        </Box>
        {tabs.map((tab, index) => (
          <Box key={index} role="tabpanel" hidden={activeTab !== index}>
            {activeTab === index && <Report condition={tab.condition} />}
          </Box>
        ))}

        {tabs.length === 0 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ width: "900px" }}>
              <HowToUse onApplyCondition={props.onApplyCondition} />
            </Box>
          </div>
        )}
      </Container>
    </Box>
  );
});

export default ReportTabPanel;
