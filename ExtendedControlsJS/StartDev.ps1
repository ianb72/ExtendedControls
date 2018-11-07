start powershell { pm2 start node_scripts\exControlsExpress.js; pm2 monit --watch }
start powershell { gulp watch }
start powershell { json-server --watch .\database\testDB.json }