const host = "http://localhost:8545";
const Web3 = require('web3');
const web3 = new Web3(host);
const path = require('path');
const fs = require('fs-extra');



const contractJsonPath = path.resolve(__dirname, '../','contracts','SimpleStorage.json');
console.log('contract :',contractJsonPath );
const contractJson = JSON.parse(fs.readFileSync(contractJsonPath));
console.log('contenuto Contract: ',contractJson);
const contractAbi = contractJson.abi;
console.log('Abi contenuto: ',contractAbi);
const contractBytecode = contractJson.bytecode;
console.log('BIN contenuto: ',contractBytecode);




async function createContract(host){

const privateKey = "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
console.log('account: ',account);

const contractConstructorInit= web3.eth.abi.encodeParameter('uint256', '47').slice('2');
console.log('init: ',contractConstructorInit);

const txn = {
  chainId: 1337,
  nonce: await web3.eth.getTransactionCount(account.address),
  from: account.address,
  to: null,            
  value: "0x00",
  data: '0x'+contractBytecode+contractConstructorInit,
  gasPrice: "0x0",     //ETH per unit of gas
  gas: "0x2CA51" 
};


const signedTx = await web3.eth.accounts.signTransaction(txn, account.privateKey);

const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

return txReceipt;


};










async function getValueAtAddress(host, deployedContractAbi, deployedContractAddress){
  const web3 = new Web3(host);
//const web3 = new Web3(provider);
const contractInstance = new web3.eth.Contract(deployedContractAbi, deployedContractAddress);
  const res = await contractInstance.methods.get().call();
  console.log("Obtained value at deployed contract is: "+ res);
  return res
}


async function setValueAtAddress(host, accountAddress, value, deployedContractAbi, deployedContractAddress){
  const web3 = new Web3(host);
const privateKey = "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  const contract = new web3.eth.Contract(deployedContractAbi);
  const functionAbi = contract._jsonInterface.find(e => {
    return e.name === "set";
  });
  const functionArgs = web3.eth.abi
    .encodeParameters(functionAbi.inputs, [value])
    .slice(2);
  const functionParams = {
    to: deployedContractAddress,
    data: functionAbi.signature + functionArgs,
    gas: "0x2CA51"  //max number of gas units the tx is allowed to use
  };
  const signedTx = await web3.eth.accounts.signTransaction(functionParams, account.privateKey);
  console.log("sending the txn")
  const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log("tx transactionHash: " + txReceipt.transactionHash);
  console.log("tx contractAddress: " + txReceipt.contractAddress);
  return txReceipt
}



async function getAllPastEvents(host, deployedContractAbi, deployedContractAddress){
  const web3 = new Web3(host);
const contractInstance = new web3.eth.Contract(deployedContractAbi, deployedContractAddress);
  const res = await contractInstance.getPastEvents("allEvents", {
    fromBlock: 0,
    toBlock: 'latest'
  })
  const amounts = res.map(x => {
    return x.returnValues._amount
  });
  console.log("Obtained all value events from deployed contract : [" + amounts + "]");
  return res
}



async function main(){
  createContract(host)
 .then(async function(txReceipt){
const privateKey = "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  console.log('contract deployed at address: ' +txReceipt.contractAddress);
  console.log("Use the smart contracts 'get' function to read the contract's constructor initialized value .. " )
  await getValueAtAddress(host, contractAbi, txReceipt.contractAddress);
  console.log("Use the smart contracts 'set' function to update that value to 123 .. " );
  await setValueAtAddress(host, account.address,'32', contractAbi, txReceipt.contractAddress );
  console.log("Verify the updated value that was set .. " )
  await getValueAtAddress(host, contractAbi, txReceipt.contractAddress);
  await getAllPastEvents(host, contractAbi, txReceipt.contractAddress);


})
.catch(console.error);
}

main()