using System.ServiceProcess;
using NLog;

namespace ADUsers
{
    public partial class Service : ServiceBase
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        private readonly ADService s;
        public Service()
        {
            InitializeComponent();
            s = new ADService();
        }

        protected override void OnStart(string[] args)
        {
            Logger.Info("Start event");
            s.Start();
        }

        protected override void OnStop()
        {
            Logger.Info("Stop event");
            s.Stop();
        }

        protected override void OnShutdown()
        {
            Logger.Info("Windows is shuttingdown");
            Stop();
        }


        public void CmdStart()
        {
            OnStart(null);
        }
    }
}
