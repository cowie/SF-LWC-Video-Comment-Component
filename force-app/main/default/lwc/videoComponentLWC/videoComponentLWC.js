//to do - refix how you pull in the field for the URL.
//to do - decompose down to Video component and activity feed component and set up eventing
import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getFieldValue, createRecord, getRecord } from 'lightning/uiRecordApi';
import VIDEO_URL_FIELD from '@salesforce/schema/Video__c.Video_URL__c';
import VIDEO_COMMENT_OBJECT from '@salesforce/schema/Video_Comment__c';
import getVideoComments  from '@salesforce/apex/videoComponentController.getVideoComments';
import imperativeVideoComments from '@salesforce/apex/videoComponentController.imperativeVideoComments';

function formatTimestamp(timeInSeconds){
    let hours, minutes, seconds;
    seconds = timeInSeconds % 60;
    minutes = ((timeInSeconds % 3600) - seconds) / 60;
    hours = (timeInSeconds - seconds - (minutes * 60)) / 3600;
    return (`[${hours.toString()}:${minutes.toString()}:${seconds.toPrecision(4).toString()}]`);
}

export default class VideoComponentLWC extends LightningElement {
    @api recordId;
    @track videoTiming;
    @track newComment = '';
    @track commentsList;
    @track apexError;
    @api videoURL;
    
    @wire(getRecord, {recordId: '$recordId', fields:[VIDEO_URL_FIELD]})
    wiredVideoRecord({error, data}){
        if(data){
            this.videoURL = data.fields.Video_URL__c.value;
            const src = document.createElement('source');
            src.setAttribute('src', this.videoURL);
            const vid = document.createElement('video');
            vid.setAttribute('width', '640');
            vid.setAttribute('height', '480');
            vid.setAttribute('controls', '');
            vid.appendChild(src);
            const vidHolderDiv = this.template.querySelector('.videoHolder');
            vidHolderDiv.appendChild(vid);
        }else if(error){
            let message= 'Something blew up';
            if(Array.isArray(error.body)) { 
                message = error.body.map(e => e.message).join(', ');
            }else if (typeof error.body.message === 'string'){
                message = error.body.message;
            }
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'ASPLOSION',
                    message, 
                    variant: 'error',
                }),
            );
        }
    }

    @wire(getVideoComments, {videoID:'$recordId'} ) 
    wiredComments({error, data}) {
        if(data){
            console.log(data); 
            this.commentsList = data;
            this.apexError = undefined;
        }else if(error){
            this.apexError = error;
            this.commentsList = undefined;
        }
    }

    gotoTimecode(event){
        const timecodeTarget = event.target.dataset.timecode;
        const videoElement = this.template.querySelector('video');
        
        videoElement.pause();
        videoElement.currentTime = timecodeTarget;
        
    }

    commentChange(event){
        this.newComment = event.target.value;
    }

    submitComment(){ 
        const videoElement = this.template.querySelector('video');
        //console.log(`${formatTimestamp(videoElement.currentTime)} - ${this.newComment}`);
        
        const newCommentRec = { apiName: VIDEO_COMMENT_OBJECT.objectApiName, fields: {Video__c: this.recordId, Time_In_Seconds__c: videoElement.currentTime, Timecode__c: formatTimestamp(videoElement.currentTime), Comment_Body__c: this.newComment}};
        createRecord(newCommentRec)
            .then(comment => {
                
                imperativeVideoComments({videoID: this.recordId})
                    .then(result => {
                
                        this.commentsList = result;
                        this.apexError = undefined;
                        this.newComment = '';
                    })
                    .catch(error => {
                        let message= 'Something blew up';
                        if(Array.isArray(error.body)) { 
                            message = error.body.map(e => e.message).join(', ');
                        }else if (typeof error.body.message === 'string'){
                            message = error.body.message;
                        }
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'ASPLOSION',
                                message, 
                                variant: 'error',
                            }),
                        );
                    });
            })
            .catch(error => {
                let message= 'Something blew up';
                        if(Array.isArray(error.body)) { 
                            message = error.body.map(e => e.message).join(', ');
                        }else if (typeof error.body.message === 'string'){
                            message = error.body.message;
                        }
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'ASPLOSION',
                                message, 
                                variant: 'error',
                            }),
                        );
            });
        
    }
}