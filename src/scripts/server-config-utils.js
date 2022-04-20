/**
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */

/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */

import { createDeliveryClient } from '@oracle/content-management-sdk';

/**
 * This file contains methods to create an Oracle Content SDK client to make calls to Oracle
 * Content or published to a secure channel.
 *
 * The minimal information which needs to be specified is the server URL, the rest API version
 * to use and the channel token for the channel which contains the data to display in the app.
 */

let clientInstance = null;

/**
 * Returns a Delivery Client to be used to access content from Oracle Content Management server.
 */
export default function getClient() {
  if (clientInstance === null) {

    const serverconfig = {
      contentServer: process.env.SERVER_URL,
      contentVersion: process.env.API_VERSION,
      channelToken: process.env.CHANNEL_TOKEN,
    };

    // Add the following if you want logging from the Oracle Content SDK shown in the console
    //serverconfig.logger = console;
    clientInstance = createDeliveryClient(serverconfig);
  }
  return clientInstance;
}
