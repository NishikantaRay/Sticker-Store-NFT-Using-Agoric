import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';

const BoughtCardSnackbar = ({ open, onClose }) => {
  return (
    <Snackbar
      open={open}
      message="You just bought a sticker! Check your Sticker purse in
    your wallet to see the sticker you own."
      autoHideDuration={5000}
      onClose={onClose}
    />
  );
};

export default BoughtCardSnackbar;
