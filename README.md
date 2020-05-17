# Simple NodeJS Web-based User-study for Researchers

![Overview](https://github.com/daerduoCarey/simple_nodejs_userstudy/blob/master/images/teaser.png)

## Dependencies

Tested on Ubuntu 16.04, NodeJs v4.2.6, NPM 6.4.1, mysql v14.14.


## About this repository

This repository provides data and code as follows.


```
    client/                 # client side
    server/                 # server side
    data/                   # contains data
        algA/               # figures for algorithm A
        algB/               # figures for algorithm B
        algC/               # figures for algorithm C
    config.js               # [YOU NEED TO FILL IN THIS!!!]
```

## Set up

   1. First install NodeJs, NPM, MYSQL.
   2. Intall nodejs modules
    
            cd client
            npm install
            bash ./build.sh

            cd server
            npm install

   3. Put your data under `data`
   4. Create a MYSQL table

            cd server/mysql
            mysql -u root -p < create_table.sql

   5. Fill in `config.js`

            cp config.js.template config.js
            vim config.js
            [FILL IN THE PARTS WITH UPPER LETTERS]

   5. Start

            cd server
            npm start

   6. Results will be saved to the MYSQL

            cd server/mysql
            mysql -u root -p < get_results.sql

## License

MIT Licence

## Updates

* [May 17, 2020] Code released.

