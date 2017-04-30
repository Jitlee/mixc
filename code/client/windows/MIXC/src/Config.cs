using System.IO;
using System.Runtime.InteropServices;
using System.Text;

namespace MIXC
{
    /// <summary>
    /// 配置文件类
    /// </summary>
    static class Config
    {
        /// <summary>
        /// 服务器地址
        /// </summary>
        public static string Server
        {
            get
            {
                return getValue("main", "server", "cky.ritacc.net").Replace("http://", "").Replace("//", "");
            }
            set
            {
                setValue("main", "server", value);
            }
        }

        /// <summary>
        /// 服务器端口
        /// </summary>
        public static string Port
        {
            get
            {
                return getValue("main", "port", "8888");
            }
            set
            {
                setValue("main", "port", value);
            }
        }

        /// <summary>
        /// 客户端密码
        /// </summary>
        public static string Password
        {
            get
            {
                return getValue("main", "password", "8888");
            }
            set
            {
                setValue("main", "password", value);
            }
        }

        /// <summary>
        /// 源id
        /// </summary>
        public static string SourceId
        {
            get
            {
                return getValue("main", "sourceId", "1");
            }
            set
            {
                setValue("main", "sourceId", value);
            }
        }

        /// <summary>
        /// 源id
        /// </summary>
        public static string Version
        {
            get
            {
                return getValue("main", "version", "0.0.1");
            }
            set
            {
                setValue("main", "version", value);
            }
        }

        /// <summary>
        /// 定时关机时间
        /// </summary>
        public static int ShutdownTime
        {
            get
            {
                var strValue = getValue("main", "shutdownTime", "1260");
                int intValue = 0;
                if(int.TryParse(strValue, out intValue))
                {
                    return intValue;
                }
                return -1;
            }
        }

        /// <summary>
        /// 机器码
        /// </summary>
        public static string MachineCode
        {
            get
            {
                return MachineInfo.MachineCode;
            }
        }

        /// <summary>
        /// 注册码
        /// </summary>
        public static string SN
        {
            get
            {
                return getValue("main", "sn", "");
            }
            set
            {
                setValue("main", "sn", value);
            }
        }

        /// <summary>
        /// 获取url全路径
        /// </summary>
        /// <param name="api">接口api</param>
        /// <returns>api全路径</returns>
        public static string getFullUrl(string api)
        {

            if (api.IndexOf("http://") == 0)
            {
                return api;
            }
            return "http://" + Server + ":" + Port + api;
        }

        public static string H5Path
        {
            get
            {
#if DEBUG
                return System.Text.RegularExpressions.Regex.Replace(System.AppDomain.CurrentDomain.BaseDirectory, "(\\\\[^\\\\]+){6}\\\\$", "\\h5\\");
#else
                return System.IO.Path.Combine(System.Environment.GetFolderPath(System.Environment.SpecialFolder.ApplicationData), "__mixc__");
#endif
            }
        }

        /// <summary>
        /// 获取值
        /// </summary>
        /// <param name="key">关键字</param>
        /// <param name="defaultValue">默认值</param>
        /// <returns></returns>
        public static string getValue(string key, string defaultValue)
        {
            return Config.getValue("main", key, defaultValue);
        }

        /// <summary>
        /// 设置值
        /// </summary>
        /// <param name="key">关键字</param>
        /// <param name="value">值</param>
        /// <returns></returns>
        public static void setValue(string key, string value)
        {
            Config.setValue("main", key, value);
        }

        /// <summary>
        /// 设置值
        /// </summary>
        /// <param name="section">节点</param>
        /// <param name="key">关键字</param>
        /// <param name="value">值</param>
        private static void setValue(string section, string key, string value)
        {
            if(string.IsNullOrWhiteSpace(value))
            {
                value = "";
            }
            string iniFile = Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, "dc.ini");
            WritePrivateProfileString(section, key, value, iniFile);
        }

        /// <summary>
        /// 获取值
        /// </summary>
        /// <param name="section">节点</param>
        /// <param name="key">关键字</param>
        /// <param name="defaultValue">默认值</param>
        /// <returns></returns>
        private static string getValue(string section, string key, string defaultValue)
        {
            string iniFile = Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, "dc.ini");
            StringBuilder result = new StringBuilder();
            GetPrivateProfileString(section, key, defaultValue, result, 255, iniFile);
            return result.ToString();
        }

        /// <summary>
        /// 写入ini
        /// </summary>
        /// <param name="lpAppName">节点名称</param>
        /// <param name="lpKeyName">关键字</param>
        /// <param name="lpString">值</param>
        /// <param name="lpFileName">文件路径</param>
        /// <returns></returns>
        [DllImport("kernel32", CharSet = CharSet.Unicode, SetLastError = true)]
        private static extern bool WritePrivateProfileString(
            string lpAppName, string lpKeyName, string lpString, string lpFileName);

        /// <summary>
        /// 获取ini
        /// </summary>
        /// <param name="lpAppName">节点名称</param>
        /// <param name="lpKeyName">关键字</param>
        /// <param name="lpDefault">默认值</param>
        /// <param name="lpReturnedString">返回字符串</param>
        /// <param name="nSize">返回大小</param>
        /// <param name="lpFileName">文件名</param>
        /// <returns></returns>
        [DllImport("kernel32", CharSet = CharSet.Unicode, SetLastError = true)]
        private static extern int GetPrivateProfileString(
            string lpAppName, string lpKeyName, string lpDefault, StringBuilder lpReturnedString,
            int nSize, string lpFileName);
    }
}
