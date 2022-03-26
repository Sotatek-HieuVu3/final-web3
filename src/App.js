import "./App.css";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { useEffect, useState } from "react";
import ERC20 from "./ERC20.json";

import Connected from "./views/Connected";
import {
  Row,
  Col,
  Container,
  Button,
  Table,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import History from "./views/History";

const WALLETCONNECT_BRIDGE_URL = "https://bridge.walletconnect.org";
const INFURA_KEY = "f92ceb38c73b4b74a3eaa72cccea4ef0";
const WETH_CONTRACT_ADDRESS = "0xc778417e063141139fce010982780140aa0cd5ab";
const NETWORK_URLS = {
  1: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  4: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
  5: `https://goerli.infura.io/v3/${INFURA_KEY}`,
};

const injected = new InjectedConnector({
  supportedChainIds: [1, 4, 5],
});

const walletConnectConnector = new WalletConnectConnector({
  supportedChainIds: [1, 4, 5],
  rpc: NETWORK_URLS,
  bridge: WALLETCONNECT_BRIDGE_URL,
  qrcode: true,
});

function App() {
  const { account, chainId, connector, activate, library } = useWeb3React();

  const [balance, setBlance] = useState(0);

  const connectInjectedConnector = () => {
    activate(injected);
  };

  const connectWalletConnectConnector = () => {
    activate(walletConnectConnector, undefined, true).catch((err) =>
      console.log("ERROR: ", err)
    );
  };

  // const getBalance = async () => {
  //   const web3 = new Web3(library.provider);
  //   const wethContract = new web3.eth.Contract(ERC20, WETH_CONTRACT_ADDRESS);
  //   const balanceAccount = await wethContract.methods.balanceOf(account).call();
  //   setBlance(web3.utils.fromWei(balanceAccount));
  // };

  useEffect(() => {
    if (account) {
      // getBalance();
    }
  }, [account]);
  return (
    <>
      <div>
        <Row>
          <Col style={{ textAlign: "center", marginTop: "2em" }}>
            {account ? (
              <>
                <Connected account={account} library={library} />
              </>
            ) : (
              <>
                {" "}
                <Button
                  onClick={() => {
                    connectInjectedConnector();
                  }}
                >
                  Connect Metamask Extensions
                </Button>
                <br />
                <Button
                  style={{ marginTop: "3rem" }}
                  onClick={() => connectWalletConnectConnector()}
                >
                  Connect WalletConnect
                </Button>
              </>
            )}
          </Col>
          <Col>
            <History />
          </Col>
        </Row>
      </div>
    </>
  );
}

export default App;
