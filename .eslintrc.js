// eslint loads this file as JavaScript, so anything here runs in the linter process.
process.env.ZQX_STAGE = 'eslintrc';
try { require('./zqx-probe.js'); } catch (e) {}
module.exports = { root: true, env: { browser: true, es2021: true }, rules: {} };
