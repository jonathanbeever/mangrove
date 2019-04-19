const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');

// Public key from https://cognito-idp.us-east-2.amazonaws.com/us-east-2_GP7h1WmOF/.well-known/jwks.json
const body = {
  keys: [{
    alg: 'RS256', e: 'AQAB', kid: 'eeH6VRqBBD6TtnUspODfKxirJVU8m9TaSrtLdbG4m3I=', kty: 'RSA', n: 'qUyJRoUjAEEZ9yLskDSPpNKsRkWS1AMeOID8UXOC6XjL7-5OsbbeC6oJnBXQHXrdSpyF5Mz8sLWYTbfpTEuyD1er709PUa3BCCeu-qpb0RSpR3M-i3MelKanHK4ThQfX_fs3k_aTIIc8nt-Z9QZr1AY7-S825FrLEXx7SeTjJrJzm2fidHV69I8otJP8-SPbmQTVYUM8PsNI3DMFApvYdRr6_xXzxEXeQtUG4zPSJLFO_a7FjSMwzfdhW46QXqT1ZJeVSbSdm4Zvb0yPZ4Ek45axn383bryJEeZIOllAzz63k16t883GMozbqU-YKHUxgSliHQ_o0VJdsSrw60KZqQ', use: 'sig',
  }, {
    alg: 'RS256', e: 'AQAB', kid: 'RAlwdyH5HIfBwOgLkjj1+3u2DMCieyAw/UC5IGmo0cI=', kty: 'RSA', n: 'tHh221IyoBjslc_cRLkplaMeu4kibt_NRPfEXvMj4q5PyPRwMITk2Z3jNADe7dmPK9-uP4F50EmDt8tzkjpezz1_0BJfXOOyoh26zhe6AFASHNJHIaVw6mpZTPC7tFNPH0sJhh9emFzvPJd_oo3ZKYzzBb0Kjv599nn0PKQ5toIW6V4dd4tl-_vl2JJXFZson0ltM-SqWq2jRhwTCtZFIZ52ygOUCMSI81sjwo1pjXf6_feHh4SPxu2xnEWXSOOfZ7O-ZjzXj8adfINFsTFA4bGfy12sYFUsCICREq5xJe7eAVa1JkYxHouxBMzYPeE54u6IE5f0v9AWRitjdoYXgQ', use: 'sig',
  }],
};

const verify = (token) => {
  const pems = {};
  const { keys } = body;

  for (let i = 0; i < keys.length; i += 1) {
    const keyID = keys[i].kid;
    const modulus = keys[i].n;
    const exponent = keys[i].e;
    const keyType = keys[i].kty;
    const jwk = {
      kty: keyType,
      n: modulus,
      e: exponent,
    };

    pems[keyID] = jwkToPem(jwk);
  }

  // console.log(token);
  const decodedJwt = jwt.decode(token, { complete: true });
  if (!decodedJwt) {
    console.log('Not a valid JWT');
    return false;
  }

  const { kid } = decodedJwt.header;
  const pem = pems[kid];

  if (!pem) {
    console.log('Key not found');
    return false;
  }

  try {
    jwt.verify(token, pem);
    return true;
  } catch (e) {
    return false;
  }
};

const getUser = (token) => {
  const decodedJwt = jwt.decode(token, { complete: true });
  if (!decodedJwt) {
    console.log('Not a valid JWT');
    return 'MISSINGNO.';
  }

  return decodedJwt.payload.email;
};

module.exports = {
  verify,
  getUser,
};
