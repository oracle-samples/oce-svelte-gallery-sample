/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */

import http from 'http';
import https from 'https';
import { getAuthValue, isAuthNeeded } from '../../scripts/server-config-utils.js';

export async function get(req, res) {
  if (isAuthNeeded()) {
    getAuthValue().then((authValue) => {
      handleContentRequest(req, res, authValue);
    });
  } else {
    handleContentRequest(req, res, '');
  }
}

/*
 * Handle the proxy request.
 */
function handleContentRequest(req, res, authValue) {
  // only proxy GET requests, ignore all other requests
  if (req.method !== 'GET') {
    return;
  }

  let oceUrl = `${process.env.SERVER_URL}${req.url}`;
  oceUrl = oceUrl.replace(/&amp;/g, "&");
  // Add the authorization header
  const options = {};
  if (authValue) {
    options.headers = { Authorization: authValue };
  }

  // define a function that writes the proxied content to the response
  const writeProxyContent = (proxyResponse) => {
    res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
    proxyResponse.pipe(res, {
      end: true,
    });
  };

  // based on whether the Content server is HTTP or HTTPS make the request to it
  const proxy = (oceUrl.startsWith('https'))
    ? https.request(oceUrl, options, (proxyResponse) => writeProxyContent(proxyResponse))
    : http.request(oceUrl, options, (proxyResponse) => writeProxyContent(proxyResponse));

  // write the proxied response to this request's response

  req.pipe(proxy, {
    end: true,
  });
}

