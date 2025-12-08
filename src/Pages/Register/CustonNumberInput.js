import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box } from '@mui/material';

const CustomNumberInput = ({
    value,
    onChange,
    min = 1,
    max = 999,
    suffix = '',
    disabled = false,
    error = false
}) => {
    const handleIncrement = () => {
        if (!disabled && value < max) {
            onChange(value + 1);
        }
    };

    const handleDecrement = () => {
        if (!disabled && value > min) {
            onChange(value - 1);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'stretch',
                border: error ? '1px solid #d32f2f' : '1px solid rgba(229, 204, 146, 0.3)',
                borderRadius: '4px',
                overflow: 'hidden',
                backgroundColor: disabled ? '#f5f5f5' : '#fff',
                transition: 'border-color 0.3s',
                '&:hover': {
                    borderColor: error ? '#d32f2f' : '#e5cc92',
                },
                '&:focus-within': {
                    borderColor: error ? '#d32f2f' : '#e5cc92',
                    boxShadow: error
                        ? '0 0 0 2px rgba(211, 47, 47, 0.2)'
                        : '0 0 0 2px rgba(229, 204, 146, 0.2)',
                }
            }}
        >
            {/* Decrement Button */}
            <Box
                component="button"
                type="button"
                onClick={handleDecrement}
                disabled={disabled || value <= min}
                sx={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#e5cc92',
                    padding: '4px 8px',
                    cursor: value <= min || disabled ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: value <= min || disabled ? 0.4 : 1,
                    transition: 'all 0.2s',
                    minWidth: '32px',
                    height: '32px',
                    '&:hover:not(:disabled)': {
                        backgroundColor: 'rgba(229, 204, 146, 0.1)',
                    },
                    '&:active:not(:disabled)': {
                        backgroundColor: 'rgba(229, 204, 146, 0.2)',
                    }
                }}
            >
                <RemoveIcon sx={{ fontSize: '18px' }} />
            </Box>

            {/* Value Display */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px 12px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: disabled ? '#999' : '#333',
                    userSelect: 'none',
                    minWidth: '70px',
                    textAlign: 'center',
                    height: '32px',
                }}
            >
                {value} {suffix}
            </Box>

            {/* Increment Button */}
            <Box
                component="button"
                type="button"
                onClick={handleIncrement}
                disabled={disabled || value >= max}
                sx={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#e5cc92',
                    padding: '4px 8px',
                    cursor: value >= max || disabled ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: value >= max || disabled ? 0.4 : 1,
                    transition: 'all 0.2s',
                    minWidth: '32px',
                    height: '32px',
                    '&:hover:not(:disabled)': {
                        backgroundColor: 'rgba(229, 204, 146, 0.1)',
                    },
                    '&:active:not(:disabled)': {
                        backgroundColor: 'rgba(229, 204, 146, 0.2)',
                    }
                }}
            >
                <AddIcon sx={{ fontSize: '18px' }} />
            </Box>
        </Box>
    );
};

export default CustomNumberInput;