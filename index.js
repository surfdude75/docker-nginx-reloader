var DockerEvents = require('docker-events');
var Dockerode = require('dockerode');

if (process.argv.length<4) {
	console.error('Missing arguments.');
	console.error('Use nginx container name as first argument followed by container names to watch.');
	return;
}

var nginx = process.argv[2];
var watch_containers = process.argv.slice(3);

console.log("nginx container to restart: %j",nginx);
console.log("container to watch for start: %j",watch_containers);

var docker = new Dockerode();

var emitter = new DockerEvents({ docker: docker });
emitter.on("start",function(message) {
	var container = docker.getContainer(message.id);
	container.inspect(function(err,data){
		if (err)
			console.log(new Date().toISOString()+" error inpecting container "+message.id+".");
		else {
			var name = data.Name.substring(1);
			if (watch_containers.indexOf(name)>-1) {
				console.log(new Date().toISOString()+" "+name+" started. Reloading "+nginx+".");
				var nginx_container = docker.getContainer(nginx);
				if (nginx_container)
					nginx_container.kill({ signal: 'HUP'},function(err,data){
						if (err)
							console.log(new Date().toISOString()+' failed to restart '+nginx);
						else
							console.log(new Date().toISOString()+' reload '+nginx);
					});
				else
					console.error(new Date().toISOString()+" failed to find "+nginx);
			}
		}
	});
});

emitter.start();
console.log("Listening for docker events...");
