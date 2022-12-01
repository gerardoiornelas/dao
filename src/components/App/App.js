import { useEffect, useState } from "react";
import { Box, Typography, Container } from "@mui/material";
import { ethers } from "ethers";

// Components
import { RowCol, Row, Col } from "../RowCol";
import { Navigation } from "../Navigation";
import { Loading } from "../Loading";
import { CreateProposal } from "../CreateProposal";
import { Proposals } from "../Proposals";

// ABIs: Import your contract ABIs here
import DAO_ABI from "../../abis/DAO.json";

// Config: Import your network config here
import config from "../../config.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [dao, setDao] = useState(0);
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const [proposals, setProposals] = useState(null);
  const [quorum, setQuorum] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    // Initiate Contract
    const dao = new ethers.Contract(
      config[31337].dao.address,
      DAO_ABI,
      provider
    );
    setDao(dao);

    // Fetch treasurey balance
    let treasuryBalance = await provider.getBalance(dao.address);
    treasuryBalance = ethers.utils.formatUnits(treasuryBalance, 18);
    setTreasuryBalance(treasuryBalance);

    // Fetch accounts
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);

    //Get proposal count
    const proposalCount = await dao.proposalCount();
    const proposalItems = [];

    for (let i = 0; i < proposalCount; i++) {
      // Fetch Proposals
      const proposal = await dao.proposals(i + 1);
      proposalItems.push(proposal);
    }
    setProposals(proposalItems);

    // Fetch Quorum
    const quorum = await dao.quorum();
    setQuorum(quorum);

    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData();
    }
  }, [isLoading]);

  return (
    <RowCol>
      <Navigation account={account} />

      <RowCol>
        <Container maxWidth="xl">
          <RowCol>
            <Typography variant="h3" align="center">
              Welcome to our DAO
            </Typography>
          </RowCol>
          {isLoading ? (
            <Box display="flex" justifyContent={`center`}>
              <Loading />
            </Box>
          ) : (
            <RowCol>
              <RowCol mb={4}>
                <Typography
                  align="center"
                  sx={{ fontWeight: "strong" }}
                >{`Treasury Balance: ${treasuryBalance} ETH`}</Typography>
              </RowCol>
              <RowCol mb={4}>
                <Typography
                  align="center"
                  sx={{ fontWeight: "strong" }}
                >{`Quorum: ${quorum}`}</Typography>
              </RowCol>
              <Row
                mb={4}
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Col xs={12} md={8}>
                  <CreateProposal
                    provider={provider}
                    dao={dao}
                    setIsLoading={setIsLoading}
                  />
                </Col>
              </Row>
              <RowCol>
                <Proposals
                  provider={provider}
                  dao={dao}
                  proposals={proposals}
                  quorum={quorum}
                  setIsLoading={setIsLoading}
                />
              </RowCol>
            </RowCol>
          )}
        </Container>
      </RowCol>
    </RowCol>
  );
}

export default App;
