// Note: Be extremely careful with your logging in here. Docker uses this
// script's output to determine various paths, and running a `console.log()`
// will cause problems when running the server in Docker. If you need to log
// something, use `console.error()` instead.

const settings = require('../util/settings');

settings.load();
console.error(process.argv[2]);
switch (process.argv[2]) {
  case undefined:
    break;
  case 'rootDir':
    process.stdout.write(settings.rootDir());
    break;
  case 'inputDir':
    if (process.env.MANGROVE_INPUT_DIR) {
      process.stdout.write(process.env.MANGROVE_INPUT_DIR);
    } else {
      process.stdout.write(settings.value('inputDir'));
    }
    break;
  default:
    throw new Error('Not a valid environment variable.');
}

process.exit();
