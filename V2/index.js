const Discord = require('discord.js');
let Parser = require('rss-parser');
const fs = require('fs');

const {
	prefix,
  token,
} = require('./config.json');

const client = new Discord.Client();


const rss_commands = fs.readdirSync('./rss_commands/').filter(file => file.endsWith('.js'));

for(const file of rss_commands){
  const command = require(`./rss_commands/${file}`);
  client.commands.set(command.name, command);
  
}

client.login(token);


client.once('ready', () => {
    console.log('Txolas Manager is online!');
    client.commands.get('update-rss').execute();    
   });
   client.once('reconnecting', () => {
    console.log('Reconnecting!');
   });
   client.once('disconnect', () => {
    console.log('Disconnect!');
   });




client.on('message', async message => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === "help-rss" || command === "help"){
      client.commands.get('help_rss').execute(message); //Feito

    } else if (command === "set_time"){
      client.commands.get('set_time').execute(message, args, client); //Feito

    } else if (command === "links"){
      client.commands.get('links').execute(message); //Feito

    } else if (command === "remove_links"){
      client.commands.get('remove_links').execute(message, args); //Feito

    } else if (command === "add_links"){
      client.commands.get('add_links').execute(message, args); //Feito

    } else if (command === "update"){
      client.commands.get('update_rss').execute(client); //Feito

    } else {
      message.channel.send("That's not a valid command!")
    }
});













