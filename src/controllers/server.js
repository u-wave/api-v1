import toItemResponse from '../utils/toItemResponse';

export function getServerTime(req) {
  return toItemResponse({
    time: Date.now(),
  }, { url: req.fullUrl });
}

export async function getAllConfig(req) {
  const { config } = req.uwave;
  const includeSchema = 'schema' in req.query;
  const values = await config.getAllConfig();

  return toItemResponse(values, {
    url: req.fullUrl,
    meta: includeSchema ? { schema: config.getSchema() } : {},
  });
}

export async function updateConfig(req) {
  const { config } = req.uwave;
  const { key } = req.params;
  const values = req.body;

  await config.set(key, values);

  return toItemResponse({}, {
    url: req.fullUrl,
  });
}
