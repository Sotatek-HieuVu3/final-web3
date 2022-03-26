import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import moment from "moment";

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
import { type } from "@testing-library/user-event/dist/type";

function History(props) {
  const { account, chainId, connector, activate, library } = useWeb3React();
  const [histories, setHistories] = useState();

  const API_URL =
    "https://api.thegraph.com/subgraphs/name/sotatek-hieuvu3/master-chef-subgraph";

  const queryHistory = async () => {
    const client = new ApolloClient({
      uri: API_URL,
      cache: new InMemoryCache(),
    });
    const masterChefQuery = `
      query($account: Bytes) {
          masterChefEntities(first: 5, orderBy: date, orderDirection: desc, where: {user: $account} ) {
            id
            method
            user
            amount
            date
          }
        }
      `;
    client
      .query({
        query: gql(masterChefQuery),
        variables: {
          account: account,
        },
      })
      .then((data) => {
        setHistories(data.data.masterChefEntities);
        console.log(
          moment(
            parseFloat(data.data.masterChefEntities[0].date) * 1000
          ).format(" HH:mm:ss   DD-MM-YYYY", true)
        );
        console.log(data.data.masterChefEntities);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (account) {
      queryHistory();
    }
  }, [account]);
  return (
    <>
      Lịch sử 5 giao dịch gần nhất
      <Table>
        <thead></thead>
        <tbody>
          {histories ? (
            histories.map((element) => (
              <tr>
                <td>{element.method}</td>
                <td>{Web3.utils.fromWei(element.amount)}</td>
                <td>
                  {moment(parseFloat(element.date) * 1000).format(
                    " HH:mm:ss   DD-MM-YYYY",
                    true
                  )}
                </td>
              </tr>
            ))
          ) : (
            <></>
          )}
        </tbody>
      </Table>
    </>
  );
}

export default History;
