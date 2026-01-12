import React, { useState } from "react";
import { Box, TextField, IconButton, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const MathCaptcha = ({ onValidate }) => {
  const [num1, setNum1] = useState(generateRandomNumber());
  const [num2, setNum2] = useState(generateRandomNumber());
  const [userInput, setUserInput] = useState("");
  
  function generateRandomNumber() {
    return Math.floor(Math.random() * 10) + 1; // Random number between 1-10
  }

  const refreshCaptcha = () => {
    setNum1(generateRandomNumber());
    setNum2(generateRandomNumber());
    setUserInput("");
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    if (parseInt(e.target.value) === num1 + num2) {
      onValidate(true); // If correct, allow login
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={1} sx={{ mt: 1 ,justifyContent:'center'}}>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#007185"}}>
        {num1} + {num2} =
      </Typography>
      <TextField
        variant="outlined"
        size="small"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Enter Answer"
        sx={{ width: "37%" }}
      />
      <IconButton onClick={refreshCaptcha} color="primary">
        <RefreshIcon />
      </IconButton>
    </Box>
  );
};

export default MathCaptcha;
