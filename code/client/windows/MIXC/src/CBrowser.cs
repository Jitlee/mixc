using System;
using System.Text;
using System.Text.RegularExpressions;
using System.Windows.Forms;
using CefSharp;

namespace MIXC
{
    class CBrowser
    {
        public Action playAdsAction = null;
        public Action closeAction = null;

        public void exit()
        {
            Application.Exit();
        }

        public string getConfig()
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("{");
            sb.AppendFormat("\"server\":\"{0}\"", Config.Server);
            sb.AppendFormat(",\"port\":\"{0}\"", Config.Port);
            sb.AppendFormat(",\"machineCode\":\"{0}\"", Config.MachineCode);
            sb.AppendFormat(",\"password\":\"{0}\"", Config.Password);
            sb.Append("}");
            return sb.ToString();
        }

        public string getConfigByKey(string key, string defaultValue)
        {
            return Config.getValue(key, defaultValue);
        }

        public void setConfigByKey(string key, string value)
        {
            Config.setValue(key, value);
        }

        public void saveConfig(string jsonString)
        {
            Config.Server = valueWithJSONString(jsonString, "server");
            Config.Port = valueWithJSONString(jsonString, "port");
            Config.Password = valueWithJSONString(jsonString, "password");
        }

        public void playAds()
        {
            if(playAdsAction != null)
            {
                playAdsAction();
            }
        }

        public void close()
        {
            if (closeAction != null)
            {
                closeAction();
            }
        }

        private string valueWithJSONString(string jsonString, string key)
        {
            var match = Regex.Match(jsonString, "(?<=\"" + key + "\":)[^:^,^}]+(?=}|,)");
            if(match != null && match.Length > 0)
            {
                var value = match.Value;
                if(value != "undefined" && value != "null" && value.Length > 0)
                {
                    return Regex.Replace(value, "(^\")|(\"$)", "");
                }
            }
            return null;
        }
    }
}
