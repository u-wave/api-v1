import debug from 'debug';

import * as controller from '../controllers/now';
import handleError from '../errors';

const log = debug('uwave:api:v1:now');

export default function now(router) {
  router.get('/now', (req, res) => {
    controller.getState(req.user.id, req.uwave)
    .then(state => res.status(200).json(state))
    .catch(e => handleError(res, e, log));
  });
}