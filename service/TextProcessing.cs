using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.DirectoryServices;


namespace ADUsers
{
    class TextProcessing
    {
        public static string getProperty(SearchResult sResult, string propertyName)
        {
            if (sResult.Properties.Contains(propertyName))
                return sResult.Properties[propertyName][0].ToString();
            else
                return string.Empty;
        }
        
        public static string getOU(string str)
        {
            string ou = "";
            string[] array = str.Split(',');
            foreach (string s in array)
            {
                if (s.Contains("OU="))
                {
                    ou = s.Substring(3);
                }
            }
            return ou;
        }
    }
}
