import React, { useEffect, useState } from "react"
import _ from "lodash"
import { ethers } from "ethers"
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Divider,
} from "@mui/material"

import { UIShell } from "../UIShell"
import { Info } from "../Info"
import { TokensSoldProgress } from "../TokensSoldProgress"
import { BuyTokens } from "../BuyTokens"

import {
  loadAccount,
  loadProvider,
  loadNetwork,
  loadNft,
} from "../../store/interactions/blockchainProvider.interactions"

import nftAbi from "../../abis/NFT.json"
import { goerli, hardhat } from "../../networkConfig"

import { StyledHome } from "./Home.styled"

interface Props {
  children: React.ReactNode
}

const Home = ({ children }: Props) => {
  const networkConfig = process.env.NODE_ENV === "production" ? goerli : hardhat
  const [balance, setBalance] = useState(0)
  const [network, setNetwork] = useState(null)
  // const [provider, setProvider] = useState(null)

  const [price, setPrice] = useState(0)
  const [maxTokens, setMaxTokens] = useState(0)
  const [tokensSold, setTokensSold] = useState(0)

  const [isLoading, setIsLoading] = useState(true)

  const network = process.env.NODE_ENV === "production" ? goerli : hardhat

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const chainId = await loadNetwork(provider, dispatch)

    // account
    const account = await loadAccount(dispatch)

    //load nft
    await loadNft(networkConfig.nft.address, nftAbi, provider, dispatch)
  }

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
    }
  }, [isLoading])

  return (
    <UIShell>
      <Container>
        <Box>
          <Container>
            <Box my={4}>
              <Typography variant="h3" align="center">
                Introducing GIO Token!
              </Typography>
            </Box>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Box
                display="flex"
                justifyContent="center"
                flexDirection="column"
              >
                <Box display="flex" justifyContent={`center`}>
                  <Typography>
                    <strong>Current Price: </strong>
                    {` ${price} ETH`}
                  </Typography>
                </Box>
                <Box my={4}>
                  <BuyTokens
                    provider={provider}
                    price={price}
                    crowdsale={crowdsale}
                    loadBlockchainData={loadBlockchainData}
                  />
                </Box>
                <TokensSoldProgress
                  tokensSold={tokensSold}
                  maxTokens={maxTokens}
                />
              </Box>
            )}

            <Box my={2}>
              <Divider />
            </Box>
            <Box>
              {account && (
                <Info account={account} accountBalance={accountBalance} />
              )}
            </Box>
          </Container>
        </Box>
      </Container>
    </UIShell>
  )
}

export default Home
