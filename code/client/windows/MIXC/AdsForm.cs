using CefSharp.WinForms;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MIXC
{
    public partial class AdsForm : Form
    {
        ChromiumWebBrowser _webCom = null;
        private SynchronizationContext _mainContext = null;
        public AdsForm()
        {
            InitializeComponent();
            this.DialogResult = DialogResult.OK;

#if DEBUG
            this.TopMost = false;
            this.WindowState = FormWindowState.Normal;
#endif
            _mainContext = SynchronizationContext.Current;
        }

        private void AdsForm_Load(object sender, EventArgs e)
        {
            string url = System.IO.Path.Combine(Config.H5Path, "ads.html");

            _webCom = new CefSharp.WinForms.ChromiumWebBrowser(url);

            _webCom.Dock = DockStyle.Fill;

            var cbBrower = new CBrowser();

            _webCom.RegisterJsObject("CAjax", new CAjax());
            _webCom.RegisterJsObject("CBrowser", cbBrower);

            _webCom.FrameLoadEnd += WebCom_FrameLoadEnd;

            _webCom.MenuHandler = new MenuHandler();

            this.Controls.Add(_webCom);

            cbBrower.closeAction = CloseWindowSafe;
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
        }

        private void CloseWindowSafe()
        {
            _mainContext.Post(CloseWindow, null);
        }

        private void CloseWindow(object state)
        {
            this.DialogResult = DialogResult.OK;
            this.Close();
        }
    }
}
