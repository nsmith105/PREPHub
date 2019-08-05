# to install tweepy
# install python 3.7
# add python to system variables (https://github.com/BurntSushi/nfldb/wiki/Python-&-pip-Windows-installation)
# pip install tweepy from github: ' pip install git+https://github.com/tweepy/tweepy '

import tweepy
from tweepy import OAuthHandler
import requests
import datetime
import json

consumer_key = 'sefz1DdoW3BHgikV2aGGhFSFA'
consumer_secret = 'm4qooBtOxfy13Fsxiv6LhJdd62P4FEjc4PVq8ysNZeM4lbqSHP'
access_token = '1146522460692443136-gtRo2z6v2lrF4tSObuIOV2DOMuvJZo'
access_secret = 'mYWpWdvRXuoj320Aor0Dm4FXD2pnrgq3bxfed2VVaV6Z6'

def get_tweets(username): 
    # Authorization to consumer key and consumer secret
    auth = OAuthHandler(consumer_key, consumer_secret)

    # Access to user's access key and access secret
    auth.set_access_token(access_token, access_secret)

    # Calling api
    api = tweepy.API(auth)

    # 10 tweets to be extracted
    num_tweets = 7
    #Empty Array
    tmp=[]
    tweets = tweepy.Cursor(api.user_timeline,id = username,tweet_mode = 'extended').items(num_tweets)
    # create array of tweet infomation: username, tweet id,
    # date/time, text
    temp = {}
    for status in tweets:
        # Appending tweets to the empty array tmp
        tweet = status.full_text
        t = status.created_at
        t = t.strftime("%B") + ', ' + str(t.day)
        x = '{ "text":' + "\"" + str(tweet) + "\"" + ',"time":' + "\"" + str(t) + "\"" + '}'
        temp["text"] = str(tweet)
        temp["date"] = str(t)
        x = json.dumps(temp)
        tmp.append(json.loads(x))
    return tmp

if __name__ == '__main__':
    # Here goes the twitter handle for the user
    # whose tweets are to be extracted
    tweetArray = get_tweets("Portland_State")
    API_ENDPOINT = 'http://localhost:8080/twitter'
    # sending post request and saving response as response object
    r = requests.post(url = API_ENDPOINT, json=({'tweets':tweetArray}))