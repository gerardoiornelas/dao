import { useEffect, useState } from "react";
import { Grid, Box, Typography, Container } from "@mui/material";
import { ethers } from "ethers";

// Components
import { Navigation } from "../Navigation";
import { Loading } from "../Loading";

// ABIs: Import your contract ABIs here
import DAO_ABI from "../../abis/DAO.json";

// Config: Import your network config here
import config from "../../config.json";

function App() {
  const [account, setAccount] = useState(null);
  const [dao, setDao] = useState(0);
  const [treasuryBalance, setTreasuryBalance] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Initiate Contract
    const dao = new ethers.Contract(
      config[31337].dao.address,
      DAO_ABI,
      provider
    );
    setDao(dao);

    // fetch treasurey balance
    let treasuryBalance = await provider.getBalance(dao.address);
    treasuryBalance = ethers.utils.formatUnits(treasuryBalance, 18);
    setTreasuryBalance(treasuryBalance);
    // Fetch accounts
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);

    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData();
    }
  }, [isLoading]);

  return (
    <Box>
      <Navigation account={account} />

      <Container>
        <Typography variant="h3" align="center">
          Welcome to our DAO
        </Typography>
        {isLoading ? <Loading /> : <></>}
      </Container>
    </Box>
  );
}

export default App;
