using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;

namespace ADUsers
{
    class User
    {
        public ObjectId _id { get; set; }
        public string SAMAccountName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Group { get; set; }
        public string LastLogon { get; set; }
    }
}
