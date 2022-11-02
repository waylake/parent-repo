import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export function DrawOriginalText({txt}) {
  return (
  <div>
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
      <Typography>Original Text</Typography>
    </AccordionSummary>
    <AccordionDetails>
      {txt}
    </AccordionDetails>
  </Accordion>
  </div>);
}