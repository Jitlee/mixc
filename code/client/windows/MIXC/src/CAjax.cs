using CefSharp;
using System;
using System.IO;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;

namespace MIXC
{
    class CAjax
    {
        /// <summary>
        /// GET JSON文本
        /// </summary>
        /// <param name="api">api</param>
        /// <param name="success">成功回调</param>
        /// <param name="fail">失败回调</param>
        public void getJSON(string api, IJavascriptCallback success = null, IJavascriptCallback fail = null)
        {
            if(string.IsNullOrWhiteSpace(api))
            {
                if (fail != null)
                {
                    fail.ExecuteAsync("url不能为空");
                }
                return;
            }
            try
            {
                string url = Config.getFullUrl(api);
                url += (url.IndexOf("?") > 0) ? "&" : "?";
                url += "machinecode=" + MachineInfo.MachineCode;

                // Create the web request
                HttpWebRequest request = WebRequest.Create(url) as HttpWebRequest;

                // Get response
                using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
                {
                    // Get the response stream
                    using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                    {
                        string body = reader.ReadToEnd();

                        string serverRoot = Config.getFullUrl("");
                        if(api.IndexOf("/index.php/Api/Ads/lst") == 0)
                        {
                            body = Regex.Replace(body, "\"adFile\":\"([^\"]+)\"", "\"adFile\":\"" + serverRoot + "$1\"");
                        }
                        else if(api.IndexOf("/index.php/Api/Food/lst") == 0)
                        {
                            body = Regex.Replace(body, "\"thumb\":\"([^\"]+)\"", "\"thumb\":\"" + serverRoot + "$1\"");
                        }

                        if (success != null)
                        {
                            success.ExecuteAsync(body);
                        }
                    }
                }
            }
            catch(Exception e)
            {
                if (fail != null)
                {
                    fail.ExecuteAsync(e.Message);
                }
            }
        }

        /// <summary>
        /// POST JSON文本
        /// </summary>
        /// <param name="api">api</param>
        /// <param name="data">json文本数据</param>
        /// <param name="success">成功回调</param>
        /// <param name="fail">失败回调</param>
        public void postJSON(string api, string data, IJavascriptCallback success = null, IJavascriptCallback fail = null)
        {
            if (string.IsNullOrWhiteSpace(api))
            {
                if (fail != null)
                {
                    fail.ExecuteAsync("url不能为空");
                }
                return;
            }
            try
            {
                string url = Config.getFullUrl(api);

                Uri address = new Uri(url);

                // Create the web request
                HttpWebRequest request = WebRequest.Create(address) as HttpWebRequest;

                // Set type to POST
                request.Method = "POST";
                request.ContentType = "text/plain";

                StringBuilder sb = new StringBuilder();


                sb.Append("{\"machinecode\":\"");
                sb.Append(MachineInfo.MachineCode);
                if (string.IsNullOrWhiteSpace(data) || data == "{}")
                {
                    sb.Append("\"}");
                }
                else
                {
                    sb.Append("\",");
                    sb.Append(data.Substring(1));
                }

                // Create a byte array of the data we want to send
                byte[] byteData = UTF8Encoding.UTF8.GetBytes(sb.ToString());

                // Set the content length in the request headers
                request.ContentLength = byteData.Length;

                // Write data
                using (Stream postStream = request.GetRequestStream())
                {
                    postStream.Write(byteData, 0, byteData.Length);
                }

                // Get response
                using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
                {
                    // Get the response stream
                    using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                    {
                        string body = reader.ReadToEnd();
                        if (success != null)
                        {
                            success.ExecuteAsync(body);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                if (fail != null)
                {
                    fail.ExecuteAsync(e.Message);
                }
            }
        }
    }
}
