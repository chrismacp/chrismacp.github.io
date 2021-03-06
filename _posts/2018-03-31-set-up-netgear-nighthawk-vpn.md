---
title: "Setting up VPN on Netgear's Nighthawk Router"
excerpt: "Instructions for setting up your own VPN on a Netgear Nighthawk router and connecting to it from MacOS"
date: 2018-03-31
header:
  image: /assets/images/change-sky-go-account/header.jpg
  caption: "Photo credit: [NASA](https://www.nasa.gov/sites/default/files/images/344198main_EC90-357-06_full.jpg)"
  
category:
 - technology
tags:
 - netgear
 - nighthawk
 - vpn
 - network
 - tunnelblick
 - mac

published: false
---

I recently moved overseas and decided to start using the VPN service on my [Netgear Nighthawk R7000][1]
router which I still have access to in the U.K. I have never set a VPN up before and although it wasn't
as straight forward as I hoped, I got it working without too much hassle. Here's how you do it:

## Enable VPN on the router

First you need to determine if you need a dynamic DNS service set up. If you don't have a static
IP from your ISP then you probably do, otherwise you will have to reconfigure the VPN every time 
the IP changes. Even though my IP doesn't change very often on Virgin Media I decided to go ahead
and set one up as it means you can use a more memorable domain/hostname which is useful.

In order to do this go to the Advanced tab and then in the 'Advanced Setup' menu, choose
'Dynamic DNS'.

{% include figure image_path="/assets/images/set-up-vpn/goto-dynamic-dns.gif" alt="Set up dynamic DNS" caption="Set up dynamic DNS" %}

## Set up VPN client software


[1]: https://amzn.to/2IfoK1W
