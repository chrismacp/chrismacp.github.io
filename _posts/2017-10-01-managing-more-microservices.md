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

When I wrote the initial [post][1] on this blog I had been working on micro-services
for a short time and was managing 3 individual services with my team.

At that point, the thought of creating and managing many more services brought up images 
of the team spending most of it's time watching monitoring screens. Along the way though, 
we have improved how we do certain things so that we see more with less time and effort.

Engineers are busy and do not always look at monitoring, in fact they don't always look 
at email or anything else either, so making things visible can be hard. This post 
explains some of the steps we have taken to improve this. 

## Team Monitor
We obtained a large 42" monitor which sits at one end of the team's desks. On this we have
a browser in full screen mode and a tab rotation plug-in which automatically rotates 
through the following for each service:

Jenkins jobs, Sonar code metrics, Grafana dashboard, Kibana error logs

## Slack Notifications
Something that people do tend to keep eyes on is Slack (or your text chat software of 
choice). As we and most other engineering departments use text chat to perform a large 
percentage of direct communication, adding notifications there for important events does 
work. We have added notifications when:

* Jenkins builds (deployments) break
* Grafana metrics go in to alert mode (API Response times slow down)

You have to be careful with this though, if there are too many, then they start to get 
ignored, or engineers get unhappy with the distraction caused.

## Jenkins Pipelines
Normally for each service we had around 5/6 Jenkins jobs, some of which trigger one after
the other for a deployment. Something like: build, dockerize, test, staging, production. 
That was ~18 jobs to watch for our 3 services, but now we have 10 services and roughly 
60 Jenkins jobs.

There is a Jenkins feature called a [Pipeline][2] which allows us to combine all of the jobs
for one service deployment together in to one job. 

You can improve things further, Configuration as Code style, by using a [Jenkinsfile][3] 
written in Groovy to store the Jenkins pipeline deployment process in your repository 
alongside your source code. Nice!

The end result is that we now have 10 job status' to look at instead of 60. We also make 
use of the [wall display plug-in][4] on our large team monitor to add even more
visibility.


## Kibana Filtering
With an error, access and info log for each service there is a lot of logging to keep
your eyes on. At first I kept a browser tab open for each service's error log so I could 
quickly check it regularly. With the increase in number of services this wasn't going to 
work. 

Now I use one single Kibana page and have created a filter for each of the following:

"type: &lt;service-name&gt;" (for each of the services)

"tags: &lt;log-type&gt;" (for each of the log types)

Then in the Kibana UI I can quickly toggle the service and log type that I want to 
look at. This means keeping just one tab open but having the flexibility to get what I 
want fast. 

[1]: http://chrismacpherson.net/dev/microxchange-berlin/
[2]: https://jenkins.io/doc/book/pipeline/
[3]: https://jenkins.io/doc/book/pipeline/jenkinsfile/
[4]: https://wiki.jenkins.io/display/JENKINS/Wall+Display+Plugin
