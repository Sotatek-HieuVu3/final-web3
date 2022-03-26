import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Row, Col, Container, Button, Modal, Input } from "reactstrap";
import Web3 from "web3";
import WETH from "../../abis/WETH.json";
import Noti from "./Noti";
import MasterChef from "../../abis/MasterChef.json";

function Withdraw(props) {
  const { displayWithdrawModal, toggleDisplayWithdrawModal, userStaked } =
    props;
  const { account, chainId, connector, activate, library } = useWeb3React();
  const WETH_CONTRACT_ADDRESS = "0xc778417e063141139fce010982780140aa0cd5ab";
  const MASTERCHEF_CONTRACT_ADDRESS =
    "0x9da687e88b0A807e57f1913bCD31D56c49C872c2";

  const [withdrawWETH, setWithdrawWeth] = useState(0);

  const writeWithdraw = async () => {
    if (parseFloat(userStaked) < withdrawWETH) {
      setMessage("Not enough WETH");
      setDisplayNotiModal(true);
    }
    const web3 = new Web3(library.provider);
    const masterChefContract = new web3.eth.Contract(
      MasterChef,
      MASTERCHEF_CONTRACT_ADDRESS
    );
    masterChefContract.methods
      .withdraw(web3.utils.toWei(withdrawWETH))
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

  //modal
  const [displayNotiModal, setDisplayNotiModal] = useState(false);
  const [message, setMessage] = useState();
  const toggleDisplayNotiModal = () => {
    setDisplayNotiModal(!displayNotiModal);
  };

  return (
    <>
      <Noti
        displayNotiModal={displayNotiModal}
        toggleDisplayNotiModal={toggleDisplayNotiModal}
        message={message}
      />
      <Modal
        centered={true}
        size="lg"
        isOpen={displayWithdrawModal}
        toggle={toggleDisplayWithdrawModal}
      >
        {" "}
        <Container className="modal-wrapper">
          <h6>Withdraw</h6>
          <Input
            placeholder="Enter your amount"
            type="number"
            onChange={(event) => {
              setWithdrawWeth(event.target.value);
            }}
          />
          <p>Your WETH deposited: {userStaked} WETH</p>
          <div style={{ textAlign: "center", marginTop: "1em" }}>
            <Button
              onClick={() => {
                writeWithdraw();
              }}
            >
              Withdraw
            </Button>
          </div>
        </Container>
      </Modal>
    </>
  );
}

export default Withdraw;
