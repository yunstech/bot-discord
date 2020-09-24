const Discord = require("discord.js");
const { receiveMessageOnPort } = require("worker_threads");
const client = new Discord.Client();

let code = "";

client.on("ready", () => {
  console.log("Connected as " + client.user.tag);

  client.user.setActivity("with JavaScript");

  client.guilds.cache.forEach((guild) => {
    guild.channels.cache.forEach((channel) => {
      console.log(`${channel.name} - ${channel.type} - ${channel.id}`);
    });
  });

  let generalChannel = client.channels.cache.get("758557928231272484");
  generalChannel.send("Selamat Datang Di Discord X IPS 1");
});

client.on("message", (recieveMessage) => {
  if (recieveMessage.author === client.user) {
    return;
  }

  //   recieveMessage.channel.send(
  //     "Message received: " +
  //       recieveMessage.author.toString() +
  //       ": " +
  //       recieveMessage.content
  //   );

  //   recieveMessage.react("👍");

  if (recieveMessage.content.startsWith("!")) {
    processCommand(recieveMessage);
  }
});

function processCommand(recieveMessage) {
  let fullCommand = recieveMessage.content.substr(1);
  let splitCommand = fullCommand.split(" ");
  let primaryCommand = splitCommand[0];
  let arguments = splitCommand.slice(1);

  if (primaryCommand == "help") {
    helpCommand(arguments, recieveMessage);
  } else if (primaryCommand == "siapakamu") {
    recieveMessage.channel.send(
      "Saya adalah bot yang di program oleh @Yunstech untuk merespons beberapa perintah, jangan lupa untuk follow pembuat @yunstech"
    );
  } else if (primaryCommand == "code") {
    setCode(arguments, recieveMessage);
  }
}

function helpCommand(arguments, receiveMessage) {
  if (arguments.length == 0) {
    receiveMessage.channel.send(`!siapakamu: untuk mengetahui siapa saya,
    segitu dlu ntar di update
    `);
  } else {
    receiveMessage.channel.send(
      "Kelihatannya anda membutuhkan bantuan dengan perintah " + arguments
    );
  }
}
function setCode(arguments, receiveMessage) {
  if (arguments.length == 0) {
    if (code) {
      receiveMessage.channel.send("code room: " + code);
    } else {
      receiveMessage.channel.send(
        "kode room belum di set, silahkan set dengan !code (Code room)"
      );
    }
  } else {
    code = arguments;
    receiveMessage.channel.send("code telah di set ke: " + arguments);
  }
}

client.login("NzU4NTYyOTkxNjYxNzc2ODk2.X2ww1g.bPWy00cWD4L0EAIyq2WnJDAGb34");
