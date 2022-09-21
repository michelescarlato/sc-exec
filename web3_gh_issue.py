import json
from web3 import Web3
from web3.middleware import geth_poa_middleware

#w3 = Web3(Web3.HTTPProvider(httpUrls[nodes[0]]))
urlConn = 'http://127.0.0.1:8545'
w3 = Web3(Web3.HTTPProvider(urlConn))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)

'''
genesisFile = 'genesis.json'
with open(genesisFile, 'r') as f:
    data = json.load(f)['alloc']
addrKeys = [addr for addr in data.keys()]
addrs = [Web3.toChecksumAddress(addr) for addr in addrKeys]
'''

print('Connected to Besu: ', w3.isConnected(), 'Node: ', urlConn, w3.clientVersion)

with open('contracts/SimpleStorage.json') as file:
    compiled = json.load(file)
contractAbi = compiled['abi']
contractBin = compiled['bytecode']
contractInit = "000000000000000000000000000000000000000000000000000000000000002F"
fromAddress = addrs[0]
rawtxOptions = {
    'nonce': w3.eth.get_transaction_count(fromAddress),
    'from': fromAddress,
    'to': None,
    'value': '0x00',
    'data': contractBin+contractInit,
    'gas': 90000,
    'gasPrice': 18000000000,
    'chainId': 1337
}
priv_key = data[addrKeys[0]]['privateKey']
signed_txn = w3.eth.account.sign_transaction(rawtxOptions, priv_key)
tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
receipt
