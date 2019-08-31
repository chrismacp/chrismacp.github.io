---
title: "Docker Network Subnet Conflicts"
date: 2019-08-17
excerpt: "Scientists just discovered how to 'grow' tooth enamel!"
header:
  overlay-image: /assets/images/docker-network-subnet-conflicts/header.jpg
  image_description: "Scientists just discovered how to 'grow' tooth enamel!"
  caption: "Zhejiang University/Science Advances"
  actions:
    - label: "Fin out more on that story"
      url: "https://www.theguardian.com/science/2019/aug/30/scientists-grow-tooth-enamel"
category:
 - dev
tags:
 - docker
 - network
 - containers
 - subnet

---



On at least two occasions at work over the last few years I experienced a problem with a Docker host I was using where it would just stop responding and I wasted time trying to figure out what was wrong. It usually ended up with a ticket to a team who managed the VMs and they would sort it out. This time I vowed to work out what was happening. 

## The Problem

As mentioned, I have a Docker host which is a remote VM with Docker installed that I can SSH in to if needed, but I usually just build and run containers on it via the Docker CLI.

After running some Docker operation, say ``` $ docker compose up ```, I could no longer communicate with my VM. Ping didn't respond, SSH didn't respond and rebooting the VM didn't change the situation either. There wasn't much more I could do apart from create a ticket for the team who manage the VMs.

The response I got back said something along the lines of:
> There are multiple Linux bridges configured on the VM and one subnet    172.20.x.x inside the routing table looks wrong.
>
> We are using that subnet for other infrastructure so it appears to be  clashing and is the reason why connectivity was lost.
> 
> Why are you using that subnet?

That was a question I couldn't answer. I don't configure that stuff! I just push my lovely images to Docker and start them, maybe I'll open a port or two.

Anyway, one other thing that my colleague discovered was that there seemed to be a pattern in the subnets of the Linux bridges that had been configured on the VM, it looked like they were being incremented:

```
172.17.x.x
172.18.x.x
172.19.x.x
172.20.x.x
...
```

## Investigation

After the initial diagnosis with the support team it was clear that there were many Linux bridges on my Docker VM, probably created by Docker as the machine was used for little else. So I thought about how to proceed.

- Can we find out why all these Linux bridges get created?

- How can we clean up the Linux bridges, ideally automatically?

### Why are the Linux bridges being created

This [Docker networking][1] article really helped me to understand how the Docker networking components fit together.

It states the following about user-defined networks (i.e. not using the default docker network):
> In addition to the default networks, users can create their own networks called user-defined networks of any network driver
type. **In the case of user-defined bridge networks, a new Linux bridge is setup on the host**. Unlike the default bridge network, user-defined networks supports manual IP address and subnet assignment. **If an assignment isn't given, then Docker's default IPAM driver assigns the next subnet available in the private IP space**. 

So any time you run a Docker container and specify your own network name, a new Linux bridge is created on the host machine. This
makes sense as all containers connected to the same network can resolve each other, but we probably do not want the same across different networks.

The documentation also states:
> By default bridge is assigned one subnet from the ranges 172.[17-31].0.0/16 or 192.168.[0-240].0/20 which does not
overlap with any existing host interface.

So there are only so many subnets available, hence a similar number of network names that can be used concurrently. The main point for
this investigation is that the Docker subnet range conflicts with our internal subnet 172.20.x.x, so as the generated Linux bridge subnets start at 172.17.x.x and are incremented, on creating our fourth different Docker network our Docker VM will contain conflicting subnets and connectivity will be lost.

### Example

Let's show how this works with some examples. 

Here is the list of networks that exist on my VM by default from a clean slate:
```
$ docker network list
NETWORK         ID NAME     DRIVER  SCOPE
87d6eaeaa3b2    bridge      bridge  local
203005abb73a    host        host    local
a8e2951a9c62    none        null    local
```

The initial default docker0 bridge exists and. as displayed below, is using the first subnet from Docker's pre-defined range: 172.17.0.1.

```
$ sudo ifconfig
docker0: flags=4099<UP,BROADCAST,MULTICAST> mtu 1500
    inet 172.17.0.1 netmask 255.255.0.0 broadcast 172.17.255.255
    ether 02:42:47:fb:87:5f txqueuelen 0 (Ethernet)
    RX packets 56 bytes 1880 (1.8 KiB)
    RX errors 0 dropped 0 overruns 0 frame 0
    TX packets 49 bytes 2401 (2.3 KiB)
    TX errors 0 dropped 0 overruns 0 carrier 0 collisions 0

$ sudo ip link
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN
mode DEFAULT group default qlen 1
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast
state UP mode DEFAULT group default qlen 1000
    link/ether 00:50:56:a8:e1:19 brd ff:ff:ff:ff:ff:ff
3: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue
state DOWN mode DEFAULT group default
    link/ether 02:42:47:fb:87:5f brd ff:ff:ff:ff:ff:ff

```
You can see the bridge is in ```state DOWN```, which is because there are no containers using the network yet.

We now create a user-defined network '**testnet1**' for our container to use (same as using the 'network' option in a dockercompose.yml file)

```
$ docker network create -d bridge testnet1

4d3c70d4f3d304823e7e2c1ae3c9c071bc190abd76d2884747c3dd4700e96e88
```

We can see the new network:
```
$ docker network list
NETWORK ID    NAME      DRIVER  SCOPE
87d6eaeaa3b2  bridge    bridge  local
203005abb73a  host      host    local
a8e2951a9c62  none      null    local
4d3c70d4f3d3  testnet1  bridge  local
```

...and on the host we can see the subnet that has been assigned:
```
$ sudo ifconfig
br-4d3c70d4f3d3: flags=4099<UP,BROADCAST,MULTICAST> mtu 1500
    inet 172.18.0.1 netmask 255.255.0.0 broadcast 172.18.255.255
    ether 02:42:3b:65:9c:39 txqueuelen 0 (Ethernet)
    RX packets 0 bytes 0 (0.0 B)
    RX errors 0 dropped 0 overruns 0 frame 0
    TX packets 0 bytes 0 (0.0 B)
    TX errors 0 dropped 0 overruns 0 carrier 0 collisions 0
docker0: flags=4099<UP,BROADCAST,MULTICAST> mtu 1500
    inet 172.17.0.1 netmask 255.255.0.0 broadcast 172.17.255.255
    ether 02:42:47:fb:87:5f txqueuelen 0 (Ethernet)
    RX packets 56 bytes 1880 (1.8 KiB)
    RX errors 0 dropped 0 overruns 0 frame 0
    TX packets 49 bytes 2401 (2.3 KiB)
    TX errors 0 dropped 0 overruns 0 carrier 0 collisions 0

$ sudo ip link
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN
mode DEFAULT group default qlen 1
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast
state UP mode DEFAULT group default qlen 1000
    link/ether 00:50:56:a8:e1:19 brd ff:ff:ff:ff:ff:ff
3: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue
state DOWN mode DEFAULT group default
    link/ether 02:42:47:fb:87:5f brd ff:ff:ff:ff:ff:ff
21: br-4d3c70d4f3d3: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc
noqueue state DOWN mode DEFAULT group default
    link/ether 02:42:3b:65:9c:39 brd ff:ff:ff:ff:ff:ff
```
You can see above that:
- The new Linux bridge br-4d3c70d4f3d3 has been created on the host (the Docker network-id is used in the Linux bridge name)
- The new Linux bridge has a subnet 1 higher than the default docker0 Linux bridge
- The new Linux bridge is in the DOWN state as we created it manually and no containers are using it yet

### Extra

Just for some extra points about interfaces that get created on the host: if we now start a container (Alpine Linux here) using our new Docker network '**testnet1**'...

```
$ docker run -it --rm --network=testnet1 alpine:latest
Unable to find image 'alpine:latest' locally
latest: Pulling from library/alpine
e7c96db7181b: Pull complete
Digest: sha256:
769fddc7cc2f0a1c35abb2f91432e8beecf83916c421420e6a6da9f8975464b6
Status: Downloaded newer image for alpine:latest
```

...then we can see an extra interface created on the host called veth5155c04. This is used to route traffic to the eth0 interface inside the container we created. (The name of the interface is generated from the MAC address too). **Each container will get its own virtual interface**.

```
$ sudo ifconfig
br-4d3c70d4f3d3: flags=4163<UP,BROADCAST,RUNNING,MULTICAST> mtu 1500
    inet 172.18.0.1 netmask 255.255.0.0 broadcast 172.18.255.255
    ether 02:42:3b:65:9c:39 txqueuelen 0 (Ethernet)
    RX packets 0 bytes 0 (0.0 B)
    RX errors 0 dropped 0 overruns 0 frame 0
    TX packets 0 bytes 0 (0.0 B)
    TX errors 0 dropped 0 overruns 0 carrier 0 collisions 0
...
veth5155c04: flags=4163<UP,BROADCAST,RUNNING,MULTICAST> mtu 1500
    ether ea:a5:a7:0a:07:99 txqueuelen 0 (Ethernet)
    RX packets 0 bytes 0 (0.0 B)
    RX errors 0 dropped 0 overruns 0 frame 0
    TX packets 0 bytes 0 (0.0 B)
    TX errors 0 dropped 0 overruns 0 carrier 0 collisions 0
```

Here is a diagram explaining where the veth... interfaces sit in the Docker network stack. We are using the default Linux bridge docker0 in this example.

{% include figure image_path="/assets/images/docker-network-subnet-conflicts/docker-networking-structure.jpg" alt="Docker network structure diagram" caption="Photo credit: docker.com" %}

These veth... interfaces get removed when the container stops.

## Clean up networks + Linux bridges

As mentioned above the veth... interfaces get removed automatically when the container they are linked to stops.

User-defined networks are not removed when all containers using them have stopped.

### Docker Compose

If you use the [docker-compose down][2] command then it will remove networks defined in the networks section of the docker-compose.yml file:

> By default, the only things removed are:
> 
> - Containers for services defined in the Compose file
> - Networks defined in the networks section of the Compose file
> - The default network, if one is used
> 
> Networks and volumes defined as external are never removed.

### Removing manually

Remove the networks manually by either removing just the network

```
docker network rm testnet1
```

Or, you can use the more severe [system prune][3] command.

```
$ docker system prune
WARNING! This will remove:
 - all stopped containers
 - all networks not used by at least one container
 - all dangling images
 - all build cache
Are you sure you want to continue? [y/N]
```

[1]: https://success.docker.com/article/networking
[2]: https://docs.docker.com/compose/reference/down/
[3]: https://docs.docker.com/engine/reference/commandline/system_prune/

