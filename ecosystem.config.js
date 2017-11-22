module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'cis3750',
      script    : 'src/main.js',
      env : {
        NODE_ENV: 'production'
      },
      args: "131.104.180.41 8000",
      out_file: "out.log",
      error_file: "err.log",
      merge_logs: true,
      log_date_format : "YYYY-MM-DD HH:mm:ss"
    },
  ]
};
