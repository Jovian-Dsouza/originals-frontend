// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ICollaborativePayout {
    // Events
    event FundsReceived(address indexed from, uint256 amount);
    event Payout(address indexed recipient, uint256 amount);
    event SharesUpdated(address[] recipients, uint256[] shares);

    // Core functions
    function initialize(address creator, address contentCoin) external;
    function addCollaborator(address collaborator, uint256 share) external;
    // function updateShare(address collaborator, uint256 newShare) external;
    // function removeCollaborator(address collaborator) external;
    function onPayout(address token, uint256 amount) external;
    function withdraw(address token) external;

    // View functions
    function getRecipients() external view returns (address[] memory);
    function getShares(address recipient) external view returns (uint256);
    function getTotalReceived() external view returns (uint256);
    function getPendingBalance(address recipient) external view returns (uint256);
    function getTotalDistributed() external view returns (uint256);

    // State variables
    function creator() external view returns (address);
    function contentCoin() external view returns (address);
    function totalSharesBasis() external view returns (uint256);
    function totalReceived() external view returns (uint256);
}
