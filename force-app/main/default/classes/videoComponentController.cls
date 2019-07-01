public with sharing class videoComponentController {
    
    @AuraEnabled(cacheable=true)
    public static List<Video_Comment__c> getVideoComments(string videoID){
        
        List<Video_Comment__c> videoCommentList = [select id, createdBy.Name, comment_body__c, timecode__c, Time_in_seconds__c from video_comment__c where video__c = :videoID order by Time_in_seconds__c asc];
        return videoCommentList;
    }

    @AuraEnabled
    public static List<Video_Comment__c> imperativeVideoComments(string videoID){
        
        List<Video_Comment__c> videoCommentList = [select id, createdBy.Name, comment_body__c, timecode__c, Time_in_seconds__c from video_comment__c where video__c = :videoID order by Time_in_seconds__c asc];
        return videoCommentList;
    }
}
