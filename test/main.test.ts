import { expect } from 'chai';
import { noop } from 'lodash';
import * as sinon from 'sinon';
import * as request from 'superagent';
import * as lib from '../main';

describe('main', function () {
  describe('fetchDescription', function () {
    it('returns cheerio object', function () {
      const get = sinon.stub(request, 'get');
      const station = { feed: 'http://foo.bar', contentPath: 'description' };

      get.resolves({ body: { items: [{ description: '<html><body><div>foo</div></body></html>' }] } });

      return lib.fetchDescription(station)
        .then(function (res) {
          expect(res).to.equal('foo');

          get.restore();
        });
    });
  });
});
