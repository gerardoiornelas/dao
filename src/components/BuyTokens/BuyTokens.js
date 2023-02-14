import React, { useState } from "react";
import { Box, Grid, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { ethers } from "ethers";

const BuyTokens = ({ provider, price, crowdsale, setisLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isWaiting, setIsWaiting] = useState(false);

  const buyTokensHandler = async ({ amount }) => {
    setIsWaiting(true);
    console.log("Buying tokens...");
    try {
      // Get signer - user of contract
      const signer = await provider.getSigner();

      const value = ethers.utils.parseUnits(
        (amount * price).toString(),
        "ether"
      );
      const formattedAmount = ethers.utils.parseUnits(
        amount.toString(),
        "ether"
      );

      const transaction = await crowdsale
        .connect(signer)
        .buyTokens(formattedAmount, { value: value });

      await transaction.wait();
      setIsWaiting(false);
      window.location.reload(true);
    } catch {
      window.alert("User rejected or transaction reverted");
    }
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={2}></Grid>
          <Grid item xs={8}>
            <Box component="form" onSubmit={handleSubmit(buyTokensHandler)}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <TextField
                    id="amount"
                    name="amou"
                    label="Enter Amount"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="number"
                    {...register("amount", { required: true })}
                  />
                  {errors.amount && <span>This field is required</span>}
                </Grid>
                <Grid item xs={12} md={4}>
                  <LoadingButton
                    loading={isWaiting}
                    type="submit"
                    variant="contained"
                    fullWidth
                  >
                    Buy Tokens
                  </LoadingButton>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BuyTokens;
