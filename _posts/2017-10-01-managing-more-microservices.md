---
title: "Managing More Micro-services"
date: 2017-10-01
header:
  image: /assets/images/globular-cluster-IC-4499.jpg
  caption: "Photo credit: NASA/ESA"
category:
 - dev
tags:
 - microservices
 - SOA
 - jenkins
 - kibana
 - grafana
 - slack
---

When I wrote the first [post][1] on this blog I had been working on SOA and micro-services
for a short time and was managing 3 individual services with my team.

At that point, the thought of creating and managing a lot more services brought up images 
of the team spending most of it's time watching monitoring screens. Along the way though, 
we have improved how we do certain things so that we see more with less time and effort.

This post explains some of things that we have done. 

## Team monitor
We obtained a large 42" monitor which sits at one end of the team's desks. On this we display 
all the monitoring screens for all of our projects using a tab rotation plug-in to 
automatically show each one in turn. 

People are busy and do not always look at monitoring, in fact they don't always look at email
or anything else either, so making things visible can be hard.

## Slack Notifications
Something that people do tend to notice is Slack (or your text chat software of choice). As
we and most other engineering departments use text chat to perform a large percentage of
direct communicate, adding notifications there for important events does work. We have 
added notifications when:

* Jenkins builds (deployments) break
* Grafana metrics go in to alert mode (API Response times slow down)

You have to be careful with this though, if there are too many, then they start to get ignored. 

## Jenkins Pipelines
Normally for each service we had around 5/6 Jenkins jobs, some of which trigger one after
the other for a deployment. Something like: build, dockerize, test, staging, production. 
That was ~18 jobs to watch for our 3 services, but now we have 10 services and roughly 
60 Jenkins jobs.

There is a Jenkins feature called a [Pipeline][2] which allows us to combine all of the jobs
for one service deployment in to one. 

You can improve things further, Configuration as Code style, by using a [Jenkinsfile][3] 
written in Groovy to store the Jenkins pipeline deployment process in your repository 
alongside your source code.

The end result is that we now have 10 job status' to look at instead of 60. We also make 
use of the [wall display plug-in][4] on our large team monitor to make add even more
visibility.


## Kibana Filtering
With an error, access and info log for each service there is a lot of logging to look keep
your eyes on. At first I kept a browser tab open for each service's error log so I could 
quickly check it regularly. With the increase in number of services this wasn't going to 
work. 

Now I use one single Kibana page and have created a filter for each of the following:

"type: <project-name>" (for each of the service)
"tags: <log-type>" (for each of the log types)

Then in the Kibana UI I can quickly switch on and off the project and log type I want to 
look at. This means just keeping one tab open and having the flexibility to get what I 
want fast. 

[1]: http://chrismacpherson.net/dev/microxchange-berlin/
[2]: https://jenkins.io/doc/book/pipeline/
[3]: https://jenkins.io/doc/book/pipeline/jenkinsfile/
[4]: https://wiki.jenkins.io/display/JENKINS/Wall+Display+Plugin