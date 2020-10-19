module.exports =  {
    name: 'set_time',
    description: 'Function to set time for the rss check cycle',
    execute(message, args, client){
        if(args.length <2){
            message.channel.send("Introduza um valor.");
            return;            
        }
        var time = args[1]
        if (isNaN(time)){
            message.channel.send("Valor introduzido não é um número. Será mantido o valor anterior.")
        }else{
            fs.writeFile('time.txt', time,  function (err) {
                if (err) return console.log(err);
            });
            client.commands.get('update-rss').execute(client);
        };
    }
}