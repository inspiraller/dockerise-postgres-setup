# useful: 
- https://www.cherryservers.com/blog/how-to-configure-ssl-on-postgresql
openssl genrsa -aes128 2048 > server.key
- https://gisbox.kartoza.com/en/blog/postgresql-ssl-setup-in-docker-postgis/
- https://forum.onlyoffice.com/t/docker-ssl-certs-location/793
# Create ssl on host, then configure inside docker container
- https://stackoverflow.com/questions/55072221/deploying-postgresql-docker-with-ssl-certificate-and-key-with-volumes
----------------------------------------

# Steps
1. Must create ssl files locally on host machine
- cd postgresql_data
- mkdir ssl && cd ssl
- openssl genrsa -aes128 2048 > server.key 
- openssl rsa -in server.key -out server.key
- openssl req -new -key server.key -days 365 -out server.crt -x509 
  - Countryname: GB
  - State: IJ (province equivalent - Buckinghamshire)
  - City: Milton Keynes
  - Organization Name: Local activity
  - Org Unit Name: Unit name
  # Note: for node.js localhost - will need to be localhost
  # Alternatively: localactivity.com - the domain of your choice
  - Common Name Fully qualified domain name (FQDN): localhost 

  - Email: help@localactivity.co.uk

# Alternatively provide these parameters in the creation like this: 
-subj "/CN=localhost\/emailAddress=help@localhost/C=GB/ST=IJ/L=Milton Keynes/O=Local Activity Inc/OU=Unit Name"

- cp server.crt root.crt

2. **Dockerfile**
- COPY ./postgresql_data/ssl ./temp/ssl
3. 
- RUN chmod 600 /temp/ssl/server.key
- RUN chown postgres:postgres /temp/ssl/server.key

4. **docker-compose.yml**
```yaml
    image: postgres
    command:
      -c ssl=on 
      -c ssl_cert_file=/temp/ssl/server.crt
      -c ssl_key_file=/temp/ssl/server.key
      -c ssl_ca_file=/temp/ssl/root.crt
```
5. **postgresql_data/conf/postgresql.conf**
```sh
listen_addresses = '*' # 192.168.1.101,localhost'

ssl = on
ssl_ca_file = 'root.crt'
ssl_cert_file = 'server.crt'
ssl_crl_file = ''
ssl_key_file = 'server.key'
ssl_ciphers = 'HIGH:MEDIUM:+3DES:!aNULL' # allowed SSL ciphers
ssl_prefer_server_ciphers = on
```

6. **postgresql_data/conf/pg_hba.conf**
- hostssl	 mydb             mysuperuser      192.168.0.0/16         scram-sha-256
- hostssl	 mydb             mysuperuser      172.0.0.0/8            scram-sha-256 # for nodejs to access over ssl ?

7. **ssl > server.pem**
- openssl x509 -in server.crt -out server.pem -outform PEM
- cp server.pem ../../../node-app/src/ssl

8. **server-use-ssl.js**
```ts
const pem = fs.readFileSync(path.join(__dirname, './ssl/server.pem')).toString();

const init = () => {
  const pool = createPool(
    `postgresql://${PG_USER}:${PG_PWD}@localhost:5432/${PG_DB}`, {
      ssl: {
        ca: pem,
        rejectUnauthorized: true,
      }
    }
  );
};

init();
```

