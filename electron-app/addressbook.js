const { ipcRenderer } = require('electron')

let $ = require('jquery')
let fs = require('fs')
var contacts = [];
var message="";
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
  let url = $('#contacturl').val()
  let image = $('#contactimg').val()

  if(validateAdd(name, number, mobile, email)){
    fs.appendFileSync('contacts.txt', name+","+number+","+ mobile+","+ address+","+ company+","+birthday+","+ email+","+url+ ","+ image+'\n', (err) => {
      if (err) throw err;
      console.log("the data was appended!");
    });

    ipcRenderer.send('asynchronous-message', 'closeAndRefresh')
    }
})

function validateAdd(name, number, mobile, email){
    let valid=true;
    if(name == null || name==""){
      $('#errorname').text("A name is required");
      $('#contactname').css("background-color", "#e66465");
      valid=false;
    }

    if (/(^\d{10}$)|(^\(\d{3}\) \d{3}-\d{4}$)/.test(number)) {}
    else{$('#errorphone').text("Phone number is required and must be XXXXXXXXXX or (XXX) XXX-XXXX");
    $('#contactnumber').css("background-color", "#e66465");
    valid=false;
  }  

    if(mobile == ""){}
    else if (/(^\d{10}$)|(^\(\d{3}\) \d{3}-\d{4}$)/.test(mobile)) {}
    else{$('#errormobile').text("Mobile number must be XXXXXXXXXX or (XXX) XXX-XXXX");
    $('#contactnumberm').css("background-color", "#e66465");
    valid=false;
  }
  
    if(email == ""){}
    else if (/^[a-z][a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) {
      if(email.includes("..") || email.includes("__") || email.includes("--")){
        $('#erroremail').text("Email is not valid. Special Charatcers (.), (_), (-) must be followed by a letter.");
        $('#contactEmail').css("background-color", "#e66465");
        valid=false;
      }
    }
    else{$('#erroremail').text("Please enter a valid email. ((.), (_), (-) are the only accepted special characters)");
    $('#contactEmail').css("background-color", "#e66465");
    valid=false;
  }

    return valid;
  }

  function validateEdit(name, number, mobile, email){
    let valid= true;
    if(name == null || name==""){
      $('#nameerror').text("A name is required");
      $('#selectedname').css("background-color", "#e66465");
      valid =false;
    }

    if (/(^\d{10}$)|(^\(\d{3}\) \d{3}-\d{4}$)/.test(number)) {}
    else{
      $('#phoneerror').text("Phone number is required and must be XXXXXXXXXX or (XXX) XXX-XXXX");
      $('#selectednumber').css("background-color", "#e66465");
      valid= false;
  }  

    if(mobile == ""){}
    else if (/(^\d{10}$)|(^\(\d{3}\) \d{3}-\d{4}$)/.test(mobile)) {}
    else{
      $('#mobileerror').text(" Mobile number must be XXXXXXXXXX or (XXX) XXX-XXXX");
      $('#selectedmobile').css("background-color", "#e66465");
      valid=false;
  }
  
    if(email == ""){}
    else if (/^[a-z][a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) {
      if(email.includes("..") || email.includes("__") || email.includes("--")){
        $('#emailerror').text("Email is not valid. Special Charatcers (.), (_), (_) must be followed by a letter.");
        $('#selectedemail').css("background-color", "#e66465");
        valid=false;
      }
    }
    else{$('#emailerror').text("Please enter a valid email. ((.), (_), (-) are the only accepted special characters)");
    $('#selectedemail').css("background-color", "#e66465");
    valid=false;
  }

    return valid;
  }

function addEntry(name, number, mobile, address, company, birthday, email, url, image){
  var contact = {};
  contact['name'] = name;
  contact['number'] = number;
  contact['mobile'] = mobile;
  contact['address'] = address;
  contact['company'] = company;
  contact['birthday'] = birthday;
  contact['email'] = email;
  contact['url'] = url;
  contact['image'] = image;
  contacts.push(contact);
  var index = contacts.length-1;

  let updateString = "<tr onclick='loadDetails(" + index + ")'><td>" + name + "</td><td>" + number + "</td></tr>"

  $('#contactlist').append(updateString)
}

function loadDetails(index){
    var contact = contacts[index];
    clearerrors();
    $('#savebtn').hide();
    $('#simg').hide();
    $('selectedimg').change(function(){
      readURL(this);
    });
    $('#selectedname').val(contact.name);
    $('#selectedname').prop('readonly', true);
    $('#selectednumber').val(contact.number);
    $('#selectednumber').prop('readonly', true);
    $('#selectedmobile').val(contact.mobile);
    $('#selectedmobile').prop('readonly', true);
    $('#selectedaddress').val(contact.address);
    $('#selectedaddress').prop('readonly', true);
    $('#selectedcompany').val(contact.company);
    $('#selectedcompany').prop('readonly', true);
    $('#selectedbirthday').val(contact.birthday);
    $('#selectedbirthday').prop('readonly', true);
    $('#selectedemail').val(contact.email);
    $('#selectedemail').prop('readonly', true);
    $('#selectedurl').val(contact.url);
    $('#selectedurl').prop('readonly', true);

    if(contact.image == "")
      $('#selectedimg').attr('src', "default.png");
    else
      $('#selectedimg').attr('src', contact.png);
    
    $('#deletebtn').off('click');
    $('#deletebtn').on('click', () => {
      deleteEntry(index);
    })
    $('#editbtn').off('click');
    $('#editbtn').on('click', () => {
      $('#selectedname').prop('readonly', false);
      $('#selectednumber').prop('readonly', false);
      $('#selectedmobile').prop('readonly', false);
      $('#selectedaddress').prop('readonly', false);
      $('#selectedcompany').prop('readonly', false);
      $('#selectedbirthday').prop('readonly', false);
      $('#selectedemail').prop('readonly', false);
      $('#selectedurl').prop('readonly', false);
      $('#simg').show();
      $('#savebtn').show();
    })
    $('#savebtn').off('click');
    $('#savebtn').on('click', () => {
      editEntry(index);
    })
}

function editEntry(index){
  validateEdit($('#selectedname').val(), $('#selectednumber').val(), $('#selectedmobile').val(),$('#selectedemail').val())

  if(validateEdit($('#selectedname').val(), $('#selectednumber').val(), $('#selectedmobile').val(),$('#selectedemail').val())){
    clearerrors();
    addEntry($('#selectedname').val(), $('#selectednumber').val(), $('#selectedmobile').val(), $('#selectedaddress').val(), $('#selectedcompany').val(), $('#selectedbirthday').val(),$('#selectedemail').val(), $('#selectedurl').val(), $('#selectedimg').val())
    deleteEntry(index);
  }
}
function clearerrors(){
  $('#selectedname').css("background-color", "white");
  $('#selectednumber').css("background-color", "white");
  $('#selectedmobile').css("background-color", "white");
  $('#selectedemail').css("background-color", "white");
  $('#nameerror').text("");
  $('#phoneerror').text("");
  $('#mobileerror').text("");
  $('#emailerror').text("");
}
function deleteEntry(index){

    contacts.splice(index, 1);
    fs.truncateSync('contacts.txt');
    
    contacts.forEach((contact, index) => {

      fs.appendFileSync('contacts.txt', contact.name+","+contact.number+","+ contact.mobile+","+ contact.address+","+ contact.company+","+contact.birthday+","+ contact.email+","+contact.url+","+contact.image+'\n', (err) => {
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
      contacts=[];
      data.forEach((contact, index) => {
         let [ name, number, mobile, address, company, birthday, email, url ] = contact.split(',')
         if (name && number){
           addEntry(name, number, mobile, address, company, birthday, email, url)
         }
      })
      if (contacts.length > 0){
        loadDetails(0);
      }
   }
}

function readURL(input) {

  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $('#selectedimg').attr('src', e.target.result);
    }

    reader.readAsDataURL(input.files[0]);
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
      fs.appendFileSync('contacts.txt', card.get("n")+","+card.get("tel")+","+card.get("mob")+","+card.get("add")+","+card.get("comp")+card.get("birth")+","+card.get("email")+","+card.get("url")+'\n', (err) => {
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
    card.set("mob", contact.mobile);
    card.set("add", contact.address);
    card.set("comp", contact.company);
    card.set("birth", contact.birthday);
    card.set("email", contact.email);
    card.set("url", contact.url);
    fs.appendFileSync("vcard.txt", card.toString(),(err) => {
      if (err) throw err;
      console.log("the data was exported!");
    });

  })
}

