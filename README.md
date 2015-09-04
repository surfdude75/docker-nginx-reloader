docker-nginx-reloader
=====================

Reload nginx configuration when specified containers are started/restarted.

Build to work together with https://hub.docker.com/r/mgood/resolvable/ since nginx reload is required to take DNS update on upstream directives.

Usage example:

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

/etc/nginx/conf.d/myapp1.conf 

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

/etc/nginx/conf.d/myapp2.conf
                 
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

* GitHub ([rsobral](http://github.com/rsobral))
* Email ([rafaelsobral3@gmail.com](mailto:rafaelsobral3@gmail.com))
