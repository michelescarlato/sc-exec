# Context

This SC can be executed in Besu.
Currently only a get and set methods are implemented.

# Dependencies

```
npm install web3@1.7.4
```

Solc should be installed globally

```
sudo npm install -g solc@0.8.15
```



# Compiling, deploying and executing a transaction.

```
cd contracts/
node compile.js
```
The compile command generates a JSON called _SimpleStorage.json_

```
solcjs SimpleStorage.sol --bin --abi
```

With _Solidity compiler js_ (**solcjs**) other two jsons files generated. A JSON with abi estension, and a binary with .bin extension.

```
node Deploy.js
```

Running the deploy, the smart contract (SC) is deployed in the BC.
The SC address is then stored in the ContractAddress.txt, and will be then retrieved by the Transaction.js to perform the first transactions.



# Executing a transaction

```
node Transaction.js
```

This is the CLI intereaction with the SC.
This JS object implements the following functions:
- getValueAtAddress
- setValueAtAddress
- getAllPastEvents
- retrieveContractAddress



# Logical steps performed.

1-	Installing the dependencies.
    **npm install web3@1.7.4
    npm install --save solc@0.8.15**
    
    Compiling the solidity contract:
    **solcjs <nameContract.sol> --bin –abi**

2-	Compiling the contract with **node compile.js**

3-	Deploying the compiled contract with **node Deploy.js**.

5-	Executing the first transactions with the command **node Transaction.js** .
