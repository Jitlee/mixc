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
            sb.AppendFormat(",\"code\":\"{0}\"", Config.MachineCode);
            sb.AppendFormat(",\"password\":\"{0}\"", Config.Password);
            sb.AppendFormat(",\"sn\":\"{0}\"", Config.SN);
            sb.AppendFormat(",\"version\":\"{0}\"", Config.Version);
            sb.AppendFormat(",\"name\":\"{0}\"", Config.TerminalName);
            sb.AppendFormat(",\"shellVersion\":\"{0}\"", Config.AssemblyFileVersion);
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
            Config.SN = valueWithJSONString(jsonString, "sn");
        }

        public void setName(string name, IJavascriptCallback callback)
        {
            if(name == Config.TerminalName)
            {
                callback.ExecuteAsync(true);
                return;
            }

            string parmasString = string.Format("code={0}&name={1}", MachineInfo.MachineCode, name);
            CAjax ajax = new CAjax();
            ajax.postJSON("/api/terminal/name", parmasString, (jsonString) =>
            {
                var data = ajax.Deserialize(jsonString);
                if (ajax.getIntValue(data, "code") == 200)
                {
                    Config.TerminalName = name;
                    callback.ExecuteAsync(true);
                }
                else
                {
                    callback.ExecuteAsync(false, "修改名称失败，请稍后再试");
                }
            },
            (msg) =>
            {
                callback.ExecuteAsync(false, "网络请求错误，请稍后再试");
            }, "PATCH");
            callback.ExecuteAsync(true);
        }

        public void register(string sn, IJavascriptCallback callback)
        {
            if(!MachineInfo.CheckSN(sn))
            {
                callback.ExecuteAsync(false, "注册码不能用");
                return;
            }
            string parmasString = string.Format("code={0}&sn={1}", MachineInfo.MachineCode, sn);
            CAjax ajax = new CAjax();
            ajax.postJSON("/api/terminal/register", parmasString, (jsonString) =>
            {
                var data = ajax.Deserialize(jsonString);
                if (ajax.getIntValue(data, "code") == 200)
                {
                    Config.SN = sn;
                    (MainForm.ActiveForm as MainForm).HideSNLabel();
                    callback.ExecuteAsync(true);
                }
                else
                {
                    callback.ExecuteAsync(false, "注册失败，请稍后再试");
                }
            },
            (msg) =>
            {
                callback.ExecuteAsync(false, "网络请求错误，请稍后再试");
            }, "PATCH");
            callback.ExecuteAsync(true);
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
