// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CollaborativePayoutImplementation {
    using SafeERC20 for IERC20;

    // Events
    event FundsReceived(address indexed from, uint256 amount);
    event Payout(address indexed recipient, uint256 amount);
    event SharesUpdated(address[] recipients, uint256[] shares);

    // State variables
    address public creator;
    address public contentCoin;
    uint256 public totalSharesBasis; // e.g., 10000 = 100%
    address[] private recipients;
    mapping(address => uint256) private shares;
    uint256 public totalReceived;
    mapping(address => uint256) public pendingBalances;

    bool private initialized;

    // Modifiers
    modifier onlyCreator() {
        require(msg.sender == creator, "Not creator");
        _;
    }

    modifier onlyInitialized() {
        require(initialized, "Not initialized");
        _;
    }

    /**
     * @dev Initialize the contract with creator and content coin addresses
     * @param _creator The address of the content creator
     * @param _contentCoin The address of the content coin contract
     */
    function initialize(address _creator, address _contentCoin) external {
        require(!initialized, "Already initialized");
        require(_creator != address(0), "Invalid creator address");
        require(_contentCoin != address(0), "Invalid content coin address");
        
        creator = _creator;
        contentCoin = _contentCoin;
        totalSharesBasis = 10000; // 100% in basis points
        
        recipients.push(_creator);
        shares[_creator] = totalSharesBasis;
        initialized = true;
    }

    /**
     * @dev Add a new collaborator and assign them a share
     * @param collaborator The address of the collaborator
     * @param share The share amount in basis points (e.g., 2500 = 25%)
     */
    function addCollaborator(address collaborator, uint256 share) external onlyCreator onlyInitialized {
        require(collaborator != address(0), "Zero address");
        require(share > 0, "Zero share");
        require(shares[collaborator] == 0, "Collaborator already exists");
        
        uint256 creatorShare = shares[creator];
        require(creatorShare >= share, "Creator share too small");

        // Reduce creator share
        shares[creator] = creatorShare - share;

        // Add collaborator
        recipients.push(collaborator);
        shares[collaborator] = share;

        // Emit event
        emit SharesUpdated(recipients, _getSharesArray());
    }

    // /**
    //  * @dev Update the share of an existing collaborator
    //  * @param collaborator The address of the collaborator
    //  * @param newShare The new share amount in basis points
    //  */
    // function updateShare(address collaborator, uint256 newShare) external onlyCreator onlyInitialized {
    //     require(collaborator != address(0), "Zero address");
    //     require(newShare > 0, "Zero share");
    //     require(shares[collaborator] > 0, "Collaborator does not exist");
    //     require(collaborator != creator, "Cannot update creator share directly");

    //     uint256 oldShare = shares[collaborator];
    //     uint256 creatorShare = shares[creator];
        
    //     if (newShare > oldShare) {
    //         uint256 increase = newShare - oldShare;
    //         require(creatorShare >= increase, "Creator share too small");
    //         shares[creator] = creatorShare - increase;
    //     } else {
    //         uint256 decrease = oldShare - newShare;
    //         shares[creator] = creatorShare + decrease;
    //     }

    //     shares[collaborator] = newShare;
    //     emit SharesUpdated(recipients, _getSharesArray());
    // }

    // /**
    //  * @dev Remove a collaborator and redistribute their share to the creator
    //  * @param collaborator The address of the collaborator to remove
    //  */
    // function removeCollaborator(address collaborator) external onlyCreator onlyInitialized {
    //     require(collaborator != address(0), "Zero address");
    //     require(shares[collaborator] > 0, "Collaborator does not exist");
    //     require(collaborator != creator, "Cannot remove creator");

    //     uint256 collaboratorShare = shares[collaborator];
        
    //     // Add collaborator's share back to creator
    //     shares[creator] += collaboratorShare;
        
    //     // Remove collaborator from recipients array
    //     for (uint256 i = 0; i < recipients.length; i++) {
    //         if (recipients[i] == collaborator) {
    //             recipients[i] = recipients[recipients.length - 1];
    //             recipients.pop();
    //             break;
    //         }
    //     }
        
    //     // Clear collaborator's share
    //     shares[collaborator] = 0;
        
    //     emit SharesUpdated(recipients, _getSharesArray());
    // }

    /**
     * @dev Receive ZORA tokens from Zora protocol hook
     * This function will be called by the Zora protocol when rewards are distributed
     * @param token The ERC20 token address (should be ZORA token)
     * @param amount The amount of tokens received
     */
    function onPayout(IERC20 token, uint256 amount) external onlyInitialized {
        require(amount > 0, "Amount must be greater than zero");
        
        totalReceived += amount;
        emit FundsReceived(msg.sender, amount);
        
        // Distribute funds according to shares
        _distributeFunds(token, amount);
    }

    /**
     * @dev Allow recipients to withdraw their pending balance
     * @param token The ERC20 token address
     */
    function withdraw(IERC20 token) external onlyInitialized {
        uint256 balance = pendingBalances[msg.sender];
        require(balance > 0, "No pending balance");
        
        pendingBalances[msg.sender] = 0;
        token.safeTransfer(msg.sender, balance);
        
        emit Payout(msg.sender, balance);
    }

    /**
     * @dev Get all recipient addresses
     * @return Array of recipient addresses
     */
    function getRecipients() external view returns(address[] memory) {
        return recipients;
    }

    /**
     * @dev Get the share amount for a specific recipient
     * @param recipient The recipient address
     * @return The share amount in basis points
     */
    function getShares(address recipient) external view returns (uint256) {
        return shares[recipient];
    }

    /**
     * @dev Get the total amount received by this contract
     * @return The total amount received
     */
    function getTotalReceived() external view returns(uint256) {
        return totalReceived;
    }

    /**
     * @dev Get the pending balance for a specific recipient
     * @param recipient The recipient address
     * @return The pending balance amount
     */
    function getPendingBalance(address recipient) external view returns (uint256) {
        return pendingBalances[recipient];
    }

    /**
     * @dev Get the total amount distributed
     * @return The total amount distributed
     */
    function getTotalDistributed() external view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < recipients.length; i++) {
            total += pendingBalances[recipients[i]];
        }
        return totalReceived - total;
    }

    /**
     * @dev Internal function to distribute funds according to shares
     * @param token The ERC20 token address
     * @param amount The amount to distribute
     */
    function _distributeFunds(IERC20 token, uint256 amount) internal {
        for (uint256 i = 0; i < recipients.length; i++) {
            address recipient = recipients[i];
            uint256 share = shares[recipient];
            if (share == 0) continue;
            
            uint256 distribution = (amount * share) / totalSharesBasis;
            if (distribution > 0) {
                pendingBalances[recipient] += distribution;
            }
        }
    }

    /**
     * @dev Internal helper to gather shares array
     * @return Array of share amounts for all recipients
     */
    function _getSharesArray() internal view returns (uint256[] memory) {
        uint256 len = recipients.length;
        uint256[] memory arr = new uint256[](len);
        for (uint256 i = 0; i < len; i++) {
            arr[i] = shares[recipients[i]];
        }
        return arr;
    }
}
