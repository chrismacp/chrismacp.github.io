---
title: "Extract audio or video from MKV files with mkvtoolnix"
date: 2020-04-19
excerpt: "Need to extract the audio or video from one of you MKV files? This is how you do it"
header:
  image: /assets/images/extract-audio-or-video-from-mkv/header.png
  image_description: "Covid 19 virus affecting us all"
  caption: "Photo credit: www.ecdc.europa.eu/en/covid-19"
category:
 - audio
 - video
tags:
 - mkvtoolnix
 - mkv
 - flac
 - ffmpeg
 - youtube

---

I streamed a few DJ sets over the last few weeks with a bunch of friends as part of 'covidcore', an online get-together while we're all in isolation. It's been a while since I've played any DJ sets but it was great fun and thankfully I didn't make too many mistakes.

Anyway, It was my first streaming experience and I found it a breeze to set up thanks to [Twitch][1] and [OBS][2]. When reviewing my recordings I noticed that my microphone level was pretty low so I decided to bust out the audio track from the video and raise it. Also when uploading my video to Youtube I also got a copyright notice about one the clips in my video which was subsequently being blocked, so I decided to edit that out too.


Here is how you can do it.

Note: I'm on a mac so all of the instructions are for that, but apart from installation the rest should be platform agnostic.

## Steps


* Install [mkvtoolnix][3]
* Extract audio and video tracks from mkv file
* Optionally convert audio track if editing needed
* Merge audio and video tracks back in to mkv file

## Install mkvtoolnix

mkvtoolnix is a set of command line programs for finding out information and modifying mkv ("Matroska") files. You can install it with a GUI but I didn't bother. 

```bash
$ brew install mkvtoolnix
```

That's it, boom!

## Extract audio and video tracks from mkv file

For this step we are going to run this command
```bash
mkvextract tracks your-mkv-file.mkv 0:video.h264 1:audio.aac
```

In the above command we are using [mkvextract][4], part of mkvtoolnix, to extract the video track which is encoded using the 'h264' codec and also the audio track which is encoded using the AAC codec. 

In order to find out what your video and audio tracks were encoded with use the following tool
```bash
mkvinfo your-mkv-file.mkv
```

Might be good to [reference the docs][4] if you have trouble there.

## Optionally convert audio track if editing needed

My audio editor couldn't open the aac file I created so I converted it to FLAC format using [ffmpeg][5], another command line program that is insanely useful for converting audio formats (amongst other things).

So to convert I ran
```bash
ffmpeg -i audio.aac  -c:a flac audio.flac
```

Now I can open my flac file and edit the parts I want, like amplifying my microphone in the recording. 

## Merge audio and video tracks back in to mkv file

Right, now you have completed your editing we can stitch them back together again using the [mkvmerge][6] command

```bash
mkvmerge -o name-of-your-output-file.mkv video.h264 audio.flac
```

You can see I just merged the flac formatted audio back in. I just tried it and it worked. I need to read up a bit more on file formats to be honest so if you need more info [check the docs][6]. 

Hope that helps someone :)



[1]: https://www.twitch.tv/
[2]: https://obsproject.com/
[3]: https://mkvtoolnix.download
[4]: https://mkvtoolnix.download/doc/mkvextract.html
[5]: http://ffmpeg.org/documentation.html
[6]: https://mkvtoolnix.download/doc/mkvmerge.html