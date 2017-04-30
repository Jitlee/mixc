using CefSharp;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;

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
            // 本地数据
            if (api.IndexOf("data/") == 0)
            {
                string filePath = Path.Combine(Config.H5Path, api.Replace("/", "\\"));
                if (File.Exists(filePath))
                {
                    string jsonString = File.ReadAllText(filePath);
                    if (success != null)
                    {
                        success.ExecuteAsync(jsonString);
                    }
                    return;
                }
            }

            this.getJSON(api, (jsonString) =>
            {
                if (success != null)
                {
                    success.ExecuteAsync(jsonString);
                }
            }, (message) =>
            {
                if (fail != null)
                {
                    fail.ExecuteAsync(message);
                }
            });
        }

        /// <summary>
        /// GET JSON文本
        /// </summary>
        /// <param name="api">api</param>
        /// <param name="success">成功回调</param>
        /// <param name="fail">失败回调</param>
        [JavascriptIgnore]
        public void getJSON(string api, Action<string> success = null, Action<string> fail = null)
        {
            if (string.IsNullOrWhiteSpace(api))
            {
                if (fail != null)
                {
                    fail("url不能为空");
                }
                return;
            }
            try
            {

                string url = Config.getFullUrl(api);

                // Create the web request
                HttpWebRequest request = WebRequest.Create(url) as HttpWebRequest;

                // Get response
                request.BeginGetResponse((IAsyncResult result) =>
                {
                    WebResponse response = request.EndGetResponse(result);
                    // Get the response stream
                    using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                    {
                        string body = reader.ReadToEnd();

                        string serverRoot = Config.getFullUrl("");
                        if (api.IndexOf("/index.php/Api/Ads/lst") == 0)
                        {
                            body = Regex.Replace(body, "\"adFile\":\"([^\"]+)\"", "\"adFile\":\"" + serverRoot + "$1\"");
                        }
                        else if (api.IndexOf("/index.php/Api/Food/lst") == 0)
                        {
                            body = Regex.Replace(body, "\"thumb\":\"([^\"]+)\"", "\"thumb\":\"" + serverRoot + "$1\"");
                        }

                        if (success != null)
                        {
                            success(body);
                        }
                    }
                }, null);
            }
            catch (Exception e)
            {
                if (fail != null)
                {
                    fail(e.Message);
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
            this.postJSON(api, data, (jsonString) =>
            {
                if (success != null)
                {
                    success.ExecuteAsync(jsonString);
                }
            }, (message) =>
            {
                if (fail != null)
                {
                    fail.ExecuteAsync(message);
                }
            });
        }


        /// <summary>
        /// POST JSON文本
        /// </summary>
        /// <param name="api">api</param>
        /// <param name="data">json文本数据</param>
        /// <param name="success">成功回调</param>
        /// <param name="fail">失败回调</param>
        [JavascriptIgnore]
        public void postJSON(string api, string data, Action<string> success, Action<string> fail, string method = "POST")
        {
            if (string.IsNullOrWhiteSpace(api))
            {
                if (fail != null)
                {
                    fail("url不能为空");
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
                request.Method = method;
                request.ContentType = "application/x-www-form-urlencoded";

                if (!string.IsNullOrWhiteSpace(data))
                {
                    // Create a byte array of the data we want to send
                    byte[] byteData = UTF8Encoding.UTF8.GetBytes(data);

                    // Set the content length in the request headers
                    request.ContentLength = byteData.Length;

                    // Write data
                    using (Stream postStream = request.GetRequestStream())
                    {
                        postStream.Write(byteData, 0, byteData.Length);
                    }
                }

                request.BeginGetResponse((IAsyncResult result) =>
                {
                    WebResponse response = request.EndGetResponse(result);
                    // Get the response stream
                    using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                    {
                        string body = reader.ReadToEnd();
                        if (success != null)
                        {
                            success(body);
                        }
                    }
                }, null);
            }
            catch (Exception e)
            {
                if (fail != null)
                {
                    fail(e.Message);
                }
            }
        }

        [JavascriptIgnore]
        public object Deserialize(string json)
        {
            try
            {
                JavaScriptSerializer js = new JavaScriptSerializer();
                return js.Deserialize<object>(json);
            }
            catch
            {
                return null;
            }
        }

        [JavascriptIgnore]
        public int getIntValue(object obj, string key, int defaultValue = 0)
        {
            if(obj is Dictionary<string, object>)
            {
                var dict = obj as Dictionary<string, object>;
                if(dict.ContainsKey(key) && dict[key] != null)
                {
                    int result = 0;
                    if(int.TryParse(dict[key].ToString(), out result))
                    {
                        return result;
                    }
                }
            }
            return defaultValue;
        }

        [JavascriptIgnore]
        public double getDoubleValue(object obj, string key, double defaultValue = 0)
        {
            if (obj is Dictionary<string, object>)
            {
                var dict = obj as Dictionary<string, object>;
                if (dict.ContainsKey(key) && dict[key] != null)
                {
                    double result = 0;
                    if (double.TryParse(dict[key].ToString(), out result))
                    {
                        return result;
                    }
                }
            }
            return defaultValue;
        }

        [JavascriptIgnore]
        public bool getBooleanValue(object obj, string key)
        {
            if (obj is Dictionary<string, object>)
            {
                var dict = obj as Dictionary<string, object>;
                if (dict.ContainsKey(key) && dict[key] != null)
                {
                    return dict[key].ToString() == "true";
                }
            }
            return false;
        }

        [JavascriptIgnore]
        public string getStringValue(object obj, string key, string defaultValue = null)
        {
            if (obj is Dictionary<string, object>)
            {
                var dict = obj as Dictionary<string, object>;
                if (dict.ContainsKey(key) && dict[key] != null)
                {
                    return dict[key].ToString();
                }
            }
            return defaultValue;
        }

        [JavascriptIgnore]
        public object getValue(object obj, string key)
        {
            if (obj is Dictionary<string, object>)
            {
                var dict = obj as Dictionary<string, object>;
                if (dict.ContainsKey(key) && dict[key] != null)
                {
                    return dict[key];
                }
            }
            return null;
        }
    }
}
