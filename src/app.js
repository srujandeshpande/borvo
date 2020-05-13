App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = web3.eth.accounts[0]
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const attendanceApp = await $.getJSON('AttendanceApp.json')
    App.contracts.AttendanceApp = TruffleContract(attendanceApp)
    App.contracts.AttendanceApp.setProvider(App.web3Provider)
    //console.log(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.attendanceApp = await App.contracts.AttendanceApp.deployed()
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    $('#account').html(App.account)

    // Render Attendance
    await App.renderAttendance()

    // Update loading state
    App.setLoading(false)
  },

  renderAttendance: async () => {
    // Load the total attendance count from the blockchain
    const studCount = await App.attendanceApp.studCount()
    const $attendanceTemplate = $('.attendanceTemplate')

    // Render out each attendance with a new attendance template
    for (var i = 1; i <= studCount; i++) {
      // Fetch the attendance data from the blockchain
      const at = await App.attendanceApp.atlist(i)
      const atId = at[0].toNumber()
      const name = at[1]
      const address = at[2]
      const date = at[3]
      const number = at[4]

      // Create the html for the attendance
      const $newattendanceTemplate = $attendanceTemplate.clone()
      $newattendanceTemplate.find('.name').html(name)
      $newattendanceTemplate.find('.address').html(number)
      $newattendanceTemplate.find('.date').html(date)

      // Put the attendance in the correct list
      $('#attendanceList').append($newattendanceTemplate)

      // Show the attendance
      $newattendanceTemplate.show()
    }
  },

  markPresent: async () => {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const studCount = await App.attendanceApp.studCount()

    App.setLoading(true)
    const name = $('#name').val()
    const nm = $('#name_aa').val()
    await App.attendanceApp.markPresent(name,date,nm)
    window.location.reload()
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})
