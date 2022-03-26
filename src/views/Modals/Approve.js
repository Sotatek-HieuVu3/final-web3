import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Row, Col, Container, Button, Modal, Input } from "reactstrap";
import Web3 from "web3";
import WETH from "../../abis/WETH.json";
import Noti from "./Noti";

function Approve(props) {
  const {
    displayApproveModal,
    toggleDisplayApproveModal,
    balance,
    setApproval,
  } = props;
  const { account, chainId, connector, activate, library } = useWeb3React();
  const WETH_CONTRACT_ADDRESS = "0xc778417e063141139fce010982780140aa0cd5ab";
  const MASTERCHEF_CONTRACT_ADDRESS =
    "0x9da687e88b0A807e57f1913bCD31D56c49C872c2";

  const [approveWETH, setApproveWETH] = useState(0);

  const writeApprove = async () => {
    if (parseFloat(balance) < approveWETH) {
      setMessage("Not enough WETH");
      setDisplayNotiModal(true);
    }
    const web3 = new Web3(library.provider);
    const wethContract = new web3.eth.Contract(WETH, WETH_CONTRACT_ADDRESS);
    wethContract.methods
      .approve(MASTERCHEF_CONTRACT_ADDRESS, web3.utils.toWei(approveWETH))
      .send({ from: account })
      .on("transactionHash", function () {
        setMessage("Đợi tý đợi tý");
        setDisplayNotiModal(true);
      })
      .on("receipt", function (receipt) {
        setDisplayNotiModal(false);
        // receipt example
        console.log("DUOC ROI DUOC ROi");
        setApproval(true);
        console.log(receipt);
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
        isOpen={displayApproveModal}
        toggle={toggleDisplayApproveModal}
      >
        <Container className="modal-wrapper">
          <h6>Give permission to MasterChef to use your WETH</h6>

          <Input
            placeholder="Number of WETH"
            type="number"
            onChange={(event) => {
              setApproveWETH(event.target.value);
            }}
          />
          <p>Your balance: {balance} WETH</p>
          <div style={{ textAlign: "center", marginTop: "1em" }}>
            <Button
              onClick={() => {
                writeApprove();
              }}
            >
              Approve
            </Button>
          </div>
        </Container>
      </Modal>
    </>
  );
}

export default Approve;
