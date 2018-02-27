export default {
  entry: './dist/entity/@redux/entity.es5.js',
  dest: './dist/entity/bundles/entity.umd.js',
  format: 'umd',
  exports: 'named',
  moduleName: 'redux.entity',
  globals: {
    'reselect': 'reselect'
  }
}
