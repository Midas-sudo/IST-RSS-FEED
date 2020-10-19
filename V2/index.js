const Discord = require('discord.js');
let Parser = require('rss-parser');
const fs = require('fs');

const {
	prefix,
  token,
} = require('./config.json');

const client = new Discord.Client();
let parser = new Parser();

const rss_commands = fs.readdirSync('./rss_commands/').filter(file => file.endsWith('.js'));

for(const file of rss_commands){
  const command = require(`./rss_commands/${file}`);
  client.commands.set(command.name, command);
  
}

client.login(token);


client.once('ready', () => {
    console.log('Ready!');
   });
   client.once('reconnecting', () => {
    console.log('Reconnecting!');
   });
   client.once('disconnect', () => {
    console.log('Disconnect!');
   });




client.on('message', async message => {
    if (message.author.bot) return;

    if (message.content.startsWith(`${prefix}force`)) {
      counter();
      return;
    }

    if (!message.content.startsWith(prefix) || !(message.member.roles.cache.find((role) => role.name == "Mod"))) return;

    if (message.content.startsWith(`${prefix}set_time`)) { 
        set_time(message);
        return;
    } else if (message.content.startsWith(`${prefix}help`)) {
        help(message);
        return;
    } else if (message.content.startsWith(`${prefix}links`)) {
        links(message);
        return;
    } else if (message.content.startsWith(`${prefix}add_link`)) {
        add_link(message);
        return;
    } else if (message.content.startsWith(`${prefix}remove_link`)) {
        remove_link(message);
        return;
    } else {
        message.channel.send("You need to enter a valid command!");
    }
});


async function links(message){
    const links  = fs.readFileSync('cursos.txt', 'UTF-8');
    const list = links.split(/\r?\n/);
  var a = 0;
  const embed = new Discord.MessageEmbed()
    .setTitle("IST - RSS News Links")
    .setColor(0xf7c500)
    .setDescription("Lista de links a verificar. Para remover escrever: `||remove_link seguido` do número do link.")

  list.forEach(link => {
    var name = link.split("»")
    console.log(name);
    if(name[1] !== undefined){
    embed.addFields({ name: a + " - " + name[1], value: link});
    }
    a++;      
  });

  message.channel.send(embed); 
}

async function remove_link(message){
  const links  = fs.readFileSync('cursos.txt', 'UTF-8');
  const list = links.split(/\r?\n/);
  list.pop();
  var a = 1;
  var numero = message.content.slice(14);
  if (isNaN(numero)){
    message.channel.send("Insira apenas um numero válido")
  }else{
    if(numero > list.length){
      message.channel.send("Insira apenas um numero válido");
    }else{
      list.splice(numero, 1);
      fs.writeFile('cursos.txt', list[0]+ "\n",  function (err) {
        if (err) return console.log(err);
      });

      while(a < list.length){
        fs.writeFile('cursos.txt', list[a]+'\n',{encoding: "UTF-8",flag: "a+"},  function (err) {
          if (err) return console.log(err);
        });
        a++;
      }

    }

};
}

async function set_time(message){
    var time = message.content.slice(11);
    if (isNaN(time)){
        message.channel.send("Valor introduzido não é um número. Será mantido o valor anterior.")
    }else{
        fs.writeFile('time.txt', time,  function (err) {
            if (err) return console.log(err);
        });
        counter();
    };
}


async function counter(){
    console.log("Force command");
    const time = fs.readFileSync('time.txt', 'UTF-8');
    execute();
    setTimeout(counter, time*60*1000);
}

async function add_link(message){
    var link = message.content.slice(11);

    var message_splited = link.split("»");

    const links  = fs.readFileSync('cursos.txt', 'UTF-8');
    const list = links.split(/\r?\n/);
    list.pop();
    list.push(link);

    fs.writeFile("./cursos/"+message_splited[1]+".txt", message_splited[1]+"\n",{encoding: "UTF-8",flag: "a+"},  function (err) {
        if (err) return console.log(err);
    });

    fs.writeFile('cursos.txt', list[0]+ "\n",  function (err) {
      if (err) return console.log(err);
    });
     var a = 1;
    while(a < list.length){
      fs.writeFile('cursos.txt', list[a]+'\n',{encoding: "UTF-8",flag: "a+"},  function (err) {
        if (err) return console.log(err);
      });
      a++;
    }
}


async function help(message){
    message.channel.send({
        embed: {
            color: 0xf7c500,
            title: "IST - RSS News HELP",
            description: "Este bot tem como objetivo mostrar os anúncios da diferentes páginas das cadeiras de cada curso. ",
            fields: [
                {
                  "name": "Alguns comandos são:",
                  "value": "-------------------------------------------"
                },
                {
                  "name": "||set_time",
                  "value": "Este comando server para definir o tempo entre verificações dos RSS feeds. O tempo é definido em minutos e nao pode ser inferior a 5 min, sendo o default é 15 minutos.\n```Exemplo: ||set_time 15```\n"
                },
                {
                  "name": "||help",
                  "value": "Para mostrar esta página."
                },
                {
                  "name": "||add_link",
                  "value": "Para adicionar links de RSS da pagina de uma cadeira, utiliza-se este comando acompanhado de a aberviatura da cadeira e o id da sala onde o bot ira colocar os anúncios, tudo separado por ».\n```Exemplo: \n||add_link https://fenix.tecnico.ulisboa.pt/disciplinas/AC77/2020-2021/1-semestre/rss/announcement»ACir»123456789```"
                },
                {
                  "name": "||links",
                  "value": "Este comando pode ser utilizado para ver os links já inseridos no bot. Sendo que aparecem numerados de forma a que seja mais facil remover algum link.\n"
                },
                {
                  "name": "||force",
                  "value": "Este comando ser para reiniciar o contador sendo que provoca uma verificação no momento de utilização do comando."
                },
                {
                  "name": "||remove_link",
                  "value": "Este comado é utilizado para remover um link da lista de feeds de RSS. Para remover um link é aconcelhado primeiro executar ``||links`` e depois de ver o link a remover executar:\n```||remove_link numerodolink```"
                }
              ],
            author: {
                "name": "Pagina de GitHub",
                "url": "https://github.com/Midas-sudo/IST-RSS-FEED"
              },
            footer: {
                "text": "Para mais ajuda contactar Gonçalo Midoes "
            },
        },
    });
}


async function execute() {

    const cursos = fs.readFileSync('cursos.txt', 'UTF-8');
    
    // split the contents by new line
    const links = cursos.split(/\r?\n/);

    var a = links.length - 6;
    var b = 0;
    while(b < a){
        var c = 0;
        const link = links[b].split("»");
        let feed = await parser.parseURL(link[0]);
        //console.log(feed.items);
        console.log(link[1]);

        const times = fs.readFileSync("./cursos/" + link[1]+'.txt', 'UTF-8');
        const time = times.split(/\r?\n/);

        while(c != feed.items.length){
            if(time.indexOf(feed.items[c].isoDate) == -1){
                if(feed.items[c].contentSnippet.length < 2048){
                    client.channels.cache.get(link[2]).send({
                      content: "<@&667397171364102163>",
                      embed: {
                        color: 0xf7c500,
                        title: feed.title,
                        url: feed.items[c].guid,
                        description: feed.items[c].contentSnippet,
                        footer: {
                          text: link[1]
                        },
                        timestamp: feed.items[c].isoDate
                      },
                    });
                }else{
                    console.log(feed.items[c]);
                    var text = feed.items[c].contentSnippet;

                    var first_half = text.slice(0,text.lastIndexOf(' ', 2047));;
                    var second_half = text.slice(text.lastIndexOf(' ', 2047));
                    client.channels.cache.get(link[2]).send({
                      content: "<@&667397171364102163>",
                      embed: {
                        color: 0xf7c500,
                        title: feed.title,
                        url: feed.items[c].guid,
                        description: first_half,
                      },
                    });
                    client.channels.cache.get(link[2]).send({
                      embed: {
                        color: 0xf7c500,
                        title: feed.title + " (continuação)",
                        url: feed.items[c].guid,
                        description: second_half,
                        footer: {
                          text: link[1]
                        },
                        timestamp: feed.items[c].isoDate
                      },
                    });
                }
                fs.writeFile("./cursos/" + link[1]+'.txt', feed.items[c].isoDate+'\n',{encoding: "UTF-8",flag: "a+"},  function (err) {
                    if (err) return console.log(err);
                });
            }
            c++;
        }
        b++;
    }

    var a = links.length - 1;
    var b = 5;
    while(b < a){
        var c = 0;
        const link = links[b].split("»");
        let feed = await parser.parseURL(link[0]);
        //console.log(feed.items);
        console.log(link[1]);

        const times = fs.readFileSync("./cursos/" + link[1]+'.txt', 'UTF-8');
        const time = times.split(/\r?\n/);

        while(c != feed.items.length){
            if(time.indexOf(feed.items[c].isoDate) == -1){
                if(feed.items[c].contentSnippet.length < 2048){
                    client.channels.cache.get(link[2]).send({
                      content: "<@&760051133221175309>",
                      embed: {
                        color: 0xf7c500,
                        title: feed.title,
                        url: feed.items[c].guid,
                        description: feed.items[c].contentSnippet,
                        footer: {
                          text: link[1]
                        },
                        timestamp: feed.items[c].isoDate
                      },
                    });
                }else{
                    console.log(feed.items[c]);
                    var text = feed.items[c].contentSnippet;

                    var first_half = text.slice(0,text.lastIndexOf(' ', 2047));;
                    var second_half = text.slice(text.lastIndexOf(' ', 2047));
                    client.channels.cache.get(link[2]).send({
                      content: "<@&760051133221175309>",
                      embed: {
                        color: 0xf7c500,
                        title: feed.title,
                        url: feed.items[c].guid,
                        description: first_half,
                      },
                    });
                    client.channels.cache.get(link[2]).send({
                      embed: {
                        color: 0xf7c500,
                        title: feed.title + " (continuação)",
                        url: feed.items[c].guid,
                        description: second_half,
                        footer: {
                          text: link[1]
                        },
                        timestamp: feed.items[c].isoDate
                      },
                    });
                }
                fs.writeFile("./cursos/" + link[1]+'.txt', feed.items[c].isoDate+'\n',{encoding: "UTF-8",flag: "a+"},  function (err) {
                    if (err) return console.log(err);
                });
            }
            c++;
        }
        b++;
    }
}
