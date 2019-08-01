#Python code to illustrate parsing of XML files 
# importing the required modules 
import csv 
import requests 
import xml.etree.ElementTree as ET 

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

def main(): 
    # load rss from web to update existing xml file 
    loadRSS() 
    
    # Files
    testFeed = 'psufeed.xml'
    PSUFeed = 'PSU-RSS-Feed.xml'

    # parse xml file 
    newsitems = parseXML(testFeed) 
    print(newsitems)
    # store news items in a csv file 
    # savetoCSV(newsitems, 'topnews.csv') 
      
      
if __name__ == "__main__": 
  
    # calling main function 
    main() 

