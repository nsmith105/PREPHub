#Python code to illustrate parsing of XML files 
# importing the required modules 
import csv 
import requests 
import xml.etree.ElementTree as ET 
from time import gmtime, strftime
import time
from datetime import datetime
import datetime as dt
import requests
import json
import re
import urllib

def loadRSS(): 
  
    # url of rss feed 
    url = 'http://rss.blackboardconnect.com/239300/PSUAlert/feed.xml'
  
    # creating HTTP response object from given url 
    resp = requests.get(url) 
  
    # saving the xml file 
    with open('PSU-RSS-Feed.xml', 'wb') as f: 
        f.write(resp.content) 

def parseXML(xmlfile): 
  
    # create element tree object 
    tree = ET.parse(xmlfile) 
  
    # get root element 
    root = tree.getroot() 
  
    # create empty list for news items 
    newsitems = [] 
  
    # iterate news items 
    for item in root.findall('./channel/item'): 
        # empty news dictionary 
        news = {} 
        # iterate child elements of item 
        for child in item: 
            # special checking for namespace object content:media 
            if child.tag == 'description': 
                news['description'] = child.text
            if child.tag == 'pubDate': 
                news['pubDate'] = child.text
  
        # append news dictionary to news items list 
        newsitems.append(news) 
      
    # return news items list 
    return newsitems 

def timeSinceRSSPost(pubDate):
    pubDate = pubDate[5:] # get rid of day of week
    # determine if date is within last 24 hours
    # curTime = time.strftime("%a, %d %b %Y %H:%M:%S %p %Z", time.localtime())
    HMS = '%d/%m/%Y %H:%M:%S'
    curTime = time.strftime("%d/%m/%Y %H:%M:%S", time.localtime())

    month = ""
    month_dict = {"Jan":1,"Feb":2,"Mar":3,"Apr":4, "May":5, "Jun":6,"Jul":7,"Aug":8,"Sep":9,"Oct":10,"Nov":11,"Dec":12}
    for k in month_dict.keys():
        if(k in pubDate):
            month = k
    pubDate = pubDate.replace(month,str(month_dict[month]).zfill(2))
    pubDate = pubDate.split(' ')
    pubDate = pubDate[0] + '/' + pubDate[1] + '/' + pubDate[2] + ' ' + pubDate[3]
    return datetime.strptime(curTime,HMS) - datetime.strptime(pubDate,HMS) 

def parseForEmergency(RSSAlert):
    if(len(RSSAlert) == 0):
        return False
    alertlist = ['PSU Alert: Police activity near', 'remains closed as part of Portland Police investigation', 
    'Police investigation occurring in the area of',
    "Due to inclement weather"]
    for alert in alertlist:
        if(alert in RSSAlert):
            return True
    return False


def main(): 
    # load rss from web to update existing xml file 
    loadRSS() 
    
    # Files
    testFeed = 'psufeed.xml'
    PSUFeed = 'PSU-RSS-Feed.xml'

    # parse xml file to return news feed
    newsitems = parseXML(testFeed) 
    
    # parse news feed looking for emergency alerts
    for dic in newsitems:
        # get description of event and date it was published
        desc = dic['description']
        pubDate = dic['pubDate']
        timeSinceLastRSS = timeSinceRSSPost(pubDate)
        activeEmergency = parseForEmergency(desc) # bool that determines if there is an active emergency on PSU campus
        # if there is an active emergency and the time post has been updated in the last 24 hours, send request to put
        # PREPHub into emergency mode
        if(activeEmergency == True and timeSinceLastRSS > dt.timedelta(hours=1)):
            # defining the api-endpoint
            # API_ENDPOINT = 'https://prephub-team-d.appspot.com/'
            # need front end to create new socket to recieve twitter feed
            API_ENDPOINT = 'https://prephub-web.appspot.com/activeEmergency'
            # sending post request and saving response as response object
            r = requests.post(url = API_ENDPOINT, json=({'on':activeEmergency}))
                    
    
if __name__ == "__main__": 
    # calling main function 
    main() 