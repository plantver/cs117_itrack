import subprocess
from pprint import pprint
import urllib3
import json
import requests
import plistlib


aps_simp = [{'BSSID': '0:27:d:ed:35:32', 'RSSI': -65, 'SSID': 'CSD-Auth'},
 {'BSSID': '98:9e:63:37:2c:7a', 'RSSI': -67, 'SSID': 'BOBBA'},
 {'BSSID': '0:27:d:99:67:c1', 'RSSI': -67, 'SSID': 'CSD-Guest'},
 {'BSSID': '9c:1c:12:86:ae:80', 'RSSI': -85, 'SSID': 'eduroam'},
 {'BSSID': '9c:1c:12:86:ae:81', 'RSSI': -84, 'SSID': 'UCLA_WIFI'},
 {'BSSID': '9c:1c:12:86:ae:82', 'RSSI': -86, 'SSID': 'UCLA_WEB'}]

ec2_addr = "13.57.182.179"
r = requests.post('http://%s:5001/locate'%(ec2_addr,), json=aps_simp)
print(r.content)
