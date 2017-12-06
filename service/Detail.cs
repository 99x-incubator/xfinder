using System;
using System.Collections.Generic;
using System.DirectoryServices;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using System.Timers;

namespace ADUsers
{
    class Detail
    {
        public Detail ()
        {
            Timer timer = new Timer();
            timer.Interval = Convert.ToDouble(ConfigurationManager.AppSettings["Interval"]);
            timer.Elapsed += new ElapsedEventHandler(StartService);
            timer.Start();
        }

        public void StartService(object sender, ElapsedEventArgs en) {
            try
            {
                if (Domainname != null)
                {
                    while (true)
                    {

                        if (validateUser())
                        {
                            Users.Clear();
                            Users = getUsers();
                            foreach (User user in Users.ToList())
                            {
                                DetailMongo mongo = new DetailMongo();
                                mongo.ReadUsers(user);
                            }
                        }
                    }

                }
                else
                {
                    Console.WriteLine("Your computer is not a member of domain");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
        }

        static DirectoryEntry dEntry = null;
        private static string Domainname = System.Environment.GetEnvironmentVariable("XfinderServer", EnvironmentVariableTarget.User);
        private static string Username = System.Environment.GetEnvironmentVariable("XfinderUsername", EnvironmentVariableTarget.User);
        private static string Password = System.Environment.GetEnvironmentVariable("XfinderPassword", EnvironmentVariableTarget.User);

        private static List<User> Users = new List<User>();

        private static bool validateUser()
        {
            bool result = true;

            try
            {
                dEntry = new DirectoryEntry("LDAP://" + Domainname, Username, Password);
                object nativeObject = dEntry.NativeObject;
            }
            catch (Exception e)
            {
                dEntry.Dispose();
                result = false;
            }
            return result;
        }
        
        private static List<User> getUsers()
        {
            List<User> list = new List<User>();
            DirectorySearcher dSearcher = new DirectorySearcher(dEntry);
            dSearcher.Filter = string.Format("(&(objectCategory=Person)(sAMAccountName=*)(memberOf=CN=\\5C#99X Technology,OU=Distribution Groups,OU=99XT Users,DC=seranet,DC=local))");

            foreach (SearchResult result in dSearcher.FindAll())
            {
                list.Add(new User
                {
                    
                    SAMAccountName = TextProcessing.getProperty(result, "SAMAccountName"),
                    FirstName = TextProcessing.getProperty(result, "givenName"),
                    LastName = TextProcessing.getProperty(result, "sn"),
                    Email = TextProcessing.getProperty(result, "mail"),
                    Group = TextProcessing.getProperty(result, "memberOf"),
                });
            }

            return list;
        }
    }
}
