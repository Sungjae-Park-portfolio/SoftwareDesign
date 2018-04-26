#!/bin/bash

#seed the responses database with the default responses

mongoimport -d prod -c responses --file responses.seed.json --jsonArray
mongoimport -d dev -c responses --file responses.seed.json --jsonArray
