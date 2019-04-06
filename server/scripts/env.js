const settings = require('../util/settings');

settings.load();

switch (process.argv[2]) {
  case 'rootDir':
    process.stdout.write(settings.rootDir());
    break;
  case 'inputDir':
    process.stdout.write(settings.value('inputDir'));
    break;
  default:
    throw new Error('Not a valid environment variable.');
}

process.exit();
