pragma solidity ^0.5.0;

contract Healthnet {

  uint public patientCount = 0;
  uint public hospitalCount = 0;
  uint public insurerCount = 0;
  uint public recordCount = 0;

  struct PatientData {
    string name;
    string dob;
    uint phone;
    string email;
    uint firstRecord;
  }

  struct DoctorData {
    address doctorAddress;
    //todo
  }

  struct HospitalData {
    address hospitalAddress;
    string name;
    string code;
  }

  struct InsurerData {
    address insurerAddress;
    string name;
    string code;
  }

  struct RecordData {
    uint patientNumber;
    address hospitalAddress;
    string recordText;
    string dateTime;
    uint next;
    uint approved;
  }

  mapping(uint => PatientData) public patientList;
  mapping(uint => HospitalData) public hospitalList;
  mapping(uint => InsurerData) public insurerList;
  mapping(uint => RecordData) public recordList;

  event NewRecord(
    uint recordNumber,
    uint patientNumber,
    address hospitalAddress,
    string recordText,
    string dateTime
  );

  constructor() public {
    // Can make the constructor do something here.
  }

  function addRecord(uint _patient_number, string memory _record_text, string memory _date_time) public {
    address _hospital_address = msg.sender;
    recordCount ++;
    recordList[recordCount] = RecordData(_patient_number, _hospital_address, _record_text, _date_time, 0, 0);
    emit NewRecord(recordCount, _patient_number, _hospital_address, _record_text, _date_time);
  }

}
