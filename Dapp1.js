var abi = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "x",
                "type": "uint256"
            }
        ],
        "name": "set",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "get",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
]
var contractaddress = '0xef61059258414a65bf2d94a4fd3b503b5fee8b48';
const provider = new ethers.providers.JsonRpcProvider('http://molopante-fun:8545');

async function getValue() {
   
    const connectedContract = new ethers.Contract(contractaddress, abi, provider);
    const txn = connectedContract.get();
    txn.then(function (xname) {
        if (xname) {

            document.getElementById("xbalance").innerHTML = "last inserted value into the blockchain is : " + xname;
        }
    });
}

async function setValue() {
   
    signer = provider.getSigner(0);
    const connectedContract = new ethers.Contract(contractaddress, abi, signer);
    const privateKey = '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3';
    const wallet = new ethers.Wallet(privateKey, provider);
    const contractWithSigner = connectedContract.connect(wallet);

    const tx = await contractWithSigner.set(document.getElementById("newInfo").value);

    await tx.wait();
}