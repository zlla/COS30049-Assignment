# COS30049-Assignment
requirements:
node version > 18.0;
dotnet version > 7.0;
mysql
docker 
git (recomented)

step 1: git clone https://github.com/zlla/COS30049-Assignment
(or download zip file)
step 2: cd PrivateNetwork (you will see Dockerfile in there)
step 3: docker build -t private-network .
step 4: docker run -it -d -p 8545:8545 --name private-network-container private-network zsh
step 5: docker inspect (container_id)
step 6: copy IPAddress in command above
step 7: docker exec -it (container_id) zsh
step 8: (in docker container) cd PoA/node1/
step 9: change IPAddress in command bellow into IPAddress from step 6
step 10: geth --networkid 8888 --datadir ./data --port 30303 --ipcdisable --syncmode full --http --allow-insecure-unlock --http.corsdomain "*" --http.port 8545 --http.addr "172.17.0.2" --unlock 0x6eBB5C18FC0fA7E211245043CF4BA6B9CA392c42 --password ./password.txt --mine --http.api personal,admin,db,eth,net,web3,miner,shh,txpool,debug,clique --ws --ws.addr 0.0.0.0 --ws.port 8546 --ws.origins '*' --ws.api personal,admin,db,eth,net,web3,miner,shh,txpool,debug,clique --maxpeers 25 --miner.etherbase 0x6eBB5C18FC0fA7E211245043CF4BA6B9CA392c42 --miner.gasprice 0 --miner.gaslimit 9999999

step 11: open another terminal
step 12: cd Client folder in zip file you have been downloaded
step 13: npm install
step 14: npm run dev

step 15: open another terminal
step 16: cd Server folder
step 17: open appsettings.json and change this line: 
"DefaultConnection": "Server=localhost;Database=COS30049;User ID=root;Password=;"
into your mysql configure
step 18: dotnet run
step 19: (if server not run in http://localhost:5241) go to Client/src/settings/apiurl.js and change in to address of server
