using CefSharp.WinForms;
using System;
using System.Text;
using System.Windows.Forms;
using CefSharp;
using CefSharp.Internals;
using System.Threading;

namespace MIXC
{
    public partial class MainForm : Form
    {
        ChromiumWebBrowser _webCom = null;
        private SynchronizationContext _mainContext = null;
        System.Threading.Timer _heartTimer = null; // 心跳

        public MainForm()
        {
            InitializeComponent();
#if DEBUG
            this.TopMost = false;
            this.WindowState = FormWindowState.Normal;
            this.FormBorderStyle = FormBorderStyle.Sizable;
#elif UPDATE
            this.TopMost = false;
            this.WindowState = FormWindowState.Normal;
            this.FormBorderStyle = FormBorderStyle.Sizable;
#endif
            _mainContext = SynchronizationContext.Current;
        }

        private void MainForm_Load(object sender, EventArgs e)
        {

            SNLabel.Left = this.Size.Width - SNLabel.Size.Width;
            SNLabel.Top = this.Size.Height - SNLabel.Size.Height;
            SNLabel.BackColor = System.Drawing.Color.Transparent;
            this.SNLabel.Visible = !MachineInfo.CheckSN(Config.SN);

            string url = System.IO.Path.Combine(Config.H5Path, "index.html");

            _webCom = new CefSharp.WinForms.ChromiumWebBrowser(url);

            _webCom.Dock = DockStyle.Fill;

            var cbBrower = new CBrowser();

            _webCom.RegisterJsObject("CAjax", new CAjax());
            _webCom.RegisterJsObject("CBrowser", cbBrower);

            _webCom.FrameLoadEnd += WebCom_FrameLoadEnd;

            _webCom.MenuHandler = new MenuHandler();

            this.Controls.Add(_webCom);

            cbBrower.playAdsAction = SafePlayAds;

            _webCom.SendToBack();
        }

        private void WebCom_FrameLoadEnd(object sender, CefSharp.FrameLoadEndEventArgs e)
        {
#if DEBUG
            // 开发自动打开浏览器调试窗口
            _webCom.GetBrowser().GetHost().ShowDevTools();
#elif UPDATE
            // 开发自动打开浏览器调试窗口
            _webCom.GetBrowser().GetHost().ShowDevTools();
#else
            
#endif
            this.StartHeart();
            Heart(null); // 手动心跳一次
        }

        const int HEART_INTVAL = 180000; // 心跳时间
        private void StartHeart()
        {
#if !DEBUG
            this._heartTimer = new System.Threading.Timer(Heart, null, 0, HEART_INTVAL);
#endif
        }

        private void Heart(object state)
        {
            var heartData = GetHeartData();
            CAjax ajax = new CAjax();

            ajax.postJSON("/api/terminal/active/" + Config.SourceId, heartData, (jsonString) =>
            {
                var data = ajax.Deserialize(jsonString);
                if (ajax.getIntValue(data, "code") == 200)
                {
                    var rst = ajax.getValue(data, "rst");
                    if (rst != null)
                    {
                        string oldAdsTime = Config.getValue("adsTime", "120");
                        UpdateConfig(rst, ajax, "adsTime", "180");
                        UpdateConfig(rst, ajax, "password", "8888");
                        UpdateConfig(rst, ajax, "shutdownTime", "1260");

                        _webCom.ExecuteScriptAsync("window.__beginWatchAdsIdle()");

                        // 定时关机
                        var shutdownTime = Config.ShutdownTime;
                        var now = DateTime.Now;
                        var minutes = DateTime.Now.Hour * 60 + DateTime.Now.Minute;
                        if (Math.Abs(minutes - shutdownTime) * 60 * 1000 <= HEART_INTVAL * 1.5)
                        {
                            Application.Exit();
                            return;
                        }

                        string lastVersion = ajax.getStringValue(rst, "lastVersion", "0.0.0");
                        // 检查版本
                        if (this.FormatVersion(lastVersion) > this.FormatVersion(Config.Version))
                        {
                            _webCom.ExecuteScriptAsync("window.__stopAds()");
                            // 下载更新
                            this._heartTimer.Dispose(); // 停止心跳
                            this._heartTimer = null;

                            SafeBeginUpdate();
                        }
                    }
                }
            }, null);
        }


        private int FormatVersion(string version)
        {
            if (string.IsNullOrWhiteSpace(version))
            {
                return 0;
            }
            var nums = version.Split('.');
            var result = 0;
            for (int i = 0, iCount = nums.Length; i < iCount; i++)
            {
                result += Convert.ToInt32(nums[i]) * (int)Math.Pow(2, 2 - i);
            }
            return result;
        }

        private string _heartData = null;
        private string GetHeartData()
        {
            if (!string.IsNullOrEmpty(this._heartData))
            {
                return this._heartData;
            }
            var sb = new StringBuilder();
            sb.Append("mac=");
            sb.Append(MachineInfo.MAC);
            sb.Append("&ip=");
            sb.Append(MachineInfo.IP);
            sb.Append("&code=");
            sb.Append(MachineInfo.MachineCode);
            this._heartData = sb.ToString();
            return this._heartData;
        }

        private void UpdateConfig(object obj, CAjax ajax, string key, string defaultValue)
        {
            var currentvalue = Config.getValue(key, defaultValue);
            var value = ajax.getStringValue(obj, key, currentvalue);
            Config.setValue(key, value);
        }

        private void MainForm_FormClosing(object sender, FormClosingEventArgs e)
        {
            if(this._heartTimer != null)
            {
                this._heartTimer.Dispose();
            }
        }

        private void SafePlayAds()
        {
            _mainContext.Post(PlayAds, null);
        }

        private void PlayAds(object state)
        {
            AdsForm ads = new AdsForm();
            ads.ShowDialog(this);
            _webCom.ExecuteScriptAsync("__beginWatchAdsIdle()");
        }

        private void SafeBeginUpdate()
        {
            _mainContext.Post(BeginUpdate, null);
        }

        private void BeginUpdate(object state)
        {
            // 开始自动更新版本
            var splashForm = new SplashForm();
            splashForm.ShowDialog(this);
            // 前端刷新网络
            _webCom.Reload();
            this.StartHeart();
        }

        public void HideSNLabel()
        {
            SNLabel.Visible = false;
        }
    }
}
