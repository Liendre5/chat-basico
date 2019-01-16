const socket = io();

let message = document.getElementById("client-message");
let send_button = document.getElementById("client-message-send");
let output = document.getElementById("chat-output");
let actions = document.getElementById("actions");
let chat_window = document.getElementById("chat-window");
let user_name_output;

//User set-up - - - - - - - - - - - - - - -
let user = {name: undefined, chat_color: undefined};
user.name = prompt('Introduce un nombre de usuario: ', 'Guest'+Math.floor(Math.random()*123783042));

if(user.name.length > 14){
    let userValid = false;
    while (!userValid){
        user.name = prompt('Introduce un nombre de usuario valido: ', 'Guest'+Math.floor(Math.random()*123783042));     
        if(user.name.length < 14) {
            userValid = true;
        }
    }
}

user.chat_color = getRandomHexColor();
onClientConnect();

//Event-listeners - - - - - - - - - - - - 
send_button.addEventListener('click', () => {
    sendChatMessage();
});
message.addEventListener('keyup', (event) => {
    event.preventDefault();
    if(event.keyCode == 13){
        sendChatMessage();
    }
});

message.addEventListener('keypress', () => {
    socket.emit('user:typing', user.name);
});


//Socket.io receptors
socket.on('chat:message', (data) => {
    actions.innerHTML = '';
    
    user_name_output = document.createElement('strong');
    user_name_output.style.color = data.user_color;
    user_name_output.innerHTML = data.username;

    let chat_message = document.createElement('p');
    chat_message.innerHTML = user_name_output.outerHTML+" : "+data.message;
    output.appendChild(chat_message);
});

socket.on('user:typing', (data) => {
    actions.innerHTML = "<strong>"+data+"</strong> esta escribiendo..."
});

socket.on('user:connect', (data) => {
    let chat_message = document.createElement('p');
    chat_message.style.color = "#D6D6D6";
    chat_message.innerHTML = "<strong> "+data+" </strong> se ha unido al chat.";
    output.appendChild(chat_message);
});

socket.on('user:disconnect', (data) => {
    let chat_message = document.createElement('p');
    chat_message.style.color = "#D6D6D6";
    chat_message.innerHTML = "<strong> "+data+" </strong> se ha desconectado.";
    output.appendChild(chat_message);
});

//Auxiliar Functions. - - - - - - - - - - - - - - - 
function sendChatMessage(){
    if(message.value != '' || message.value.length <= 150){
        socket.emit('chat:message', {
            username: user.name,
            user_color: user.chat_color,
            message: message.value
        });
        message.value = ''; 
    } else{
        alert('Tienes que introducir un mensaje hijo de puta.');
    }
}

function onClientConnect(){
    socket.emit('user:connect', user.name);
}

function onClientDisconnect(){
    socket.emit('user:disconnect', user.name);
}

function getRandomHexColor(){
    return '#'+Math.floor(Math.random()*16777215).toString(16);
}


