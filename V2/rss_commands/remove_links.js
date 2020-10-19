module.exports =  {
    name: 'remove_links',
    description: 'Function to remove links.',
    execute(message, args){
        const links  = fs.readFileSync('cursos.txt', 'UTF-8');
        const list = links.split(/\r?\n/);
        list.pop();
        var a = 1;
        if(args.length <2){
            message.channel.send("Introduza um valor.");
            return;            
        }
        var numero = args[1];
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
}