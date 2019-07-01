# SFDC LEX Video Commenter
### Things this is: OpenSource, Free. 
### Things this isn't: Fully tested/supported in any way. It works, but you should work with it.

## Ramblin's

Alright, so what we've got here is a LEX component that uses an HTML Video component to pull in a remote site's streamable video, and allows users to make comments that then take in the timecode. When viewing the comments, a user can click a timecode, and be taken to the representative point in the video.

You need an external video storage/transcoding/playback solution to do this. I recommend Ziggeo.com for it, super simple to get started via the Heroku Elements marketplace. Basically, if you have a secure URL that can be given to an HTML Video element and the element can play the video, you're probably good to go. 

## Setup

Get an org
Deploy the code


## Walkthrough of the things

## ToDo / Asks
* Man I need to style this better. Like deal with responsiveness.
* A v2 would probably also incorporate full on shapes/images on a per timecode basis to overlay with the video. Do proper annotations. Would need a canvas thing here, bunch of other bits I'm sure.