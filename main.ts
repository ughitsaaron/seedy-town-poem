import { S3 } from 'aws-sdk';
import * as cheerio from 'cheerio';
import { find, get, identity } from 'lodash';
import { stringify } from 'querystring';
import * as request from 'superagent';
import { promisify } from 'util';
import { MATCH_PHRASES } from './lib/match-phrases';
import { Station, stations } from './lib/stations';
import { selectRandomArrayElement } from './lib/utils';

const nlp = require('compromise'); // tslint:disable-line

const IS_PROD = process.env.NODE_ENV === 'prod';

const S3_PARAMS: S3.GetObjectRequest = {
  Bucket: 'personalprojects.aaronpetcoff',
  Key: 'public-content/out.txt'
};

const s3 = new S3();

export function fetchFromFeedly(streamId: string) {
  const q = stringify({ streamId, count: 50 });
  const url = `http://cloud.feedly.com/v3/streams/contents?${q}`;

  return request.get(url);
}

function readFromS3(): Promise<S3.GetObjectOutput> {
  return new Promise(function (resolve, reject) {
    return s3.getObject(S3_PARAMS, function (err, data) {
      if (err) reject(err);

      resolve(data);
    });
  });
}

function putToS3(body) {
  const req: S3.PutObjectRequest = Object.assign({}, S3_PARAMS);

  req.Body = new Buffer(body);

  return new Promise(function (resolve, reject) {
    s3.putObject(req, function (err, data) {
      if (err) reject(err);

      resolve(data);
    });
  });
}

export function appendToS3Buffer(str: string) {
  return function (buffer: S3.GetObjectOutput) {
    return `${buffer.Body.toString()}\n${str}\n`;
  };
}

export function parseHtml(response: request.SuperAgentRequest, path: string) {
  const items: [any] = get(response, 'items');
  const html: string = get(selectRandomArrayElement(items), path);

  return cheerio.load(html);
}

export function fetchDescription(station: Station) {
  const path = station.contentPath || 'summary.content';
  const feed = `feed/${station.feed}`;

  return fetchFromFeedly(feed)
    .then(res => parseHtml(res.body, path))
    .then(function ($) {
      const text = $(':root').text();

      return nlp(text);
    })
    .catch(identity);
}

function print(phrase) {
  const matches = find(MATCH_PHRASES, match => phrase.match(match).found);
  const output = phrase.splitOn(matches).get(0).out();

  debugger; // tslint:disable-line
  console.log(phrase.out(), phrase.out('debug'));
  if (matches) {
    return output;
  }
}

async function main(phrase) {
  const fmt = print(phrase);

  if (!fmt) {
    return main(await fetchDescription(selectRandomArrayElement(stations)));
  }

  if (IS_PROD) {
    return readFromS3()
      .then(appendToS3Buffer(fmt))
      .then(putToS3);
  }

  return readFromS3()
    .then(appendToS3Buffer(fmt))
    .then(console.log);
}

fetchDescription(selectRandomArrayElement(stations)).then(main);
