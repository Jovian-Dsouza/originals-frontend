// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/CollaborativePayoutImplementation.sol";
import "../src/CollaborativePayoutFactory.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying contracts...");
        console.log("Deployer address:", deployer);
        console.log("Deployer balance:", deployer.balance);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy implementation contract
        console.log("Deploying CollaborativePayoutImplementation...");
        CollaborativePayoutImplementation implementation = new CollaborativePayoutImplementation();
        console.log("Implementation deployed at:", address(implementation));
        
        // Deploy factory contract
        console.log("Deploying CollaborativePayoutFactory...");
        CollaborativePayoutFactory factory = new CollaborativePayoutFactory(address(implementation));
        console.log("Factory deployed at:", address(factory));
        
        vm.stopBroadcast();
        
        console.log("\n=== Deployment Summary ===");
        console.log("Implementation:", address(implementation));
        console.log("Factory:", address(factory));
        console.log("Deployer:", deployer);
        
        // Verify contracts if on testnet/mainnet
        if (block.chainid != 31337) {
            console.log("\n=== Verification Commands ===");
            console.log("Run verification commands manually:");
            console.log("Implementation:", address(implementation));
            console.log("Factory:", address(factory));
        }
    }
}
