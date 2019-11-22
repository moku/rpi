//ttn device ID, Accesskey
var ttn = require('ttn');
var net_client = require('net');
const appID = "disposableiot"
const accessKey = "ttn-account-v2.jT3bgohLwxzqFDiJUzi2tKLgaaTsgmWRrPPR90evVWc"
var Lora_client_ = get_Start();

//Lora server connection
var Sock_client = getConnection();

function get_Start() {
    ttn.data(appID, accessKey).then(function(client) {
        Lora_client_ = client;
        get_Lora_sensing_vlaue();
        // return client;
    })
    .catch(function (error) {
        console.error("Error", error.stack)
        process.exit(1)
    })   
}
//hex to string
function hexToString(str)
{
    const buf = new Buffer(str, 'hex');
    return buf.toString('utf8');
}

//Down link or uplink data recv
function get_Lora_sensing_vlaue(){

    Lora_client_.on("uplink", function (devID, payload) {
        console.log("Received uplink from ", devID)
        var dev_eui = payload.hardware_serial;
        console.log(dev_eui);
        
        //payload_raw: recv Data
        var recvData = hexToString(payload["payload_raw"]);

        //   "{dri=1;if=1}{tis=[0,1,2,3]}"
        //   console.log(htos.split('}'));
        //   var obj = JSON.parse(htos);
        //   console.log(obj);
        // console.log(recvData);
        // console.log(hrecvDatatos.search("if="));
        
        //send to edge dev


        // writeData(client, recvData);

        const sendtodev = Buffer.from('{dri=1; rsc=200}{di=4dasc44321}', 'utf8');
        console.log(sendtodev);
    //   const sendtodev2 = Buffer.from('{di = 4dasc44321}', 'utf8');
    //   console.log(sendtodev2);
      //   {dri = 1; rsc = 200}
    //   {di = 4dasc44321}

    //   client_.send("deviceone", sendtodev2);
    })
}

function getConnection(){
    //서버에 해당 포트로 접속 

    var Sock_client = ""; 
    var recvData = [];  
    var local_port = ""; 
 
    Sock_client = net_client.connect({port: 8369, host:'localhost'}, function() {
     
        console.log("connect log======================================================================"); 
        console.log('connect success'); 
        console.log('local = ' + this.localAddress + ':' + this.localPort); 
        console.log('remote = ' + this.remoteAddress + ':' +this.remotePort); 
     
        local_port = this.localPort; 
     
        this.setEncoding('utf8'); 
        this.setTimeout(600000); // timeout : 10분 
        console.log("client setting Encoding: binary, timeout:600000" ); 
        console.log("client connect localport : " + local_port);
    }); 
 
    // 접속 종료 시 처리 
    Sock_client.on('close', function() { 
        console.log("client Socket Closed : " + " localport : " + local_port); 
    });
    
    Sock_client.on('data', function(data) { 
        console.log("data recv log======================================================================"); 
        recvData.push(data); 
        console.log("data.length : " + data.length);
        console.log("data recv : " + data);
        console.log("!!!!!!"+ Lora_client_);
        const sendtodev = Buffer.from('{dri=1; rsc=200}{di=4dasc44321}', 'utf8');
        Lora_client_.send("deviceone", sendtodev);

        // Sock_client.end();
    }); 

    Sock_client.on('end', function() { 
        console.log('client Socket End'); 
    }); 
    
    Sock_client.on('error', function(err) { 
        console.log('client Socket Error: '+ JSON.stringify(err)); 
    }); 
    
    Sock_client.on('timeout', function() { 
        console.log('client Socket timeout: '); 
    }); 
    
    Sock_client.on('drain', function() { 
        console.log('client Socket drain: '); 
    }); 
    
    Sock_client.on('lookup', function() { 
        console.log('client Socket lookup: '); 
    });  
    
    return Sock_client;

}
var senddata = "{dri=1;if=1}{tis=[0,1,2,3]}";
var count = 0;
var repeat = setInterval(function(){
    console.log("Send to Edge@@@@@@@@@@@@@");
    writeData(Sock_client, senddata);
    count ++;
    if(count==5){
        clearInterval(repeat);
    }
},1000);

function writeData(socket, data){
    var success = !socket.write(data);
    if (!success){
        console.log("Server Send Fail");
    }
}

// get_Start();

 

 

