

const socket = io()
let userName = ''
let msn = ''
let listUser = []
let keyCode = 13
let logiPage = document.querySelector('#loginPage')
let chatPage = document.querySelector('#chatPage')
let inputLogin = document.querySelector('.areaModal input')
let inputChat = document.querySelector('.areaInput input')
//utils↓↓ selector('.listMsn').innerHTML = '' selector('.listMsn').innerHTML = ''
const selector = (element)=>document.querySelector(element)
const selectorAll = (element)=>document.querySelectorAll(element)
const createElement = (element ='div')=> document.createElement(element)

const colorRondom = (colors=[])=>{
    let index = Math.floor(Math.random() * colors.length);
    return colors[index]
}
logiPage.style.display = 'flex';
chatPage.style.display = 'none';

function rendeUser(list=[]){
    
    let personaOn  = document.querySelector('.onlines h3 span');
    let ul = document.querySelector('ul.list');
    ul.innerHTML = ''
    personaOn.innerHTML = `(${list.length < 10 ? '0'+list.length : list.length})`;
    let newList = list
    newList.map((user,index)=>{
        let li = document.createElement('li');
        li.setAttribute('id',index+1)
        li.style.width ='100%';
        li.style.padding = '10px';
        li.style.backgroundColor = '#f9a';
        li.addEventListener('mousemove',(e)=>li.style.backgroundColor='#a9f')
        li.addEventListener('mouseout',(e)=>li.style.backgroundColor='#f9a')
        li.innerHTML = user;
        ul.append(li);
    })
    
}

function rendeMsn(list){
   selector('.listMsn').innerHTML = ''
    
    let newList =[...list];
    newList.map((msnJson,index)=>{
        //let msn = selector('.message').cloneNode(true)
        let msn = createElement()
        let author = createElement()
        let phasse = createElement()
        msn.classList.add('message')
        author.classList.add('.nameAucthor')
        author.innerHTML = msnJson.nameuser;
        phasse.innerHTML = msnJson.msn;

       
        msn.append(author)
        msn.append(phasse)
        

      /*  msn.setAttribute('data-key',index)
        msn.querySelector('.nameAucthor')
            .innerHTML = msnJson.nameuser
        msn.querySelector('.nameAucthor')
            .style.color = colorRondom(['white','black'])
        msn.querySelector('.pheses')
            .innerHTML = msnJson.msn; 
        */
        selector('.listMsn').append(msn)
    })
}


const addMsn = (type,user,msn)=>{
    let status = selector('.status')
    let h3 = selector('.box h3')
   

    switch(type){
        case 'connection':
            status.style.backgroundColor = 'green'
            h3.innerHTML = ''
            h3.innerHTML = msn
        break;
        case 'disconnected':
            status.style.backgroundColor = 'red'
            h3.innerHTML = ''
            h3.innerHTML = msn
        break;
        case 'reconnectd':
            status.style.backgroundColor = 'yellow'
            h3.innerHTML = ''
            h3.innerHTML = msn
        break;
    }
}
inputLogin.addEventListener('keyup', (e)=>{
    if(e.keyCode === keyCode){
        let name = inputLogin.value.trim()
        if(name){
            userName = name
            document.title = `chat (${userName})`
            socket.emit('join-request',userName)
        }else{
            alert('Preencha todos os dados ..!')
        }
    }
})
inputChat.addEventListener('keyup',(e)=>{
    if(e.keyCode === keyCode){
    msn = inputChat.value.trim()
    if(msn){
        socket.emit('msn',{username:userName, msm:msn})

    }else{

        alert('campo vaziu')
    }

    inputChat.value= ''
}
})


// socket
socket.on('user-ok',(listConnectedUser)=>{
    logiPage.style.display = 'none'
    chatPage.style.display = 'flex'
    inputChat.focus()
    addMsn('connection',null,'conequitado !')
    listUser = [...listConnectedUser]
    rendeUser(listUser)
})

socket.on('list-update',(data)=>{ 

    if(data.joined){
        addMsn('connection',null,data.joined+' entrou no chat')
    }
    if(data.left){
        addMsn('disconnected',null,data.left+' saiu do chat')
    }
    listUser = data.list;

    rendeUser(listUser)
})

socket.on('msn-update',(data)=>{
    let datanew = data
    rendeMsn(datanew)

})

socket.on('disconnect',()=>{
    addMsn('disconnected',null,'Você foi desconectado !')
    listUser =[]
    rendeUser(listUser)
})
socket.io.on("reconnect_error", (error) => {
   
    addMsn('reconnectd',null,' Tentando Reconectar !')    

    
  })
socket.io.on("reconnect", (attempt) => {
    addMsn('connection',null,' conectado !')    
    if(userName){
        socket.emit('join-request',userName)
    }
  })
 