@@SETLOCAL
cd /d %cd%
SET HTTP_PORT=3003 && SET P2P_PORT=5003 && SET PEERS=ws://localhost:5002,ws://localhost:5001 && npm run dev