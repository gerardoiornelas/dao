import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, TextField } from "@mui/material";
import { ethers } from "ethers";
import { useForm } from "react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";

import { RowCol, Row, Col } from "../RowCol";

const CreateProposal = ({ provider, dao, setIsLoading }) => {
  const { register, handleSubmit } = useForm();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  const onSubmit = async () => {
    setIsWaiting(true);
    try {
      const signer = await provider.getSigner();
      const formattedAmount = ethers.utils.parseUnits(
        amount.toString(),
        "ether"
      );

      const transaction = await dao
        .connect(signer)
        .createProposal(name, formattedAmount, address);
      await transaction.wait();
    } catch {
      window.alert("User rejected or transaction reverted");
    }
    setIsLoading(true);
  };

  return (
    <RowCol>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <RowCol mb={2}>
          <TextField
            fullWidth
            name="name"
            {...register("name")}
            placeholder="Proposal Name"
            onChange={(e) => setName(e.target.value)}
          />
        </RowCol>
        <RowCol mb={2}>
          <TextField
            fullWidth
            name="amount"
            {...register("amount")}
            placeholder="Amount"
            onChange={(e) => setAmount(e.target.value)}
          />
        </RowCol>
        <RowCol mb={2}>
          <TextField
            fullWidth
            name="address"
            {...register("address")}
            placeholder="Address"
            onChange={(e) => setAddress(e.target.value)}
          />
        </RowCol>
        <RowCol>
          <Row>
            <Col xs={6}></Col>
            <Col xs={6}>
              <Box display="flex" justifyContent="flex-end">
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isWaiting}
                >
                  Create Proposal
                </LoadingButton>
              </Box>
            </Col>
          </Row>
        </RowCol>
      </Box>
    </RowCol>
  );
};

CreateProposal.propTypes = {
  children: PropTypes.node,
};

export default CreateProposal;
