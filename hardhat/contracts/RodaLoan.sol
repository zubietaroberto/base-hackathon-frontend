// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol"; // Import SafeMath library

/**
 * @title RodaLoanCOP
 * @dev This contract represents a loan token with outstanding balance, issuance date, and loan term.
 */
contract RodaLoanCOP is ERC721, AccessControl {
    using SafeMath for uint; // Use SafeMath for uint type

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    mapping(uint => uint) public principal;
    mapping(uint => uint) public outstandingBalance;
    mapping(uint => uint) public issuanceDate;
    mapping(uint => uint) public loanTerm;
    mapping(uint => uint) private loanPurpose;

    // Payment struct to store payment information
    struct Payment {
        uint id;
        uint amount;
        uint date;
    }

    // Mapping to store an array of payments for each token ID
    mapping(uint => mapping(uint => Payment)) public loanPayments;

    // Mapping to ensure the uniqueness of payment IDs
    mapping(uint => uint) public paymentToLoan;

    constructor() ERC721("RodaLoanCOP", "RCCOP") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    event LoanIssued(
        address indexed to,
        uint indexed tokenId,
        uint principal,
        uint totalRepaymentAmount,
        uint issuanceDate,
        uint loanTerm,
        uint loanPurpose
    );

    event PaymentRecorded(
        uint indexed tokenId,
        uint paymentId,
        uint paymentAmount,
        uint paymentDate
    );

    function issueLoan(
        address to,
        uint loanId,
        uint _principal,
        uint totalRepaymentAmount,
        uint _issuanceDate,
        uint _loanTerm,
        uint _loanPurpose
    ) public onlyRole(MINTER_ROLE) {
        principal[loanId] = _principal;
        outstandingBalance[loanId] = totalRepaymentAmount;
        issuanceDate[loanId] = _issuanceDate;
        loanTerm[loanId] = _loanTerm;
        loanPurpose[loanId] = _loanPurpose;

        _safeMint(to, loanId); // Effects should be called last.

        emit LoanIssued(
            to,
            loanId,
            _principal,
            totalRepaymentAmount,
            _issuanceDate,
            _loanTerm,
            _loanPurpose
        );
    }

    // Function to update the outstandingBalance and record the payment with paymentDate
    function recordPayment(
        uint loanId,
        uint paymentId,
        uint paymentAmount,
        uint paymentDate
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(paymentToLoan[paymentId] == 0); // (make sure IDs in the original database can't be zero)
        outstandingBalance[loanId] = outstandingBalance[loanId].sub(
            paymentAmount
        ); // Safely subtract paymentAmount

        // Add the payment with the paymentDate to the payments mapping
        loanPayments[loanId][paymentId] = Payment({
            id: paymentId,
            amount: paymentAmount,
            date: paymentDate
        });
        paymentToLoan[paymentId] = loanId;

        emit PaymentRecorded(loanId, paymentId, paymentAmount, paymentDate);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
