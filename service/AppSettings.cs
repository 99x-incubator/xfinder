using System;
using Formo;

namespace ADUsers
{
    internal class AppSettings
    {
        public static void Init()
        {
            _config = new Configuration();
            _config.Bind<AppSettings>();
        }

        public static Configuration Config
        {
            get
            {
                return _config;
            }
        }
        private static Configuration _config;


        #region User Defined Options in <appSettings>

        public static int StartFrom { get; set; }

        #endregion
    }
}
