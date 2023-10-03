# rate-limiter

Rate limiter is used to limit the no of requests or calls made from a source so that the server could be prevented from malicious attacks etc.

Installation of projects:
To run this project, kindly install the below mentioned modules wusing commands:
1. express :  npm install express
2. dotenv : npm install dotenv

To run the project, use the command : npm run main.js


Working:

This project contains two api endpoints /api1 and /api2. When the same source hits this api, this coun of network calls corresponding to source is increased. After a specific limit, the network calls will no longer be permitter thoring error 429 which signifies too many request. After a specific period of time, source will be able to execute the api again.

Configuration:
All the configuration are defined in a .env file. 

RATE_LIMIT_WINDOW_SEC signifies the window after which the request are again permitted (in second)
RATE_LIMIT_MAX_REQUESTS signifies the number of request allowed in the specific window  (count like 100,10 etc)
API_PROCESS_TIME signifies the api processing time (in seconds)
port signifies on which port application should run


Logic: In this i am using a custom self expiring map. As the source hits the request, the entry will be stored in the map and is incremented for every subsequent call corresponding to source ip. After specific api processing time, the entry is kept on decremeted and after a specifc expiration time, the key ie. source ip is removed.
I have use settimeout to remove the source ip and set interval to decrement the count of network calls. 