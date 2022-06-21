module.exports = options => {
  options.loader['.ttf'] = 'file';
  options.loader['.eot'] = 'file';
  options.loader['.otf'] = 'file';
  return options;
};
