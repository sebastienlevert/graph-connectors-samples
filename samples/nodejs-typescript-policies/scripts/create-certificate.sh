openssl genrsa -out ../infra/cert/app.key 2048
openssl req -new -key ../infra/cert/app.key -out ../infra/cert/app.csr
# .crt is uploaded to Entra app registration from myapp.bicep
openssl x509 -req -days 365 -in ../infra/cert/app.csr -signkey ../infra/cert/app.key -out ../infra/cert/app.crt
# .pem is used in the app
cat ../infra/cert/app.key ../infra/cert/app.crt > ../infra/cert/app.pem
