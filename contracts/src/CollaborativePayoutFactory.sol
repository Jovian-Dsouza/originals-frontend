// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./CollaborativePayoutImplementation.sol";

contract CollaborativePayoutFactory {
    address public immutable implementation;
    address[] public allClones;
    mapping(address => bool) public isClone;
    mapping(address => address) public creatorToClone;
    mapping(address => address) public contentCoinToClone;

    event CloneCreated(address indexed cloneAddress, address indexed creator, address indexed contentCoin);

    constructor(address _implementation) {
        require(_implementation != address(0), "Invalid implementation");
        implementation = _implementation;
    }

    /**
     * @dev Create a new payout clone for a creator and content coin
     * @param creator The address of the content creator
     * @param contentCoin The address of the content coin contract
     * @return cloneAddr The address of the created clone
     */
    function createPayout(address creator, address contentCoin) external returns (address cloneAddr) {
        require(creator != address(0), "Invalid creator address");
        require(contentCoin != address(0), "Invalid content coin address");
        require(creatorToClone[creator] == address(0), "Creator already has a payout contract");
        require(contentCoinToClone[contentCoin] == address(0), "Content coin already has a payout contract");

        cloneAddr = Clones.clone(implementation);
        
        CollaborativePayoutImplementation(payable(cloneAddr)).initialize(creator, contentCoin);
        
        allClones.push(cloneAddr);
        isClone[cloneAddr] = true;
        creatorToClone[creator] = cloneAddr;
        contentCoinToClone[contentCoin] = cloneAddr;
        
        emit CloneCreated(cloneAddr, creator, contentCoin);
    }

    /**
     * @dev Get the total number of clones created
     * @return The number of clones
     */
    function allClonesCount() external view returns(uint256) {
        return allClones.length;
    }

    /**
     * @dev Get the clone address for a specific creator
     * @param creator The creator address
     * @return The clone address, or address(0) if not found
     */
    function getCloneByCreator(address creator) external view returns (address) {
        return creatorToClone[creator];
    }

    /**
     * @dev Get the clone address for a specific content coin
     * @param contentCoin The content coin address
     * @return The clone address, or address(0) if not found
     */
    function getCloneByContentCoin(address contentCoin) external view returns (address) {
        return contentCoinToClone[contentCoin];
    }

    /**
     * @dev Get all clone addresses
     * @return Array of all clone addresses
     */
    function getAllClones() external view returns (address[] memory) {
        return allClones;
    }

    /**
     * @dev Check if an address is a valid clone
     * @param clone The address to check
     * @return True if the address is a valid clone
     */
    function isValidClone(address clone) external view returns (bool) {
        return isClone[clone];
    }
}
