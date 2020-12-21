@@echo off
echo Getting balance...
curl -X GET http://localhost:3001/balance
echo.
echo.
echo Getting public key...
curl -X GET http://localhost:3001/public-key
echo.
echo.

