Deprecated. Use the following docker container for it.

https://hub.docker.com/r/phensley/docker-dns/

docker-nginx-reloader
=====================

Reload nginx configuration when specified docker containers are started/restarted.

Build to work together with https://hub.docker.com/r/mgood/resolvable/ since nginx reload is required to take DNS update on upstream directives.

Use as first argument the nginx container name followed by the name of containers to watch. 

Usage example:
--------------

Start nginx reloader

	docker run -d \
		--name nginx-reloader \
		-v /var/run/docker.sock:/var/run/docker.sock \
		rsobral/docker-nginx-reloader \
		mynginx myapp1 myapp2

Start resolvable

	docker run -d \
		--hostname resolvable \
		--name resolvable \
		-v /var/run/docker.sock:/var/run/docker.sock \
		-v /etc/resolv.conf:/tmp/resolv.conf \
		 mgood/resolvable

/nginx/myapp1.conf 

	upstream myapp1 {
		server myapp1.docker;
	}

	server {
		listen	80;
		server_name myapp1.example.com;
		location / {
			proxy_pass http://myapp1;
		}
	}

/nginx/myapp2.conf
                 
	upstream myapp2 {
		server myapp2.docker;
	}                                 
					  
	server {                          
		listen  80;              
		server_name myapp2.example.com;
		location / {             
			proxy_pass http://myapp2;
		}
	}

Start nginx

	docker run -d \
		--name mynginx \
		-v /nginx/conf:/etc/init.d/conf.d \
		-p 80:80 \
		nginx

* GitHub ([surfdude75](http://github.com/surfdude75))
* Email ([rafaelsobral3@gmail.com](mailto:rafaelsobral3@gmail.com))
