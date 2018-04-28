---
title: "Change Sky Go account on MacOS"
excerpt: "Instructions for switching user accounts in the Sky Go application on a MacOS machine"
date: 2018-03-31
header:
  image: /assets/images/neutron-collision.jpg
  caption: "Photo credit: [NASA/JPL-Caltech](https://www.jpl.nasa.gov/spaceimages/details.php?id=PIA21910)"
  
category:
 - technology
tags:
 - sky
 - skygo
 - macos

---

I recently showed someone the newest SkyGo application as they were thinking about 
getting Sky installed and they were interested in how it worked. I used my account on
their laptop and then discovered when I tried to sign out again that there was 
**no way to sign out**!! Ridiculous, I must be missing something I thought, but no they 
have done this on purpose it seems.  

[rant]It's stuff like this that made me cancel my account. Having even more adverts thrown
at me when I watch any programme is **really annoying** too, I do not pay Sky to watch adverts.[/rant]

Anyway here is how I managed to 'sign out'. You basically have to delete the app and 
config left lying around.



## Delete the Sky Go application

The application is stored in the User level Applications directory, not the main system wide 
Applications directory.

   1. Open the Sky Go Application
   2. Right click on the Sky Go app in the Dock and choose "Show in finder"
   3. Right click on the Sky Go app in the Finder window and click on "Move to trash"
   
## Delete the Sky Go application saved state

   4. Open the Finder application. 
   5. Press and hold ‘Alt’ on the keyboard and then click on "Go" in the Finder menu. You 
   should then see "Library" as an option in the list of locations
   6. Click on "Library" to open that directory
   7. Scroll through the list or use the search feature to find a folder called "Saved 
   Application State" and inside of that you should find another directory with a name containing
   "skygoplayer" which you should then right click and "Move to trash"
   
## Delete the Sky Go application config

   8. Press "cmd" + up arrow to go up one level to the "Library" folder (or see steps 4 - 7)
   9. Scroll through the list or use the search feature to find a folder called "Application 
   Support" and inside of that you should find another directory with a name containing  "Sky Go 
   Player" which you should then right click and "Move to trash". There may be more than one, I 
   deleted everything that was sky related this new app os the only thing that will be used now. 
   
## Delete the config that's left behind


   10. Press "cmd" + up arrow to go up one level to the "Library" folder (or see steps 4 - 7)
   11. Scroll through the list or use the search feature to find a folder called "Cisco" and
   inside of that you should find another directory called  "Video Guard Player" which you 
   should then right click and "Move to trash" 
   
## Empty the trash

You should empty the trash to get rid of all the content we just removed.

   12. Go to the trash can icon in the dock and right-click "Empty trash"
   
## Re-install the Sky Go application

   13. Now install Sky Go again and you should be able to sign in again once you click on 
   a programme to watch.
   
   
Hope that helps some of you.  
   




[1]: https://amzn.to/2IfoK1W
