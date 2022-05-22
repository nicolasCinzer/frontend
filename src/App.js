import React, { Component } from "react";
import EscribirEnLaBlockchainContract from "./contracts/EscribirEnLaBlockchain.json";
import getWeb3 from "./getWeb3"; 

import "./App.css";

class App extends Component {
  state = {
    currentValue: '',
    newValue: '',
    web3: null, 
    accounts: null, 
    contract: null 
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = EscribirEnLaBlockchainContract.networks[networkId];
      const instance = new web3.eth.Contract(
        EscribirEnLaBlockchainContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
      
      const response = await this.state.contract.methods.Leer().call();

      this.setState({
        currentValue: response
      })
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error); 
    }
  };

  storeValue = async (event) => {
    event.preventDefault();

    const { accounts, contract } = this.state;
    
    try{  
      await contract.methods.Escribir(this.state.newValue).send({ from: accounts[0] });
  
      const response = await this.state.contract.methods.Leer().call();

      this.setState({
        currentValue: response
      })
    } catch (err) {
      alert(err);
      console.error(err);
    }
    
  };

  handleChangeValue = (event) => {
    this.setState({
      newValue: event.target.value
    })
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Escribir en la Blockchain</h1>
        <label>El valor actual de la blockchain es: {this.state.currentValue}</label>
        <br/> 
        <form onSubmit={this.storeValue}> 
          <label>Nuevo valor a almacenar dentro de Blockchain es:</label>
          <br/>
          <input type="text" value = {this.state.newValue} onChange={this.handleChangeValue}/>
          <br/>
          <input type="submit" value="Almacenar Valor"/>
        </form>
      </div>
    );
  }
}

export default App;
