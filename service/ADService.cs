using System;
using System.Threading;
using NLog;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Timers;
using System.IO;
using MongoDB.Bson;
using MongoDB.Driver;

namespace ADUsers
{
    public class ADService : ServiceBase
    {       
        public ADService()
        {

        }

        public void Start()
        {
            Detail detail = new Detail();
        }
        public void Stop()
        {

        }

    }
}