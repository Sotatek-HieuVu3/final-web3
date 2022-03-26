import { useState, useEffect } from "react";
import { Row, Col, Container, Button, Modal, Input } from "reactstrap";

function Noti(props) {
  const { displayNotiModal, toggleDisplayNotiModal, message } = props;

  return (
    <Modal
      centered={true}
      size="lg"
      isOpen={displayNotiModal}
      toggle={toggleDisplayNotiModal}
    >
      <Container className="modal-wrapper">
        <h6>{message}</h6>
      </Container>
    </Modal>
  );
}

export default Noti;
