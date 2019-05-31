---
title: "Java URL Equals Bit Me"
date: 2019-05-31
header:
  image: /assets/images/java-equals-bit-me/black-hole.png
  image_description: "Congrats to all parties involved in creating the first ever picture of a black hole"
  caption: "Photo credit: Event Horizon Telescope Collaboration"
category:
 - dev
tags:
 - java
 - jpa
 - hibernate

---

Yesterday I had a request to look in to a bug that some customers were experiencing. It was for an old project, actually the first Java application
that I had ever worked on.

## Problem
The problem was as follows.

1. Using our UI, the customer stores the location for an online image, say:
   
   ```
   www.example.com/my-image.jpg
   ```

2. The customer then later gets a new domain and updates the image location to:

   ```
   www.something-else.com/my-image.jpg
   ```

3. The customer didn't change servers or anything else, just the domain name.

Although our system responded with a 2xx response whilst saving, when retrieving the image location again, it had not updated to the new version and still referenced example.com.

## Diagnosis
Our code was pretty simple and we were pretty much just receiving the entity and validating it before then saving it. The image location was stored in a [URL][1] type field. No mutation of the data was going on and while debugging it I could see that we were sending the correct URL to the JPA Repository for storage. So it must be somewhere in JPA...nooooooo

Luckily, with a little help, it didn't take toooo long to work out what was happening and it all boiled down to the URL.equals() method. 

Essentially the ```URL.equals()``` method sees both URLs to be equal because the domains point to the same IP and the other parts are the same. It reports that during the dirty checking process so JPA thinks the URL hasn't changed and doesn't save it.

The docs for ```URL.equals``` say:
```
Two URL objects are equal if they have the same protocol, <strong>reference equivalent hosts</strong>, have the same port number on the host, and the same file and fragment of the file.

Two hosts are considered equivalent if both host names can be resolved into the same IP addresses; else if either host name can't be resolved, the host names must be equal without regard to case; or both host names equal to null.
```

So it resolves the hosts and compares the IPs! It does not matter that they are different domains. 

Also it works differently if it can't resolve the hosts (think different environments)!

## Resolution
Don't use URL.

You could use [URI][2] instead which compares object in more expected fashion. This doesn't work quite as well with JPA/Hibernate though so I needed to introduce a simple [type converter][3] which stores it as a String in the database. 

Just use a String instead and keep it really simple, with a little bit more work for validation etc.



[1]: https://docs.oracle.com/javase/7/docs/api/java/net/URL.html#equals(java.lang.Object)
[2]: https://docs.oracle.com/javase/7/docs/api/java/net/URI.html#equals(java.lang.Object)
[3]: https://thoughts-on-java.org/jpa-21-how-to-implement-type-converter/
