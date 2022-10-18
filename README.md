First run `npm run compile` script or `hardhat compile` to compile contracts,
then run `npm run test` to run contract tests.

# 1. DelegateCall: Calling Another Contract Function
Relate contracts: Calculator / Machine / Storage, change Machine state defined orders: 
```
  uint public calculateResult;
  address public user;
  Storage public s;
```
to
```
  Storage public s;
  uint public calculateResult;
  address public user;
  
```
try to find why some tests are failed.

# add more later
