const { ipcRenderer } = require('electron')

let $ = require('jquery')
let fs = require('fs')
var contacts = [];
let modal;
let vCard = require('vcf');

$('#cancelbtn').on('click', () => {
  ipcRenderer.send('asynchronous-message', 'closeModal')
})

$('#addbtn').on('click', () => {

  let name = $('#contactname').val()
  let number = $('#contactnumber').val()
  let mobile = $('#contactnumberm').val()
  let address = $('#contactAddress').val()
  let company = $('#contactCompany').val()
  let birthday = $('#contactBirthday').val()
  let email = $('#contactEmail').val()

  fs.appendFileSync('contacts.txt', name+","+number+","+ mobile+","+ address+","+ company+","+birthday+","+ email+'\n', (err) => {
    if (err) throw err;
    console.log("the data was appended!");
  });

  ipcRenderer.send('asynchronous-message', 'closeAndRefresh')

})

function validate(name, number, mobile, address, company, birthday, email){

}

function addEntry(name, number, mobile, address, company, birthday, email){
  var contact = {};
  contact['name'] = name;
  contact['number'] = number;
  contact['mobile'] = mobile;
  contact['address'] = address;
  contact['company'] = company;
  contact['birthday'] = birthday;
  contact['email'] = email;
  contacts.push(contact);
  var index = contacts.length-1;

  let updateString = "<tr onclick='loadDetails(" + index + ")'><td>" + name + "</td><td>" + number + "</td></tr>"

  $('#contactlist').append(updateString)
}

function loadDetails(index){
    var contact = contacts[index];
    $('#savebtn').hide();
    $('#selectedname').val(contact.name);
    $('#selectedname').prop('readonly', true);
    $('#selectednumber').val(contact.number);
    $('#selectednumber').prop('readonly', true);
    $('#selectedmobile').val(contact.mobile);
    $('#selectedmobile').prop('readonly', true);
    $('#selectedadress').val(contact.address);
    $('#selectedaddress').prop('readonly', true);
    $('#selectedcompany').val(contact.company);
    $('#selectedcompany').prop('readonly', true);
    $('#selectedbirthday').val(contact.birthday);
    $('#selectedbirthday').prop('readonly', true);
    $('#selectedemail').val(contact.number);
    $('#selectedemail').prop('readonly', true);
    $('#deletebtn').off('click');
    $('#deletebtn').on('click', () => {
      deleteEntry(index);
    })
    $('#editbtn').off('click');
    $('#editbtn').on('click', () => {
      $('#selectedname').prop('readonly', false);
      $('#selectednumber').prop('readonly', false);
      $('#savebtn').show();
    })
    $('#savebtn').off('click');
    $('#savebtn').on('click', () => {
      editEntry(index);
    })
}

function editEntry(index){
  contacts[index].name = $('#selectedname').val();
  contacts[index].number = $('#selectednumber').val();
  fs.truncateSync('contacts.txt');
  contacts.forEach((contact, index) => {
  
    fs.appendFileSync('contacts.txt', contact.name+","+contact.number+","+ mobile+","+ address+","+ company+","+birthday+","+ email+'\n', (err) => {
      if (err) throw err;
      console.log("the data was appended!");
    });
  })
  contacts=[];
  loadAndDisplayContacts();
}

function deleteEntry(index){

    contacts.splice(index, 1);
    fs.truncateSync('contacts.txt');
    
    contacts.forEach((contact, index) => {

      fs.appendFileSync('contacts.txt', contact.name+","+contact.number+","+ mobile+","+ address+","+ company+","+birthday+","+ email+'\n', (err) => {
        if (err) throw err;
        console.log("the data was appended!");
      });
    })

    contacts = [];
    loadAndDisplayContacts();
}

function loadAndDisplayContacts() {
   let filename = "contacts.txt";

   //Check if file exists
   if(fs.existsSync(filename)) {
      let data = fs.readFileSync(filename, 'utf8').split('\n')
      $('#contactlist').html("<tr><th>Name</th><th>Phone</th></tr>");
      data.forEach((contact, index) => {
         let [ name, number ] = contact.split(',')
         if (name && number){
           addEntry(name, number)
         }
      })
      if (contacts.length > 0){
        loadDetails(0);
      }
   }
}

function showAddContactModal(){
  ipcRenderer.send('asynchronous-message', 'showAddModal')
}

function showEditContactModal(index){
  loadEditDetails(index);
  ipcRenderer.send('asynchronous-message', 'showEditModal')
}

function importFile(filename){
    let data = fs.readFileSync(filename, 'utf8');
    var cards = vCard.parse(data);
    cards.forEach((card, index) => {
      fs.appendFileSync('contacts.txt', card.get("n")+","+card.get("tel")+'\n', (err) => {
        if (err) throw err;
        console.log("the data was appended!");
      });

    });
    contacts = [];
    loadAndDisplayContacts();
}

function exportFile(){
    contacts.forEach((contact, index) => {
    console.log('exporting contact '+contact.name);
    card = new vCard();
    card.set("n", contact.name);
    card.set("tel", contact.number);
    fs.appendFileSync("vcard.txt", card.toString(),(err) => {
      if (err) throw err;
      console.log("the data was exported!");
    });

  })
}
