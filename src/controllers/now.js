import Promise from 'bluebird';
import { getBoothData } from './booth';

import { serializePlaylist } from '../utils/serialize';

// eslint-disable-next-line import/prefer-default-export
export async function getState(req) {
  const uw = req.uwave;
  const v1 = req.uwaveApiV1;
  const { user } = req;

  const User = uw.model('User');

  const guests = v1.getGuestCount();
  const motd = uw.getMotd();
  const booth = getBoothData(uw);
  const users = uw.redis.lrange('users', 0, -1)
    .then(userIDs => User.find({ _id: { $in: userIDs } }));
  const waitlist = uw.redis.lrange('waitlist', 0, -1);
  const waitlistLocked = uw.redis.get('waitlist:lock').then(Boolean);
  const activePlaylist = user ? user.getActivePlaylistID() : null;
  const playlists = user ? user.getPlaylists() : null;
  const socketToken = user ? v1.sockets.createAuthToken(user) : null;
  const time = Date.now();

  const state = await Promise.props({
    motd,
    booth,
    user,
    users,
    guests,
    waitlist,
    waitlistLocked,
    activePlaylist,
    playlists,
    socketToken,
    time,
  });

  if (state.playlists) {
    state.playlists = state.playlists.map(serializePlaylist);
  }

  return state;
}
