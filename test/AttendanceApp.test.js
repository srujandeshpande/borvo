const AttendanceApp = artifacts.require('./AttendanceApp.sol')

contract('AttendanceApp', (accounts) => {
  before(async () => {
    this.attendanceApp = await AttendanceApp.deployed()
  })

  it('deploys successfully', async () => {
    const address = await this.attendanceApp.address
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })

  it('marks attendance', async () => {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const result = await this.attendanceApp.markPresent('Test Name',date)
    const studCount = await this.attendanceApp.studCount()
    assert.equal(studCount, 1)
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), 1)
    assert.equal(event.name, 'Test Name')
    assert.equal(event.date, date)
  })

})
