import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import ERC20 from "../ERC20.json";
import { Multicall } from "ethereum-multicall";
import WETH from "../abis/WETH.json";
import MasterChef from "../abis/MasterChef.json";

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
import Approve from "./Modals/Approve";
import Withdraw from "./Modals/Withdraw";
import Stake from "./Modals/Stake";
import Noti from "./Modals/Noti";

function Connected(props) {
  const { account, chainId, connector, activate, library } = useWeb3React();
  const WETH_CONTRACT_ADDRESS = "0xc778417e063141139fce010982780140aa0cd5ab";
  const MASTERCHEF_CONTRACT_ADDRESS =
    "0x9da687e88b0A807e57f1913bCD31D56c49C872c2";

  const contractCallContext = [
    {
      reference: "userBalance",
      contractAddress: WETH_CONTRACT_ADDRESS,
      abi: WETH,
      calls: [
        {
          reference: "balance",
          methodName: "balanceOf",
          methodParameters: [account],
        },
        {
          reference: "stakedWETH",
          methodName: "balanceOf",
          methodParameters: [MASTERCHEF_CONTRACT_ADDRESS],
        },
      ],
    },
    {
      reference: "userStaked",
      contractAddress: MASTERCHEF_CONTRACT_ADDRESS,
      abi: MasterChef,
      calls: [
        {
          reference: "totalStaked",
          methodName: "userInfo",
          methodParameters: [account],
        },
        {
          reference: "rewardDD2",
          methodName: "pendingDD2",
          methodParameters: [account],
        },
      ],
    },
  ];

  const [balance, setBalance] = useState(0);
  const [userEarned, setUserEarned] = useState(0);
  const [userStaked, setUserStaked] = useState(0);
  const [approval, setApproval] = useState(true);
  const [stakedWETH, setStakedWETH] = useState(0);

  //modal
  const [displayApproveModal, setDisplayApproveModal] = useState(false);

  const toggleDisplayApproveModal = () => {
    setDisplayApproveModal(!displayApproveModal);
  };

  const [displayWithdrawModal, setDisplayWithdrawModal] = useState(false);
  const toggleDisplayWithdrawModal = () => {
    setDisplayWithdrawModal(!displayWithdrawModal);
  };

  const [displayStakeModal, setDisplayStakeModal] = useState(false);
  const toggleDisplayStakeModal = () => {
    setDisplayStakeModal(!displayStakeModal);
  };

  const [displayNotiModal, setDisplayNotiModal] = useState(false);
  const [message, setMessage] = useState();
  const toggleDisplayNotiModal = () => {
    setDisplayNotiModal(!displayNotiModal);
  };

  //   const getBalance = async () => {
  //     const web3 = new Web3(library.provider);
  //     const multicall = new Multicall({ web3Instance: web3, tryAggregate: true });
  //     const wethContract = new web3.eth.Contract(ERC20, WETH_CONTRACT_ADDRESS);
  //     const balanceAccount = await wethContract.methods.balanceOf(account).call();

  //     setBlance(web3.utils.fromWei(balanceAccount));
  //   };

  const getDataMulticall = async () => {
    const web3 = new Web3(library.provider);
    const multicall = new Multicall({ web3Instance: web3, tryAggregate: true });
    const result = await multicall.call(contractCallContext);
    console.log(result);
    setBalance(
      web3.utils.fromWei(
        web3.utils.hexToNumberString(
          result.results.userBalance.callsReturnContext[0].returnValues[0].hex
        )
      )
    );
    setUserEarned(
      web3.utils.fromWei(
        web3.utils.hexToNumberString(
          result.results.userStaked.callsReturnContext[1].returnValues[0].hex
        )
      )
    );
    setUserStaked(
      web3.utils.fromWei(
        web3.utils.hexToNumberString(
          result.results.userStaked.callsReturnContext[0].returnValues[0].hex
        )
      )
    );
    setStakedWETH(
      web3.utils.fromWei(
        web3.utils.hexToNumberString(
          result.results.userBalance.callsReturnContext[1].returnValues[0].hex
        )
      )
    );
  };

  const writeHarvest = async () => {
    const web3 = new Web3(library.provider);
    const masterChefContract = new web3.eth.Contract(
      MasterChef,
      MASTERCHEF_CONTRACT_ADDRESS
    );
    masterChefContract.methods
      .deposit(web3.utils.toWei("0"))
      .send({ from: account })
      .on("transactionHash", function () {
        setMessage("Đợi tý đợi tý");
        setDisplayNotiModal(true);
      })
      .on("receipt", function (receipt) {
        // receipt example
        setDisplayNotiModal(false);

        console.log("DUOC ROI DUOC ROi");
        console.log(receipt);
        setMessage("Được rồi được rồi");
        setDisplayNotiModal(true);
      })
      .on("error", function (error, receipt) {
        console.log("LOI ROI LOI ROI");
        console.log(error);
      });
  };

  useEffect(() => {}, []);

  useEffect(() => {
    if (account) {
      //   getBalance();
      getDataMulticall();
    }
  }, [account]);
  return (
    <>
      <Noti
        displayNotiModal={displayNotiModal}
        toggleDisplayNotiModal={toggleDisplayNotiModal}
        message={message}
      />
      <Approve
        balance={balance}
        displayApproveModal={displayApproveModal}
        toggleDisplayApproveModal={toggleDisplayApproveModal}
        setApproval={setApproval}
      />
      <Withdraw
        userStaked={userStaked}
        displayWithdrawModal={displayWithdrawModal}
        toggleDisplayWithdrawModal={toggleDisplayWithdrawModal}
      />
      <Stake
        balance={balance}
        displayStakeModal={displayStakeModal}
        toggleDisplayStakeModal={toggleDisplayStakeModal}
      />
      <Container>
        Connected
        <Row>
          <Col className="col-md-6">
            <h6>Account: {account}</h6>
          </Col>
          <Col className="col-md-6">
            <h6>WETH Balance: {balance}</h6>
          </Col>
        </Row>
        <Row style={{ marginTop: "2em" }}>
          <Col className="col-md-6">
            <h6>DD2 Earned: {userEarned}</h6>
          </Col>
          <Col className="col-md-6">
            <Button
              onClick={() => {
                writeHarvest();
              }}
            >
              Harvest
            </Button>
          </Col>
        </Row>
        <Row style={{ justifyContent: "center", marginTop: "2em" }}>
          {approval ? (
            <>
              <Col col={6}>
                {" "}
                <Button
                  onClick={() => {
                    toggleDisplayStakeModal();
                  }}
                  className="btn"
                  style={{ maxWidth: "100px" }}
                >
                  Stake
                </Button>
              </Col>
              <Col col={6}>
                {" "}
                <Button
                  onClick={() => {
                    toggleDisplayWithdrawModal();
                  }}
                  className="btn"
                  style={{ maxWidth: "100px" }}
                >
                  Withdraw
                </Button>
              </Col>
            </>
          ) : (
            <Button
              onClick={() => {
                toggleDisplayApproveModal();
              }}
              className="btn"
              style={{ maxWidth: "100px" }}
            >
              Approve
            </Button>
          )}
        </Row>
        <Row style={{ textAlign: "left", marginTop: "2em" }}>
          <h6>Your stake: {userStaked} WETH</h6>
          <h6>Total staked: {stakedWETH} WETH</h6>
        </Row>
      </Container>
    </>
  );
}

export default Connected;
