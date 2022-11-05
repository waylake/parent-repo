import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';

export function DrawOriginalText({txt}) {
  const [expanded, setExpanded] = useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
  <div>
  <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
      <Typography>Original Text</Typography>
    </AccordionSummary>
    <AccordionDetails>
      {txt}
    </AccordionDetails>
  </Accordion>
  </div>);
}