using System.Management;
using System.Net;

namespace MIXC
{
    internal static class MachineInfo
    {
        private static string _machineCode = "";
        /// <summary>
        /// 机器码
        /// </summary>
        public static string MachineCode
        {
            get
            {
                if (string.IsNullOrWhiteSpace(_machineCode))
                {
                    _machineCode = _MD5.Encrypt(GetSignature() + "Windows_NT_MD5");
                    if(_machineCode.Length > 16)
                    {
                        _machineCode = _machineCode.Substring(8);
                    }
                }
                return _machineCode;
            }
        }

        /// <summary>
        /// 获得硬盘序列号
        /// </summary>
        /// <returns>硬盘序列号</returns>
        public static string GetSignature()
        {
            ManagementObjectSearcher searcher = new ManagementObjectSearcher("SELECT signature FROM Win32_DiskDrive");
            string signature = "";
            foreach (ManagementObject mgt in searcher.Get())
            {
                signature = mgt.GetPropertyValue("signature").ToString();
            }
            return signature;
        }

        public static string IP
        {
            get
            {
                string ip = "127.0.0.1";
                System.Net.IPAddress[] addressList = Dns.GetHostEntry(Dns.GetHostName()).AddressList;
                for (int i = 0; i < addressList.Length; i++)
                {
                    ip = addressList[i].ToString();
                }
                return ip;
            }
        }

        public static string HostName
        {
            get
            {
                return Dns.GetHostName();
            }
        }

        public static string MAC
        {
            get
            {
                string mac = "";
                var mc = new ManagementClass("Win32_NetworkAdapterConfiguration");
                ManagementObjectCollection moc = mc.GetInstances();
                foreach (ManagementObject mo in moc)
                {
                    if (mo["IPEnabled"].ToString() == "True")
                    {
                        mac = mo["MacAddress"].ToString();
                    }
                }
                return mac;
            }
        }

        public static bool CheckSN(string sn)
        {
            return _MD5.Encrypt(_MD5.Encrypt(MachineInfo.MachineCode + "ABCEFG") + "12345").Substring(0, 8).ToLower() == sn.ToLower();
        }
    }
}
