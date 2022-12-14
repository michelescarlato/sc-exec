from web3 import Web3
from web3.middleware import geth_poa_middleware

#w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))
urlConn = 'http://127.0.0.1:8545'
w3 = Web3(Web3.HTTPProvider(urlConn))

print(w3.isConnected())
w3.middleware_onion.inject(geth_poa_middleware, layer=0)
#print(w3.eth.get_block('latest'))
print('Connected to Besu: ', w3.isConnected(), 'Node: ', urlConn,'Client Version: ', w3.clientVersion)
