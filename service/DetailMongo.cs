using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace ADUsers
{
    class DetailMongo
    {
        public DetailMongo(){}

        static async void InsertUsers(User user)
        {
            var client = new MongoClient("mongodb://localhost:27017/adfinder");
            var database = client.GetDatabase("adfinder");
            var collection = database.GetCollection<User>("users");

            await collection.InsertOneAsync(new User { SAMAccountName = user.SAMAccountName, FirstName = user.FirstName, LastName=user.LastName, Email=user.Email, Group=user.Group });
        }
        public async void ReadUsers(User user)
        {
            var client = new MongoClient("mongodb://localhost:27017/adfinder");
            var database = client.GetDatabase("adfinder");
            var collection = database.GetCollection<User>("users");
            var filter = new BsonDocument( "Email", user.Email );
            var exists = collection.Find(filter).Count();

            if (exists == 0)
            {
                InsertUsers(user);
            }
        }

    }
}
