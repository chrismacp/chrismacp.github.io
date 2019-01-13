---
title: "VPN: Configuring the MTU setting"
excerpt: "Misconfiguration of the MTU can cause problems and even stop it working so getting it right is important"
date: 2019-01-13
header:
  image: /assets/images/configure-vpn-mtu/header.jpg
  caption: "Photo credit: [CNSA](http://www.cnsa.gov.cn/n6758823/n6758844/n6760026/n6760035/c6805183/content.html)"
toc: true
toc_label: "Quicklinks"
toc_icon: "cog"
category:
 - dev
tags:
 - vpn
 - openvpn
 - mtu

---

Finding an apartment in Berlin is hard and I had to switch between many before finding a permanent 
contract. A few times during this process I found that my VPN stopped working after moving to a 
new apartment. It took a little bit of investigation but I found the culprit to be the MTU
setting. It turns out that misconfiguration of the MTU can cause problems and even stop requests 
working so getting it right is important. 

## Symptoms

I was seeing a few different things happening:
* Nothing loading over the internet at all
* Just the page title loading
* Really slow connection

## What is an MTU?
MTU stands for [Maximum Transmission Unit][1] and can be thought of as the largest packet size 
that can be sent from your computer over the network to it's destination. During the packet's 
journey if it encounters a hop that can't process it's size then it will be [fragmented][2] 
or dropped - in which case an ICMP message "Destination Unreachable (Datagram Too Big)" will be 
returned. 
 
The MTU can be discovered via the 'Path MTU Discovery' technique. This involves sending out a packet
with the DF (Don't Fragment) IP header set. This means that any hop that can't support the packet size
will have to return the ICMP message. The process is repeated until the smallest successful packet 
size is found. (See below for how we will do this manually).
 

## Standard MTU sizes 

Different network protocols and layers can handle different MTUs so your mileage may vary depending 
on your ISP and whether you are using IP4/IP6. Here is a table from wikipedia on the subject:


| Media for IP transport | Maximum transmission unit (bytes) | Notes |
|---+---+---|
| Internet IPv4 path MTU     | At least 68, max of 64 KiB | Practical path MTUs are generally higher. Systems may use Path MTU Discovery to find the actual path MTU. Routing from larger MTU to smaller MTU causes IP fragmentation.|
| Internet IPv6 path MTU     | At least 1280, max of 64 KiB, but up to 4 GiB with optional jumbogram |	Practical path MTUs are generally higher. Systems must use Path MTU Discovery to find the actual path MTU. |
| Ethernet v2	             | 1500                | Nearly all IP over Ethernet implementations use the Ethernet V2 frame format.|
| Ethernet with LLC and SNAP | 1492                | |
| Ethernet jumbo frames	     | 1501 – 9198 or more | The limit varies by vendor. For correct interoperation, the whole Ethernet network (segment) must support the same maximum frame size. Jumbo frames are usually only seen in special-purpose networks.|
| PPPoE v2	                 | 1492                | Ethernet v2 MTU (1500) less PPPoE header |
| DS-Lite over PPPoE	     | 1452	               | Ethernet v2 MTU (1500) less PPPoE header (8) and IPv6 header |
| PPPoE jumbo frames	     | 1493 – 9190 or more | Ethernet Jumbo Frame MTU (1501 - 9198) less PPPoE header |
| WLAN (802.11)              | 2304                | The maximum MSDU size is 2304 before encryption. WEP will add 8 bytes, WPA-TKIP 20 bytes, and WPA2-CCMP 16 bytes. |
| Token Ring (802.5)	     | 4464	               | |
| FDDI	                     | 4352                | |	


## Working out the MTU

As described above we will perform a 'Path MTU Discovery' manually 
(for more details on the technique check out [RFC1191 - IPv4][3], [RFC1981 - IPv6][4]). To do this we will use ping to
send some packets out with the DF (Don't Fragment) option set and a fixed packet size. We will start
from the Ethernet v2 standard (1500) from the table above as this should cover all ISPs, and reduce 
the packet size by 10 until we get a successful response.

Here is the command we will use (I'm using MacOS here - check your distro for how to set the DF 
option):
```
$ ping -D -v -s 1500 -c 1 google.com

```

Here is how our discovery went:
```
⇨ ping -D -v -s 1500 -c 1 google.com
PING google.com (216.58.210.46): 1500 data bytes
ping: sendto: Message too long

--- google.com ping statistics ---
1 packets transmitted, 0 packets received, 100.0% packet loss
/
⇨ ping -D -v -s 1490 -c 1 google.com
PING google.com (216.58.210.46): 1490 data bytes
ping: sendto: Message too long

--- google.com ping statistics ---
1 packets transmitted, 0 packets received, 100.0% packet loss
/
⇨ ping -D -v -s 1480 -c 1 google.com
PING google.com (216.58.210.46): 1480 data bytes
ping: sendto: Message too long

--- google.com ping statistics ---
1 packets transmitted, 0 packets received, 100.0% packet loss
/
⇨ ping -D -v -s 1470 -c 1 google.com
PING google.com (216.58.210.46): 1470 data bytes
72 bytes from 216.58.210.46: icmp_seq=0 ttl=53 time=275.188 ms
wrong total length 92 instead of 1498

--- google.com ping statistics ---
1 packets transmitted, 1 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 275.188/275.188/275.188/0.000 ms
```

So my MTU was 1470 after the last request was successful. You may have noticed the 'wrong total 
length' message ping gave me. This is due to Google sending back a small response. The request was
successful though. 

## OpenVPN Configuration

The OpenVPN documentation states:

```
"MTU problems often manifest themselves as connections which hang during periods of active usage.
 
It’s best to use the –fragment and/or –mssfix options to deal with MTU sizing issues."
``` 
... and ...
```
"Both –fragment and –mssfix are designed to work around cases where Path MTU discovery is broken on 
the network path between OpenVPN peers.
```
The usual symptom of such a breakdown is an OpenVPN connection which successfully starts, but 
then stalls during active usage."

We are using UDP protocol on our tunnel so we are going to use the mssfix option in our OpenVPN 
config file to reduce the packet size to fit within our MTU.

The [manual][5] states:
```
–mssfix max
Announce to TCP sessions running over the tunnel that they should limit their send packet sizes 
such that after OpenVPN has encapsulated them, the resulting UDP packet size that OpenVPN sends 
to its peer will not exceed maxbytes. The default value is 1450.The max parameter is interpreted 
in the same way as the –link-mtu parameter, i.e. the UDP packet size after encapsulation overhead 
has been added in, but not including the UDP header itself. Resulting packet would be at most 
28 bytes larger for IPv4 and 48 bytes for IPv6 (20/40 bytes for IP header and 8 bytes for UDP 
header). Default value of 1450 allows IPv4 packets to be transmitted over a link with MTU 1473 or 
higher without IP level fragmentation. 
```

This suggests we need to take in to account the UDP header bytes. So 1470 - 28 (for IPv4) = 1442.

Incidentally I did check if the default setting for mssfix of 1450 which works with MTU of 1473
pass our 'Path MTU Discovery'. It didn't. 

So I've added ```--mssfix 1442``` to my OpenVPN config and it's working fine for the moment :)



This article uses material from the Wikipedia article 
<a href="https://en.wikipedia.org/wiki/Maximum_transmission_unit">"Maximum transmission unit"</a>, 
which is released under the <a href="https://creativecommons.org/licenses/by-sa/3.0/">Creative 
Commons Attribution-Share-Alike License 3.0</a>.

[1]: https://en.wikipedia.org/wiki/Maximum_transmission_unit
[2]: https://en.wikipedia.org/wiki/IP_fragmentation
[3]: https://tools.ietf.org/html/rfc1191
[4]: https://tools.ietf.org/html/rfc1981
[5]: https://openvpn.net/community-resources/reference-manual-for-openvpn-2-4/
