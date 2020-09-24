const Discord = require("discord.js");
const client = new Discord.Client();

var queue = new Map();

const ytdl = require("ytdl-core");
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

  if (recieveMessage.content.startsWith("!")) {
    processCommand(recieveMessage, client);
  }
});

const processCommand = async (recieveMessage, client) => {
  let fullCommand = recieveMessage.content.substr(1);
  let splitCommand = fullCommand.split(" ");
  let primaryCommand = splitCommand[0];
  let arguments = splitCommand.slice(1);
  const serverQueue = queue.get(recieveMessage.guild.id);

  if (primaryCommand == "help") {
    helpCommand(arguments, recieveMessage);
  } else if (primaryCommand == "siapakamu") {
    recieveMessage.channel.send(
      "Saya adalah bot yang di program oleh @Yunstech untuk merespons beberapa perintah, jangan lupa untuk follow pembuat @yunstech"
    );
  } else if (primaryCommand == "code") {
    setCode(arguments, recieveMessage);
    recieveMessage.react("👍");
  } else if (primaryCommand == "terbuatdariapakamu") {
    recieveMessage.channel.send(
      "Saya di program oleh yunstech menggunakan bahasa pemrograman javscript, terimakasih telah bertanya "
    );
    recieveMessage.react("😘");
  } else if (primaryCommand == "terimakasihbot") {
    recieveMessage.channel.send("Senang Bisa Membantu! 😘");
    recieveMessage.react("😘");
  } else if (primaryCommand == "play") {
    execute(recieveMessage, serverQueue, arguments);
  } else if (primaryCommand == "skip") {
    execute(recieveMessage, serverQueue, arguments);
  } else if (primaryCommand == "stop") {
    execute(recieveMessage, serverQueue, arguments);
  } else {
    serverQueue.songs.push(song);
    return recieveMessage.channel.send(
      `${song.title} telah ditambahkan queue!`
    );
  }
};

async function execute(message, serverQueue, arguments) {
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "kamu harus ada voice channel untuk memutar musik!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "saya harus memiliki izin intuk join dan berbicara di voice channel!"
    );
  }
  console.log(arguments);
  const songInfo = await ytdl.getInfo(arguments[0]);
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} telah ditambahkan queue!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "kamu harus ada voice channel untuk stop musik!"
    );
  if (!serverQueue)
    return message.channel.send("tidak ada musik yang bisa kamu skip!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "kamu harus ada voice channel untuk stop musik!"
    );
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", (error) => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Mulai memutar : **${song.title}**`);
}

function helpCommand(arguments, receiveMessage) {
  if (arguments.length == 0) {
    receiveMessage.channel.send(`
    Perintah" Yang telah tersedia:
    !siapakamu: untuk mengetahui siapa saya,
    !code: untuk mengetahui code room among us,
    !terbuatdariapakamu: untuk mengetahui saya dibuat menggunakan apa,
    !terimakasihbot: untuk berterimakasih,
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
