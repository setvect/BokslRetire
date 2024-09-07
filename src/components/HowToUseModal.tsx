import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Modal } from "@mui/material";
import React from "react";
import { SimpleCondtion } from "./ConditionForm";
import HowToUse from "./HowToUse";

const MODAL_STYLE = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 1000,
  maxHeight: "90vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  overflowY: "auto",
};

interface HowToUseModalProps {
  open: boolean;
  onClose: () => void;
  onApplyCondition: (condition: SimpleCondtion) => void;
}

const HowToUseModal: React.FC<HowToUseModalProps> = ({ open, onClose, onApplyCondition }) => {
  const handleApplyCondition = (condition: SimpleCondtion) => {
    onApplyCondition(condition);
    onClose();
  };

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

        <HowToUse onApplyCondition={handleApplyCondition} />
      </Box>
    </Modal>
  );
};

export default HowToUseModal;
