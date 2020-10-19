module.exports =  {
    name: 'add_link',
    description: 'Add links.',
    execute(message, args){
        if(args.length <2){
            message.channel.send("Introduza parametros corretos.");
            return;            
        }
        var message_splited = args[1].split("»");
    
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
}