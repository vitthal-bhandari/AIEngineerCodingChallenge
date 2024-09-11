import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styled from '@emotion/styled';
import Chip from '@mui/material/Chip';

const StyledButton = styled(Button)({
    '&:hover': {
        color: '#ffffff',
        backgroundColor: '#747bff'
    },
  });

const StyledIgnoreButton = styled(Button)({
    backgroundColor: '#d32f2f',
    color: '#ffffff',
    '&:hover': {
        color: '#d32f2f',
        backgroundColor: '#ffffff',
        border: '1px solid #d32f2f'
    },
  });
  
const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export interface CardProps {
        obj: any;
        resolveAiSuggestion: (paragraph: number, suggestion: string) => void;
        ignoreAiSuggestion: (suggestion: string) => void;
    }

export default function BasicCard({obj, resolveAiSuggestion, ignoreAiSuggestion}: CardProps) {

    const ColoredChip = (severity: any) => {
        const barColor= (severity['severity']==='high') ? 'error' : (severity['severity']==='medium' ? 'warning' : 'info')
        return (
            <span><Chip sx={{marginBottom: '15px'}} color={barColor} label={severity['severity']} variant="outlined"/></span>
        )
    }

    return (
        <Card sx={{ minWidth: 275, maxWidth: '300px', minHeight: '240px', overflowY: 'auto', marginBottom: '15px' }}>
        <CardContent>
            <ColoredChip severity={obj['severity']}/>
            <Typography variant="h5" component="div">
            {bull}{obj['type']}{bull}
            </Typography>

            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
            {obj['description']}
            </Typography>

            {/* <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography> */}
            <Typography variant="body2">
            {obj['suggestion']}
            </Typography>
        </CardContent>
        <CardActions sx={{display: 'flex', justifyContent: 'space-around'}}>
            <StyledButton size="small" onClick={() => {resolveAiSuggestion(obj['paragraph'], obj['suggestion']);}}>RESOLVE</StyledButton>
            <StyledIgnoreButton size="small" onClick={() => {ignoreAiSuggestion(obj['suggestion']);}}>IGNORE</StyledIgnoreButton>
        </CardActions>
        </Card>
    );
}
