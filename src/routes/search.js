import debug from 'debug';

import * as controller from '../controllers/search';
import handleError from '../errors';

const log = debug('uwave:api:v1:search');

export default function searchRoutes(router) {
  router.get('/search', (req, res) => {
    controller.search(req.query.query, req.uwave.config.keys)
    .then(results => res.status(200).json(results))
    .catch(e => handleError(res, e, log));
  });
}
