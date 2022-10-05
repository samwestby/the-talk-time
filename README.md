# Conversation Visualization

Link to post-meeting visualization: https://pages.github.ccs.neu.edu/westby/conversation-visualization/view/ \
Link to visualization walkthrough: https://youtu.be/2czHAxpGuKU

## Real-time visualization usage instruction

_Note_: This feature only workings on Windows. 
1) Install [OBS](https://obsproject.com/wiki/install-instructions)
2) git clone https://github.ccs.neu.edu/westby/conversation-visualization.git 
3) Change directories into conversation-visualization/Zoom-Bot directory 
5) python -m http.server 8123 
6) Open a new terminal 
7) Create and activate a virtual environment in Python3 
9) Change directories into the Zoom-Bot directory 
10) pip install -r requirements.txt 
11) python -m python_back 
12) In a file explore, navigate to \conversation-visualization\Zoom-Bot\bot and run sdk_demo_v2.exe 
13) Check _Custom UI_ and click _Set Domain_
14) Follow this tutorial to generate a Zoom SDK key and secret. _Note_: Northeastern accounts do not have permission to do this.
15) Use [this template](https://jwt.io/#debugger-io?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBLZXkiOiJZT1VSIEFQUCBLRVkiLCJpYXQiOjE2NDk4NjY4NTYsImV4cCI6MTY0OTk1MzI1NiwidG9rZW5FeHAiOjE2NDk5MjA4NTZ9.ixsmUhIPWPJNfLdGOdXVVNc1GT_mhX685Hjqpb71Di4) to generate a JWT. Go [here](https://www.epochconverter.com/) to get epoch timestamps. _iat_ is in the past, where _exp_ and _tokenExp_ should be the same and no more than two days later than _iat_.
16) Enter this JWT into the Zoom Bot App and continue
17) Enter Meeting ID and password (if applicable)
18) After you join the meeting, going into video settings and switch to OBS Virtual Camera


_Note_: This program currently cannot recognize when new users join, so make sure the Zoom Bot is the last member to join the Zoom Meeting.

