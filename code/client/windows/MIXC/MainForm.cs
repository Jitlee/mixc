using CefSharp.WinForms;
using System;
using System.Text;
using System.Windows.Forms;
using CefSharp;
using CefSharp.Internals;

namespace MIXC
{
    public partial class MainForm : Form
    {
        ChromiumWebBrowser _webCom = null;
        System.Threading.Timer _heartTimer = null; // 心跳

        public MainForm()
        {
            InitializeComponent();
        }

        private void MainForm_Load(object sender, EventArgs e)
        {
            string url = System.IO.Path.Combine(Config.H5Path, "index.html");

            _webCom = new CefSharp.WinForms.ChromiumWebBrowser(url);

            _webCom.Dock = DockStyle.Fill;

            var cbBrower = new CBrowser();

            _webCom.RegisterJsObject("CAjax", new CAjax());
            _webCom.RegisterJsObject("CBrowser", cbBrower);

            _webCom.FrameLoadEnd += WebCom_FrameLoadEnd;

            _webCom.MenuHandler = new MenuHandler();

            this.Controls.Add(_webCom);

            cbBrower.playAdsAction = BeginPlayAction;
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
            this._heartTimer = new System.Threading.Timer(Heart, null, 0, HEART_INTVAL);
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
                        UpdateConfig(rst, ajax, "adsTime", "180");
                        UpdateConfig(rst, ajax, "password", "8888");
                        UpdateConfig(rst, ajax, "shutdownTime", "1260");

                        // 定时关机
                        var shutdownTime = Config.ShutdownTime;
                        var now = DateTime.Now;
                        var minutes = DateTime.Now.Hour * 60 + DateTime.Now.Minute;
                        if (Math.Abs(minutes - shutdownTime) * 60 * 1000 <= HEART_INTVAL * 1.5)
                        {
                            Application.Exit();
                        }
                    }
                }
            }, null);
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
            sb.Append("&sn=");
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

        private void BeginPlayAction()
        {
            AdsForm ads = new AdsForm();
            if(ads.ShowDialog() != DialogResult.OK)
            {
                _webCom.ExecuteScriptAsync("__beginWatchAdsIdle()");
            }
        }
    }
}
