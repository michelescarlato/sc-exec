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

solcjs SimpleStorage.sol --bin --abi
node Deploy.js
```


# Executing a transaction

```
# after deploying, the smart contract address should be rescued.
node Transaction.js

```

# Logical steps performed.

2-	Lanciare il comando "node compile.js"

3-	npm install --save solc@0.8.15
    Lanciare il comando solcjs <nameContract.sol> --bin –abi

4-	Lanciare il comando node Deploy.js per deploiare il contratto

5-	Lanciare il comando node Transaction.js per creare transazioni.
