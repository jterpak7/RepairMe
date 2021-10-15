## Backend 

This is where the Backend will be stored.

## Interesting Articles
1. https://medium.com/the-node-js-collection/why-the-hell-would-you-use-node-js-4b053b94ab8e (note the comments about scalability, intersting piece about package forever which offers production-crash support. Interesting stuff about lack of support for relational databases)
1. https://stackoverflow.com/questions/16578874/what-specifically-makes-node-js-more-scalable-than-apache


## Security Overview
The security of our system is incredibly important as we must ensure that we are treating the private data of our clients with extreme precautions. The following outlines the steps taken to ensure that this degree of safety is met

1. **Password Hashing:** We are hashing our password using bcrypt and will be prepending a salt to the password before hashing
1. **Proper use of TLS:** Our client and server will be behind a load balancer that has a valid cert attached to it. This ensures we using TLS for all of our information transfer.
1. **Use of a VPN:** We will be defining a VPN in AWS to host our server and web application, the access to this VPN will be very limited.
1. **Storage of Data:** We are considering encrypting the data within MongoDB at rest. This means that if there is a breach, this data is encrypted so no private data is released.
