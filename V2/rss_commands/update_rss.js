module.exports =  {
    name: 'update_rss',
    description: 'Function to call the rss_check every x time',
    execute(client){
      console.log("Update Command");
      client.commands.get('rss_check').execute(client);
      setTimeout(module.exports.get('update-rss').execute(client), time*60*1000);
    }
}