import React, { ReactNode } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface ExpandableSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: ReactNode;
  titleClassName?: string;
  contentClassName?: string;
  className?: string;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  isExpanded,
  onToggle,
  children,
  titleClassName,
  contentClassName,
  className,
}) => {
  return (
    <Accordion expanded={isExpanded} onChange={onToggle} className={className} disableGutters elevation={1}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          '& .MuiAccordionSummary-content': {
            margin: '12px 0',
          },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: 'text.primary',
          }}
          className={titleClassName}
        >
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails className={contentClassName}>{children}</AccordionDetails>
    </Accordion>
  );
};

export default ExpandableSection;
