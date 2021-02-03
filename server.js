const Discord = require('discord.js');
const Gamedig = require('gamedig');
const client = new Discord.Client();
const prefix = "!"

let state = null;

client.on('message', message => {
if (!message.content.startsWith(prefix) || message.author.bot) return;

const args = message.content.slice(prefix.length).trim().split(/ +/);
const command = args.shift().toLowerCase();


// Commandes "State"
 if (command === 'state_server') {
    // if state is null just send an error message
    if (!state) {
      return message.channel.send('**Oupss**, the server is currently **Offline** (:red_circle:) !');
    }
    
    // GameDig Variables
    const nom = state.name;
    const carte = state.map;
    const nb_joueursmax = state.maxplayers;
    const nb_joueurs = state.players.length;
    const nb_robots = state.bots.length;
    const latence = state.ping;
    
    // Print State
    message.channel.send('__**Status**__: Online (:green_circle:)');
    message.channel.send('__**Name**__: ' + nom);
    message.channel.send('__**Map**__: ' + carte);
    message.channel.send('__**Players**__: ' + nb_joueurs + '/' + nb_joueursmax + ' (' + nb_robots + ')');
    message.channel.send('__**Latency**__: ' + latence + ' ms'); 
  }

// others commands...
if (command === 'ping') {  
	 message.channel.send(` BotPing: Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
}
});

client.on('ready', () => {
  console.log('OK')

  setInterval(() => {
    Gamedig.query({
      type: 'garrysmod', // Game List: https://www.npmjs.com/package/gamedig
      host: 'xx.xx.xx.xx', // Your Server IP
      port: '27015' // Your Server Port
    })
      .then((updatedState) => {
        state = updatedState;

        const nb_joueursmax = state.maxplayers;
        const nb_joueurs = state.players.length;
        
        client.user.setPresence({
          activity: { name: `${nb_joueurs}/${nb_joueursmax} Players` },
          status: 'online',
        });
      })
      .catch((e) => {
        console.log(e);
        client.user.setPresence({
          activity: { name: 'Server Offline' },
          status: 'idle',
        }); 
      });
  }, 6000);
});

client.login('YourTokenDiscordAPP');