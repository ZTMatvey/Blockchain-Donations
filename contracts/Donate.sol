pragma solidity ^0.8.0;

contract Donate {
    address private immutable _sender;
    uint private _amount;
    constructor(address sender, uint amount) {
        _sender = sender;
        _amount = amount;
    }
    function AddAmount(uint amount) public {
        _amount += amount;
    }
    function GetSender() public view returns(address){
        return _sender;
    }
    function GetAmount() public view returns(uint){
        return _amount;
    }
}
