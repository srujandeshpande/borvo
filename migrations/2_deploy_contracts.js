var AttendanceApp = artifacts.require("./AttendanceApp.sol");

module.exports = function(deployer) {
  deployer.deploy(AttendanceApp);
};
