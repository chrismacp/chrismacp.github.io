---
title: "MicroXchg - Berlin"
header:
  image: /assets/images/Calabash_HubbleSchmidt_1280.jpg
category:
  dev
tags:
  - microservices
  - SOA
  - conference
  - Berlin
---

MicroXchg Conference, Berlin

18th February 2017

This was my first time at the MicroXchg conference in Berlin. All the talks were
focussed on [microservices](https://en.wikipedia.org/wiki/Microservices) and as my company is migrating towards a 
[Service Oriented 
Architecture](https://en.wikipedia.org/wiki/Service-oriented_architecture)
 it was a great chance to listen to the experiences from other companies. 

One of the main feelings that I am getting after seeing all the talks is that going 
the microservices route is expensive in many respects. Increasing the number of 
individual services/projects (some talked about 800!), each with their own 
infrastructure, source control, build pipeline, monitoring, documentation, issue 
tracker etc. costs more financially of course but there are other costs too.

As an engineer, if you personally need to work on 15 microservices then that probably means 
having to flip between all the various tools for each service in order to keep an eye on 
them. You do monitor your work right? This could easily become information overload 
reducing your productivity. Currently my team is responsible for 3 services and this 
is not so much of a problem, but I probably wouldn’t want to increase that number a 
lot higher if I still want to be able to function as someone who actually does 
development rather than just monitoring existing projects. 

This is not to say that doing microservices is not worth the effort or expense, it’s
 just something that I certainly never thought too much about previously, but will be in the 
 future. Seeing the number of services that some companies manage, it must be something 
 they have had to think about for sure!

Phil Webb’s [talk](https://www.youtube.com/watch?v=61ym_VES6qg) about [Atomist](http://docs.atomist.com/) 
is one potential solution aimed at the information overload issue. It allows you to be 
informed about the vital, timely information from your services via Slack, without Slack 
being overused, notifying you about every commit made to the repo for example. 

I have already noticed some team Slack channels spurting out notifications for every 
change to a JIRA ticket status and others spewing Jenkins build changes for all environments. 
You can hardly see the actual chatter any more! I think it pays to be much more selective and
think about which notifications you *really* need. For the moment, I am sticking with production 
Jenkins build results and important [Grafana alerts](http://docs.grafana.org/alerting/rules/)
(yes it has alerting now in v4!). I'll see how it progresses from there.

You can check out all the videos from the conference [on YouTube](https://www.youtube.com/channel/UCGCbB8TPtYMQmJwYVogcPjg)
