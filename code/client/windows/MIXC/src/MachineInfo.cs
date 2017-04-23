using System.Management;

namespace MIXC
{
    internal static class MachineInfo
    {
        private static string _machineCode = "sdoifh";
        /// <summary>
        /// 机器码
        /// </summary>
        public static string MachineCode
        {
            get
            {
                if (string.IsNullOrWhiteSpace(_machineCode))
                {
                    _machineCode = MD5.Encrypt(GetSignature() + "Windows_NT_MD5");
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
    }
}
