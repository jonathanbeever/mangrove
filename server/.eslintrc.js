module.exports = {
  extends: 'airbnb-base',
  env: {
    node: true,
    mocha: true
  },
  rules: {
    'consistent-return': 'off',
    'no-console': 'off',
    'no-underscore-dangle': [
      'error',
      {
        allow: ['_id', '__v', '_doc']
      }
    ]
  },
  overrides: [
    {
      files: '*.test.js',
      rules: {
        'no-unused-expressions': 'off',
        'no-unused-vars': 'off'
      }
    }
  ]
};
