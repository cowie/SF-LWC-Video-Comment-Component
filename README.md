# SFDC LEX Video Commenter
### Things this is: OpenSource, Free. 
### Things this isn't: Fully tested/supported in any way. It works, but you should work with it.
### Status: Eh, can't hurt to play with, enjoy. 
## Ramblin's

Alright, so what we've got here is a LEX component that uses an HTML Video component to pull in a remote site's streamable video, and allows users to make comments that then take in the timecode. When viewing the comments, a user can click a timecode, and be taken to the representative point in the video.

I've used a bare bones custom object to represent the Video itself (`Video__c`), with a child object (`Video_Comment__c`) as the holder for all comments. The component is as is to be dropped onto the `Video__c`'s layout, and it will pull from the `Video_URL__c` field on it. 

Salesforce Content/Attachment doesn't support streaming playback, nor transcoding afaict. This means you'll need an external video storage/transcoding/playback solution to work with this. As an easy testing asset, I used Ziggeo.com, available on the Heroku Elements marketplace, but you can use anything you can get a secure URL from to give to a standard HTML Video element. Keep in mind this isn't the same as an HTTPS download link, it's technically a data:// link in the background. 

Additionally, this is just the commenter component itself. It's not doing the work of video ingestion or mapping, so you'd likely set up a webhook on your video storage medium upon video upload to send a message to Salesforce to create the requisite `Video__c` record for you to reference back to. 

## Setup

* `git clone this`
* `sfdx force:org:create -s -a YOURALIASHERE -f config/project-scratch-def.json` (or your favorite orgshape, there isn't anything major needed for this)
* `sfdx force:source:push`
* `sfdx force:user:permset:assign VideoReviewPerms`

* Create a `Video__c` record for yourself. Put the URL to your accessible video stream in the `Video_URL__c` field. Amaze yourself how it doesn't work, yell at me.
* Really - create a CSP record for your endpoint you're serving videos from! Then yer videos should work.

## But what would I need to do to make this real, man?

So first, the styling could use some work. 

Second, you'll need the overall workflow of creating videos to be added, right? If you're just living in SFDC, you could create a second component to create/send new videos up to your storage medium of choice and return back the URL to it. You might have another portal that does video ingestion, you might have a pre-existing library, I don't know your life. But basically, you need 'something' to create more `Video__c` records for you going forward.

Next, you could probably add some more testing into the component. Good news is it's 90% client side rendering changes, and only 10% writing data, and that 10% is pretty basic. Get page's recordID, relate child object to it, rinse, repeat. This means the testing and failure points should be pretty minimal, UX stuff.

## What can I learn from this sucker?
###Video Component Controller
* Note the two functions doing basically the same thing. You might be like - what do? So reason here is I wanted to remove the cache from the call that happens when a new comment is inserted, to update. I could have just not touched the server, and instead just edited the local comment list object in client memory, but then you're losing out on any changes others are making. You can't remove the cache from a method wired into a property, so we have one wire version, and one imperative version. Fun times!
### JS controller
* wiredVideoRecord and getVideoComments show you wiring both an LDS standard function as well as a custom Apex one. Note the imports on lines 5 and 8. Also, note the specificity in passing variables here. Both take in objects, named against the variables in the Apex method, js variable is prepended by `$` and named as a string, not in `this.variable` format. The field being passed in line 27 is gained from line 6's import - but as a string, this iirc renders out to `Video__c.Video__URL__c`, so you *could* pass the thing dynamically/statically if you wanted by following that `object.field` notation. 
* Line 87 shows calling the LDS create function, passing the object's API Name, brought in from imports above, and then handling the outcome as a promise with then/catch statements. Line 90 shows daisychaining into the imperative comment query as well. Note that calling the imperative uses `this.recordId`, instead of `'$recordId'`. Fun things.
* I started to use toasts, then got lazy. They *should* work though, lol.

## ToDo / Asks
* Man I need to style this better. Like deal with responsiveness. I just made it a simple 640/480 ratio. Would make things rough on mobile with new Mobile Lex. 
* A v2 would probably also incorporate full on shapes/images on a per timecode basis to overlay with the video. Do proper annotations. Would need a canvas thing here, bunch of other bits I'm sure.
* I kinda like the idea of tying it to Chatter instead of its own comment object, but couldn't think through a creative way to do so.