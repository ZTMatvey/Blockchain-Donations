pragma solidity ^0.8.0;

import "./Donate.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DonationContract is ERC20 {
    string public constant Name = "Donation contract";
    string public constant Symbol = "DC";
    address private immutable _owner;
    Donate[] private _donates;
    uint private _totalAmount;

    constructor() ERC20(Name, Symbol){
        _owner = msg.sender;
    }
    modifier requireOwner(){
        require(msg.sender == _owner, "Only owner can call");
        _;
    }
    function Withdraw(address payable to, uint amount) external requireOwner {
        require(amount <= _totalAmount, "Amount for withdraw must be less or equal than a total amount");
        to.transfer(address(this).balance);
        _totalAmount -= amount;
    }
    function GetAllDonaters() external view returns(address[] memory){
        address[] memory result = new address[](_donates.length);
        for (uint256 i = 0; i < _donates.length; i++)
            result[i] = _donates[i].GetSender();
        return result;
    }
    function GetTotalAmount() external view returns(uint){
        return _totalAmount;
    }
    function GetDonationAmountOf(address sender) external view returns(uint){
        for (uint256 i = 0; i < _donates.length; i++) {
            if(_donates[i].GetSender() == sender)
                return _donates[i].GetAmount();
        }
        revert("This sender did not donate anything");
    }
    function Donation() payable external {
        uint amount = msg.value;
        address from = msg.sender;
        _totalAmount += amount;
        bool isAdded = AddToOldEntries(from, amount);
        if(!isAdded)
            CreateNewDonateEntry(from, amount);
    }
    function AddToOldEntries(address from, uint amount) private returns(bool){
        for (uint256 i = 0; i < _donates.length; i++)
            if(_donates[i].GetSender() == from)
            {
                _donates[i].AddAmount(amount);
                return true;
            }
        return false;
    }
    function CreateNewDonateEntry(address from, uint amount) private{
        Donate donate = new Donate(from, amount);
        _donates.push(donate);
    }
}
