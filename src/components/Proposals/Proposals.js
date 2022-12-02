import React from "react";
import cuid from "cuid";
import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import { ethers } from "ethers";

const Proposals = ({ provider, dao, proposals, quorum, setIsLoading }) => {
  const handleOnClickVote = async (_id) => {
    try {
      const signer = await provider.getSigner();
      const transaction = await dao.connect(signer).vote(_id);
      await transaction.wait();
      setIsLoading(true);
    } catch {
      window.alert("User rejected or transaction reverted");
    }
  };

  const handleOnClickFinalize = async (_id) => {
    try {
      const signer = await provider.getSigner();
      const transaction = await dao.connect(signer).finalizeProposal(_id);
      await transaction.wait();
      setIsLoading(true);
    } catch {
      window.alert("User rejected or transaction reverted");
    }
  };

  const hasVoted = async (_id) => {
    const signer = await provider.getSigner();
    return await dao.connect(signer).hasVoted(_id);
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Proposal Name</TableCell>
            <TableCell>Recipient Address</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Total Votes</TableCell>
            <TableCell>Cast Vote</TableCell>
            <TableCell>Finalize</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {proposals.map(
            ({ id, name, recipient, amount, finalized, votes }, index) => {
              let hasAddressVoted = hasVoted(id).then((result) => result);
              return (
                <TableRow
                  key={cuid()}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="right">{id.toString()}</TableCell>
                  <TableCell align="right">{name}</TableCell>
                  <TableCell align="right">{recipient}</TableCell>
                  <TableCell align="right">{`${ethers.utils.formatUnits(
                    amount,
                    "ether"
                  )} ETH`}</TableCell>
                  <TableCell align="right">
                    {finalized ? "Approved" : "In Progress"}
                  </TableCell>
                  <TableCell align="right">{votes.toString()}</TableCell>
                  <TableCell align="right">
                    {!finalized && !hasAddressVoted && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleOnClickVote(id)}
                      >
                        Vote
                      </Button>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {!finalized && votes > quorum && (
                      <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={() => handleOnClickFinalize(id)}
                      >
                        Finalize
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            }
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

Proposals.propTypes = {
  children: PropTypes.node,
};

export default Proposals;
