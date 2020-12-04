---
title: "Syncing studios remotely with RTPMIDI and Jamulus"
date: 2020-12-03
excerpt: "Want to jam with your friends remotely but still in sync! What was once a distant dream now seems to be fairly easy thanks to some great free tools."
header:
  image: /assets/images/syncing-studios-remotely-using-rtpmidi-and-jamulus/header.png
  image_description: "MIDI MIDI MIDI MIDI"
category:
 - music
tags:
 - midi
 - rtpmidi
 - jamulus
 - ableton

---

Although it's been majorly shite for a year, there have been some silver linings to come out of 2020. One of these has been a return to DJing with friends via Twitch and subsequently our new home [hearthis.at/covidcore][1].

It's been great catching up with friends and now a couple of us have stepped it up another gear by working out how to remotely sync our studios over the internet so we can jam together and just generally have fun with our kit. 

It's not that hard, the results are pretty good considering there's going to be changing latency over time between each person. Here's how it works...

<include diagram here>

There are two bits of tech involved:
1. RTPMIDI][2] - This is a protocol that allows you to create MIDI sessions that others can join remotely. Then you share the same MIDI network and can send MIDI messages to each other. It's actually been around for a while on MacOS, where it's build in, but is also now available for other operating systems too.

2. [Jamulus][3] - This free software allows all participants in a session to send their own audio to a central server (you can host your own easily) where it is merged and sent back to everyone. The idea being that you only listen to the merged audio you receive back, thus everyone can hear each other. It actually works well too.

In our sessions we both had Ableton Live open and one person was the 'master', in control of starting and stopping the session. When one person started Live it would trigger Live on the remote side. We both also have hardware and other MIDI instruments plugged in too which also get triggered. 

In Live you can use the 'MIDI Clock Sync Delay' which allows us to control the latency between us by adjusting the delay. It's not perfect and things change but you can get it pretty tight and it can stay fairly tight for a while, we're talking 30 minutes, maybe longer. YMMV depending on your internet connection, how far away from each other you are and many more factors. We are doing it from Berlin, Germany to Manchester, UK with decent results.

## How to do it

** Important - you need ethernet connections to get this working well so don't expect much if you use WIFI. I forgot about this during one session and the audio was pretty bad so I can confirm it's not worth trying. **

1. Download Jamulus and if you are not on a mac then get RTPMIDI too


1. You need to enable port forwarding on your router to allow RTPMIDI to work. Use the default port 5004(UDP) and forward it to the machine where your music will be captured.


1. If you are going to run your own Jamulus Server then you also need to open a port for that too. I ran it on a separate computer, doesn't need a sound card or to be hardcore or anything. See [the instructions][4], but essentially you just open the programme and that's it! 


1. RTPMIDI
   {% include figure image_path="/assets/images/syncing-studios-remotely-using-rtpmidi-and-jamulus/rtpmidi-setup.jpg" alt="Configure RTPMIDI session" caption="Configure RTPMIDI session" %}
   - Add all other participants in to your local directory (in the RTPMIDI interface), you'll need to know their IP address and they'll need to know yours - just look at [whatismyipaddress.com][3] in a browser and switch off VPNs first.
   - Restrict the session to 'Only computers in my Directory' to ensure that only your friends can connect via the RTPMIDI port through your router to your machine. 
   - One person creates a session and the other person tries to join it. 
   - Make sure you can see the other person in your participants list
   - On Mac at least, the session always seems to have the participant from the last session in there, so just clear it out and start fresh every time. Likely your IPs will have changed anyway so you'll need to update the directory users anyway. 
   

1. Windows only - Both Ableton and Jamulus need to access your sound card and this can be a problem for certain drivers. So our advice is to open up Ableton first using an ASIO driver and then Jamulus using directX or whatever else. On Macs this is not a problem, not sure about Linux as we are not using that this time. 
    

1. Start Jamulus (client not server)
   {% include figure image_path="/assets/images/syncing-studios-remotely-using-rtpmidi-and-jamulus/jamulus-config.jpg" alt="Configure Jamulus settings" caption="Configure Jamulus settings" %}
   - Configure the input (where you audio goes IN to you soundcard)
   - Configure the output (where the merged audio comes OUT of your soundcard and to your speakers)
   - Make sure you don't use WIFI!
   - Make sure each of you can hear the other first
   - The mixer your see in your client adjusts the audio for you only, the other person has their own mixer
   - Ensure that you are only listening to the output from Jamulus server, not your direct output
   - We used high quality sound, stereo with auto jitter control
  

1. Ableton Live
   - Person who is 'master' switches on RTPMIDI output sync
      {% include figure image_path="/assets/images/syncing-studios-remotely-using-rtpmidi-and-jamulus/live-midi-sync-output.jpg" alt="Master sets output sync on" caption="Master sets output sync on" %} 
   - Everyone else has only RTPMIDI input sync on 
      {% include figure image_path="/assets/images/syncing-studios-remotely-using-rtpmidi-and-jamulus/live-midi-sync-input.jpg" alt="Others set input sync on" caption="Others set input sync on" %}
   - Non RTPMIDI midi prefs are unaffected and can be on if needed
   - Make sure when the master starts Live, that the remote Live is triggered
   - Play some 4x4 kicks on each end and adjust rtpmidi midi latency - works from both ends, but might be more sane if only one person is adjusting it

1. Jam it up, have fun. If you are running Jamulus Server then you can also enable auto-recording which is really cool. Jamulus will save each session with each participants audio in a separate WAV file for each of their connections. It will also create a '.lof' file for Audacity, and a '.rpp' for Reaper which means all the WAV files will be arranged in the respective audio programme just like the session took place. Check the image below to see what I mean - awesome stuff Jamulus - you rock! Please support these people as this tool is great :)
{% include figure image_path="/assets/images/syncing-studios-remotely-using-rtpmidi-and-jamulus/audacity.png" alt="Session recordings organised by particpant connection - labelled with IP" caption="Session recordings organised by particpant connection - labelled with IP" %}
   
## Go Check it out!
I didn't cover everything that's available here but this is all we used so far and it's been awesome to make music with friends again. Hope this helps you out! :)





[1]: https://hearthis.at/covidcore
[2]: https://en.wikipedia.org/wiki/RTP-MIDI
[3]: https://jamulus.io/
[4]: https://jamulus.io/wiki/Running-a-Server
[5]: https://www.whatismyipaddress.com