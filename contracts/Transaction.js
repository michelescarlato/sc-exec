const host = "http://localhost:8545";
const Web3 = require('web3');
const web3 = new Web3(host);
const path = require('path');
const fs = require('fs-extra');

const privateKey = "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
const account = web3.eth.accounts.privateKeyToAccount(privateKey);

const contractJsonPath = path.resolve(__dirname, '../','contracts','SimpleStorage.json');
const contractJson = JSON.parse(fs.readFileSync(contractJsonPath));
const contractAbi = contractJson.abi;
const contractBytecode = contractJson.bytecode;



async function getValueAtAddress(host, deployedContractAbi, deployedContractAddress){
  const web3 = new Web3(host);
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
console.log('contratto: ',contract);

  const functionAbi = contract._jsonInterface.find(e => {
    return e.name === "set";
  });
console.log('functionABI: ',functionAbi);
  const functionArgs = web3.eth.abi
    .encodeParameters(functionAbi.inputs, [value])
    .slice(2);
  console.log('functionArgs: ',functionArgs);
  const functionParams = {
        from: web3.eth.accountAddress,
    to:deployedContractAddress,
    data: functionAbi.signature + functionArgs,
    gas: "0x2CA51",  //max number of gas units the tx is allowed to use
  chainId: '1337'
};
console.log("functionParams: ",functionParams);
  const signedTx = await web3.eth.accounts.signTransaction(functionParams, account.privateKey);
  console.log('signedTx: ',signedTx);
console.log("sending the txn")
  const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  return txReceipt
}


async function getAllPastEvents(host, deployedContractAbi, deployedContractAddress){
  const web3 = new Web3(host);
  const contractInstance = new web3.eth.Contract(deployedContractAbi, deployedContractAddress);
  const res = await contractInstance.getPastEvents("allEvents", {
    fromBlock: 0,
    toBlock: 'latest'
  })
  console.log("test_stampa: ",res);

  const amounts = res.map(x => {
    console.log("test_write: ", amounts);
    return x.returnValues._amount
  });
  console.log("test_uscita");
  return res
}

async function getContractAddress(filename){
  // get filesystem module
  const fs = require("fs");
  // using the readFileSync() function
  // and passing the path to the file
  const buffer = fs.readFileSync(filename);
  // use the toString() method to convert
  // Buffer into String
  const fileContent = buffer.toString();
  console.log(fileContent);
  return fileContent
}

async function main(){
  contractDeployedAtAddress=await getContractAddress ("ContractAddress.txt");  
  console.log('Indirizzo contract Address: ' +contractDeployedAtAddress);
  console.log("Use the smart contracts 'get' function to read the contract's constructor initialized value .. " )
  await getValueAtAddress(host, contractAbi, contractDeployedAtAddress);
  console.log("Use the smart contracts 'set' function to update that value to 1187 .. " );
  await setValueAtAddress(host, account.address,'1187', contractAbi, contractDeployedAtAddress );
  console.log("Verify the updated value that was set .. " )
  await getValueAtAddress(host, contractAbi, contractDeployedAtAddress);
}

main()
