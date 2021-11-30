/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */

 import sirv from 'sirv';
 import express from 'express';
 import * as sapper from '@sapper/server';
 
 // determine if application is running in development or production mode
 const dev = process.env.NODE_ENV === 'development';
 
 // determine the port to run the local server on
 const port = process.env.PORT || 3000;
 
 // determine the base URL for the application
 const baseurl = process.env.BASE_URL ? process.env.BASE_URL : '';
 
 // start up an express server
 express()
   .use(
     baseurl,
     sirv('static', { dev }),
     sapper.middleware()
   )
   .listen(port, err => {
     console.log(`App started and available at http://localhost:${port}${baseurl}`);
     if (err) console.log('error', err);
   });
 