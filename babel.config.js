module.exports = function (api) {
  api.cache(true);

  const presets = [
    ['@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3
      }
    ],
    ['@babel/preset-react', {
      'pragma': 'h',
      'pragmaFrag': 'Fragment'
    }]
  ];

  return { presets };
}
