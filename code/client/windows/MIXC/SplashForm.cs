using ICSharpCode.SharpZipLib.Zip;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MIXC
{
    public partial class SplashForm : Form
    {
        private SynchronizationContext _mainContext = null;
        public SplashForm()
        {
            InitializeComponent();

            this.BackgroundImage = (Bitmap)Properties.Resources.ResourceManager.GetObject("Splash");

            _mainContext = SynchronizationContext.Current;
        }

        private void SplashForm_Load(object sender, EventArgs e)
        {
            this.SetMessage("正在请求服务器...");
            string url = "/api/release/last/" + Config.SourceId + "/" + Config.Version;
            CAjax ajax = new CAjax();
            ajax.getJSON(url, (jsonString) =>
            {
                var data = ajax.Deserialize(jsonString);
                if(ajax.getIntValue(data, "code") == 200)
                {
                    var rst = ajax.getValue(data, "rst");
                    if(rst != null)
                    {
                        var releaseVersion = FormatVersion(ajax.getStringValue(rst, "releaseVersion"));
                        var localVersion = FormatVersion(Config.Version);
                        if(releaseVersion > localVersion)
                        {
                            this.SetMessageSafe("准备下载最新的资源...");
                            var zipUrl = Config.getFullUrl("/" + ajax.getStringValue(rst, "releaseFile"));
                            var localPath = Path.Combine(Config.H5Path, "update.zip");
                            if(!Directory.Exists(Config.H5Path))
                            {
                                Directory.CreateDirectory(Config.H5Path);
                            }
                            this.DownloadFile(zipUrl, localPath, (isSuccess) =>
                            {
                                if(isSuccess)
                                {
                                    this.SetMessageSafe("准备解压资源...");
                                    this.UnZipFile(localPath, Config.H5Path, (unzipSuccess) =>
                                    {
                                        if(unzipSuccess)
                                        {
                                            this.SetMessageSafe("更新最新的资源成功...");
                                        } else
                                        {
                                            this.SetMessageSafe("更新最新的资源失败...");
                                        }
                                        this.SetupMainSafe();
                                    });
                                }
                                else
                                {
                                    this.SetMessageSafe("下载最新资源失败...");
                                    this.SetupMainSafe();
                                }
                            });
                        }
                        else
                        {
                            this.SetMessageSafe("已经是最新版本了...");
                            this.SetupMainSafe();
                        }
                    }
                    else
                    {
                        this.SetMessageSafe("请求服务器失败...");
                        this.SetupMainSafe();
                    }
                }
                else
                {
                    this.SetMessageSafe("请求服务器失败...");
                    this.SetupMainSafe();
                }
            }, (error) => {
                this.SetMessageSafe("请求服务器失败...");
                this.SetupMainSafe();
            });
        }

        private int FormatVersion(string version)
        {
            if(string.IsNullOrWhiteSpace(version))
            {
                return 0;
            }
            var nums = version.Split('.');
            var result = 0;
            for(int i = 0, iCount = nums.Length; i < iCount; i++)
            {
                result += Convert.ToInt32(nums[i]) * (int)Math.Pow(2, 2 - i);
            }
            return result;
        }

        public void DownloadFile(string url, string filename, Action<bool> callback)
        {
            try
            {
                WebClient webClient = new WebClient();
                webClient.DownloadFileCompleted += new AsyncCompletedEventHandler((sender, e) =>
                {
                    callback(true);
                });
                webClient.DownloadProgressChanged += new DownloadProgressChangedEventHandler(ProgressChanged);
                webClient.DownloadFileAsync(new Uri(url), filename);
            }
            catch(Exception ex)
            {
                callback(false);
            }
        }

        private void ProgressChanged(object sender, DownloadProgressChangedEventArgs e)
        {
            this.SetMessageSafe(string.Format("正在下载最新的资源{0}%...", e.ProgressPercentage));
        }

        private void SetMessageSafe(string message)
        {
            _mainContext.Post(SetMessage, message);
        }

        private void SetMessage(object message)
        {
            MessageLabel.Text = message.ToString();
        }

        private void SetupMainSafe()
        {
            _mainContext.Post(SetupMain, null);
        }

        private void SetupMain(object state)
        {
            this.DialogResult = DialogResult.OK;
            this.Close();
        }

        private void UnZipFile(string zipFilePath, string targetDir, Action<bool> callback)
        {
            if (!File.Exists(zipFilePath))
            {
                callback(false);
                return;
            }
            

            Thread th = new Thread(() => {
                try
                {
                    string path = targetDir;
                    //解压出来的文件保存的路径
                    string rootDir = "";
                    ZipEntry ziEntry = null;
                    //读取压缩文件(zip文件),准备解压缩
                    using (ZipInputStream inputStream = new ZipInputStream(File.OpenRead(zipFilePath)))
                    {
                        //根目录下的第一个子文件夹的名称
                        while ((ziEntry = inputStream.GetNextEntry()) != null)
                        {
                            rootDir = Path.GetDirectoryName(ziEntry.Name);
                            //得到根目录下的第一级子文件夹的名称
                            if (rootDir.IndexOf("\\") >= 0)
                            {
                                rootDir = rootDir.Substring(0, rootDir.IndexOf("\\") + 1);
                            }
                            string dir = Path.GetDirectoryName(ziEntry.Name);
                            //根目录下的第一级子文件夹的下的文件夹的名称
                            string fileName = Path.GetFileName(ziEntry.Name);
                            //根目录下的文件名称
                            if (dir != " ")
                            //创建根目录下的子文件夹,不限制级别
                            {
                                if (!Directory.Exists(targetDir + "\\" + dir))
                                {
                                    path = targetDir + "\\" + dir;
                                    //在指定的路径创建文件夹
                                    Directory.CreateDirectory(path);
                                }
                            }
                            else if (dir == " " && fileName != "")
                            //根目录下的文件
                            {
                                path = targetDir;
                            }
                            else if (dir != " " && fileName != "")
                            //根目录下的第一级子文件夹下的文件
                            {
                                if (dir.IndexOf("\\") > 0)
                                //指定文件保存的路径
                                {
                                    path = targetDir + "\\" + dir;
                                }
                            }

                            if (dir == rootDir)
                            //判断是不是需要保存在根目录下的文件
                            {
                                path = targetDir + "\\" + rootDir;
                            }

                            //以下为解压缩zip文件的基本步骤
                            //基本思路就是遍历压缩文件里的所有文件,创建一个相同的文件。
                            if (fileName != String.Empty)
                            {
                                using (FileStream streamWriter = File.Create(path + "\\" + fileName))
                                {
                                    int size = 2048;
                                    byte[] data = new byte[2048];
                                    while (true)
                                    {
                                        size = inputStream.Read(data, 0, data.Length);
                                        if (size > 0)
                                        {
                                            streamWriter.Write(data, 0, size);
                                        }
                                        else
                                        {
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    callback(true);
                }
                catch(Exception ex)
                {
                    callback(false);
                }
            }); // end thread
            th.IsBackground = true;
            th.Start();
        }
    }
}
