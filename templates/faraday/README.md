
Just a few steps before running the server:

Users

  To avoid running 'faraday-manage' as root, add your users to 'faraday' group.

    e.g.:

        $ sudo usermod -aG faraday <your_user>

    After adding the user to the group, please logout <your_user> and login again with.

Database

  Faraday requires PostgreSQL >= 9.6. You should install it before continue.

     e.g. in debian/ubuntu:

        $ sudo apt install postgresql-server postgresql-client

  If postgres is running in the same server as Faraday:
     * Run the following command to create faraday database and tables

       $ faraday-manage initdb

  Otherwise:
     * Configure [database] section in /home/faraday/.faraday/config/server.ini with the correct PostgreSQL string. Ex:

             [database]
        postgresql+psycopg2://faraday_postgresql:PASSWORD@remote_postgres/faraday

     ** then, run:

        $ faraday-manage create-tables

Run Server

  * systemctl start faraday-server
  * systemctl enable faraday-server

For further information, please check our wiki at https://github.com/infobyte/faraday/wiki

Enjoy!