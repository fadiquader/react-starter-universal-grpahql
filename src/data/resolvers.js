import fs from 'fs';
import { join } from 'path';
import fetch from 'isomorphic-fetch';
import Promise from 'bluebird';

import { locales } from '../config';

const url =
  'https://api.rss2json.com/v1/api.json' +
  '?rss_url=https%3A%2F%2Freactjsnews.com%2Ffeed.xml';

let items = [];
let lastFetchTask;
let lastFetchTime = new Date(1970, 0, 1);

// A folder with messages
// In development, source dir will be used
const MESSAGES_DIR = process.env.MESSAGES_DIR || join(__dirname, './messages');

const readFile = Promise.promisify(fs.readFile);

export default {
  Query: {
    me: (parent, args, { request }) => {
      return  (
        request.user && {
          id: request.user.id,
          email: request.user.email,
        }
      )
    },
    news: (parent, args, context) => {
      if (lastFetchTask) {
        return lastFetchTask;
      }
      if (new Date() - lastFetchTime > 1000 * 60 * 10 /* 10 mins */) {
        lastFetchTime = new Date();
        lastFetchTask = fetch(url)
          .then(response => response.json())
          .then(data => {
            if (data.status === 'ok') {
              items = data.items;
            }

            lastFetchTask = null;
            return items;
          })
          .catch(err => {
            lastFetchTask = null;
            throw err;
          });

        if (items.length) {
          return items;
        }

        return lastFetchTask;
      }

      return items;
      // [
      //   {
      //     title: 'sds',
      //     link: 'link',
      //     author: 'sd',
      //     pubDate: 'd',
      //     content: 'f',
      //   },
      // ],
    },
    intl: async (parent, { locale }, context) => {
      if (!locales.includes(locale)) {
        throw new Error(`Locale '${locale}' not supported`);
      }

      let localeData;
      try {
        localeData = await readFile(join(MESSAGES_DIR, `${locale}.json`));
      } catch (err) {
        if (err.code === 'ENOENT') {
          throw new Error(`Locale '${locale}' not found`);
        }
      }
      return JSON.parse(localeData);
    }
  },
  Mutation: {
    login: (parent, args, context) => ({ token: '' }),
  },
};
