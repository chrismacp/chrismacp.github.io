---
title: "Learn to make music with Javascript"
header:
  image: /assets/images/waves.png
category:
 - music
 - dev
 
tags:
 - javascript
 - "web-audio-api"
 - "futurelearn"
---

I've often wanted to start creating music with code but have never bitten the bullet and tried. 
Usually because I have 3 other web projects in progress (note to self, must finish things!).

Today while checking my mail I noticed an email from FutureLearn which is an online learning 
platform that I have completed a few courses on, with a range of topics such as [Moons](https://www.futurelearn.com/courses/moons/), 
[Leading a Team](https://www.futurelearn.com/courses/leading-a-team) and
[Electrify: An Introduction to Electrical and Electronic Engineering](https://www.futurelearn.com/courses/electrify/).

The name of this new (to me at least) course is 
[Learn to Code Electronic Music Tools with Javascript](https://www.futurelearn.com/courses/electronic-music-tools)
and it caught my attention straight away. I'm fairly versed in JavaScript and knew of the 
[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) but have never checked it out properly. 

I have also been recently interested in learning about analogue synthesis from scratch to get a better understanding of 
what I'm doing on my hardware or software music tools, so this course seemed to fit the bill without me needing to learn 
a new language or use more complicated tools. It's JavaScript after all!

I've spent a few hours on the course now and built a mouse controlled thermin, a keyboard controlled oscillator and an 
additive synth. you can try out my latest right here and now! Click in the red box below and then press any keys to 
create new oscillators and space bar to fade them out. 


<div style="background-color:red; height:50px"
    tabindex="1"
    onkeydown="parseControls(event.key)">
</div>

<script>
    var audioContext = window.AudioContext || window.webkitAudioContext;
    var audContext = new audioContext();
    
    var oscillators = [];
    var amps = [];
    
    function playSynth() {
        var osc = audContext.createOscillator();
        var amp = audContext.createGain();
        amp.gain.value = 0.05;
        osc.frequency.value = Math.random() * 500;
        
        // Store references to these so we can fade/stop them later
        oscillators.push(osc);
        amps.push(amp);
        
        osc.connect(amp);
        amp.connect(audContext.destination);
        osc.start();
    }
    
    function fadeOut(seconds) {
        var now = audContext.currentTime;
        for (var i = amps.length - 1; i>=0; i--) {
            amps[i].gain.linearRampToValueAtTime(0, now + seconds);
        }
        setTimeout(stopSynth, seconds * 1000);
    }
    
    function stopSynth() {
        for (var i = oscillators.length - 1; i>=0; i--) {
            oscillators[i].stop();
        }
    }
    
    function parseControls(key) {
        switch(key) {
            case " ":
                fadeOut(5);
                break;
            default:
                playSynth();
        }
    }

    
</script>

<br />
<br />
Here is the code for the example I mentioned above:

```
<div style="background-color:red; height:50px"
         tabindex="1"
         onkeydown="parseControls(event.key)">
</div>

<script>
    
    var audioContext = window.AudioContext || window.webkitAudioContext;
    var audContext = new audioContext();
    
    var oscillators = [];
    var amps = [];
    
    function playSynth() {
        var osc = audContext.createOscillator();
        var amp = audContext.createGain();
        amp.gain.value = 0.05;
        osc.frequency.value = Math.random() * 500;
        
        oscillators.push(osc);
        amps.push(amp);
        
        osc.connect(amp);
        amp.connect(audContext.destination);
        osc.start();
    }
    
    function fadeOut(seconds) {
        var now = audContext.currentTime;
        for (var i = amps.length - 1; i>=0; i--) {
            amps[i].gain.linearRampToValueAtTime(0, now + seconds);
        }
        setTimeout(stopSynth, seconds * 1000);
    }
    
    function stopSynth() {
        for (var i = oscillators.length - 1; i>=0; i--) {
            oscillators[i].stop();
        }
    }
    
    function parseControls(key) {
        switch(key) {
            case " ":
                fadeOut(5);
                break;
            default:
                playSynth();
        }
    }

    
</script>
```

I'd encourage anyone to try the course, it starts off at an easy level with little experience required and it's
impressive how you can start generating quality sounds so quickly.  




