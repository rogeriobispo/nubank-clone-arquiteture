## Whats is thes repo about?

 This will be an monorepo to keep the nubank-ecosistem-clone.
it will note be the real copy of its econsystem, only what i thinks it is.

## Tecnologies that will be used.

* nodejs
* typescript
* docker
* rabbitmq

## patterns and architecture

* events drive arquiteture
* Test driven development
* microservices arquiteture

## services that will be created

* Users-Api - done
* Address-Api - done
* consumers - WIP until the end of the project
* Accounts - backlog
* bank stratum - backlog
* Ted - backlog
* Doc - backlog
* Pix - backlog
* billet payment - backlog
* billet generation - backlog

## Motivation

Chalenge myself to create a big arquiteture and learn from it, improve skils from it.

## Users Api
    - Api for creanting users
    # Fetures
    * Create user
    * Update user
    * Block and unbloque user
    * Easy way to create new environments just change the node_env
    * dockerfile to deploy on kubernets
    * Unit tests
    * Requests tests
## consumers
    - background jobs
    # features
    * rabbitmq Consumers
    * store history log on mongo db
## Address Api
    - search zipcode
    # returns address for a zipcode.
    * store on redis as cache for the zipcode

## Consumers
    - background jobs to consume message on the ecosystem
    * History log consumer

