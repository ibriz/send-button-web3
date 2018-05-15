import React, { Component } from 'react'
import TokenAbi from '../build/contracts/XCEL_ABI'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      tokenAddress: '0x01b08a9447c26aCa967C2e8A55Cd66Fcd6258905'
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3,
        toAddress: null,
        amount: null,
        transactionHash: null
      })

    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  sendAmount() {

      // Get accounts.
      this.state.web3.eth.getAccounts((error, accounts) => {
        let Contract = this.state.web3.eth.contract(TokenAbi);
        let ContractInstance = Contract.at(this.state.tokenAddress);

        console.log(Contract);
        console.log(ContractInstance);

        ContractInstance.transfer(this.state.toAddress, window.web3.toWei(this.state.amount), {
          from: accounts[0]
        }, (err, result) => {
          if (err) {
            console.log('err', err);
          } else {
            console.log(result);
            this.setState({
              transactionHash: result
            })
          }
        });
      })

  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Send Token</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <p>Insert the To address</p>
              <input onChange={(e) => {
                  this.setState({
                    toAddress: e.target.value
                  });
                }}
              />
              <p>Enter the amount</p>
                <input onChange={(e) => {
                    this.setState({
                      amount: e.target.value
                    });
                  }}
                />
              <br />
              <br />
            <button onClick={() => {
                this.sendAmount();
              }}>
            Send
            </button>

            <br />
            {this.state.transactionHash ? (
              <p>Transaction Hash: {this.state.transactionHash}</p>
            ) : null}
          </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
