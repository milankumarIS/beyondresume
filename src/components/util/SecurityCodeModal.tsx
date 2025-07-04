import React, { useState, useRef } from 'react';
import { Modal, Box, Typography, Button, Grid, TextField } from '@mui/material';
import { validateCode } from '../../services/services';

interface SecurityCodeModalProps {
  open: boolean;
  handleClose: () => void;
  setRide: (ride: any) => void;
  tripData: any; 
  openSnackBar: (message: string) => void;
}

const SecurityCodeModal: React.FC<SecurityCodeModalProps> = ({ open, handleClose, setRide, tripData, openSnackBar }) => {
  const [securityCode, setSecurityCode] = useState(Array(6).fill(''));
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value)) {
      let newCode = [...securityCode];
      newCode[index] = value;
      setSecurityCode(newCode);

      if (index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
      setError('');
    }
  };


  // const handleKeyDown = (e, index) => {
  //   if (e.key === 'Backspace' && securityCode[index] === '') {
  //     if (index > 0 && inputRefs.current[index - 1]) {
  //       inputRefs.current[index - 1]?.focus();
  //     }
  //   }
  // };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      let newCode = [...securityCode];

      if (securityCode[index] !== '') {
        newCode[index] = '';
        setSecurityCode(newCode);
      } else if (index > 0) {

        inputRefs.current[index - 1]?.focus();
        newCode[index - 1] = '';
        setSecurityCode(newCode);
      }
    }
  };

  const handleSubmit = () => {
    if (securityCode.join('').length !== 6) {
      setError('Please enter a valid 6-digit code.');
    } else {
      validateCode(tripData?.tripsId, securityCode.join('')).then((result: any) => {
        openSnackBar('OTP Verified You can start ride');
        handleClose();
        setRide('End Ride');
      }).catch((error) => {
        openSnackBar(error?.response?.data?.msg);
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="security-code-modal"
      aria-describedby="enter-6-digit-security-code"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: 500,
          width: '100%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          color: 'black',
          borderRadius: 2,
        }}
      >
        <Typography id="security-code-modal" variant="h6">
          Enter 6-Digit Security Code
        </Typography>

        <Grid container spacing={2} justifyContent="center" sx={{ mt: 2, mb: 2 }}>
          {securityCode.map((digit, index) => (
            <Grid item key={index}>
              <TextField
                inputProps={{
                  maxLength: 1,
                  style: { textAlign: 'center', fontSize: '14px', width: '1rem', height: '1rem' },
                }}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                inputRef={(el) => (inputRefs.current[index] = el)}
              />
            </Grid>
          ))}
        </Grid>

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={securityCode.join('').length !== 6}
          style={{
            background: '#0a5d6b', borderRadius: '42px', marginTop: '20px',
            padding: '10px', textTransform: 'none', fontWeight: 'bold'
          }}
        >
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default SecurityCodeModal;
