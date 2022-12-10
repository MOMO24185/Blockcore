# Blockcore
(Setting up the local ganache network)

1) Install Ganache APP for windows
1.1) Set up a new network with Gas fees set to 0
1.2) Set up new custom network on metamask plugin using the Ganache network details
1.3) Import an accounts private key to metamask using the metamask plugin on a browser
1.4) Import truffle config file from the truffle project folder to Ganache using the network settings page

(Deploying the smart contract to the local ganache network)

2) Install VSCode with truffle extension, then follow requirements page instructions to install pre-requisites
2.1) Once ready, use the truffle tab in VSCode to deploy smart contract 'blockchain.sol' from 'contracts' folder
2.2) Once deployed, copy the deployed contract address and replace the contract address of line 34 in 'homePage.js' within the 'src' folder

(Running the application)

3)Once the network is set up, open up the terminal within the project folder and type 'npm run start'
3.1) Script should start and localhost:3000 should start and open up browser with the application ready to use.

(Usage)

4)Connect Wallet by choosing the appropriate imported Ganache account on the custom network
4.1)Set up password
4.2)Login
4.3)Upload file(s)
4.4)Confirm transaction
4.5)Download/Delete file(s)
4.6)Logout
