using CefSharp.WinForms;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace MIXC
{
    public partial class MainFrame : Form
    {
        ChromiumWebBrowser _webCom = null;

        public MainFrame()
        {
            InitializeComponent();
        }

        private void MainFrame_Load(object sender, EventArgs e)
        {
#if DEBUG
            string url = System.Text.RegularExpressions.Regex.Replace(System.AppDomain.CurrentDomain.BaseDirectory, "(\\\\[^\\\\]+){6}\\\\$", "");
            url = System.IO.Path.Combine(url, "h5\\index.html");
#else
            string url = new CAjax().getFullUrl("/h5/0.0.1/index.html");
#endif

            _webCom = new CefSharp.WinForms.ChromiumWebBrowser(url);

            _webCom.Dock = DockStyle.Fill;

            _webCom.RegisterJsObject("CAjax", new CAjax());
            _webCom.RegisterJsObject("CBrowser", new CBrowser());

            _webCom.FrameLoadEnd += WebCom_FrameLoadEnd;

            _webCom.MenuHandler = new MenuHandler();

            this.Controls.Add(_webCom);
        }

        private void WebCom_FrameLoadEnd(object sender, CefSharp.FrameLoadEndEventArgs e)
        {
#if DEBUG
            // 开发自动打开浏览器调试窗口
            _webCom.GetBrowser().GetHost().ShowDevTools();
#endif
        }
    }
}
