const express = require( "express")

const path =require( 'path')
const http = require( 'http')
const sockerIO = require('socket.io')
const { disconnect } = require("process")
const console = require("console")
const app = express()
const services = http.createServer(app)
const io = sockerIO(services)
services.listen(3001,()=>console.log('run'))

app.use(express.static(path.join(__dirname, 'public')))
let listConnectedUser = []
let listMsn=[]
io.on('connection',(socket)=>{
    
    socket.on('join-request', (userName)=>{
        console.log('ok')
        socket.userName = userName
        listConnectedUser.push(userName)
        socket.emit('user-ok',listConnectedUser)
        socket.broadcast.emit('list-update',{
            joined: userName,
            list: listConnectedUser
        })
    }) 

    socket.on('disconnect',()=>{
        listConnectedUser = listConnectedUser.filter(u=> u!=socket.userName)
        socket.broadcast.emit('list-update',{
            left:socket.userName,
            list:listConnectedUser
        })
    })

    socket.on('msn',(data)=>{
        let nameuser= data.username
        let msn = data.msm
        if(nameuser && msn){
            
            listMsn.push({nameuser,msn})
            socket.emit('msn-update',listMsn)
            socket.broadcast.emit('msn-update',listMsn)
        } 
    
    })
})