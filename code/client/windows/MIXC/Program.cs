using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;

namespace MIXC
{
    static class Program
    {
        /// <summary>
        /// 应用程序的主入口点。
        /// </summary>
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

#if DEBUG
            Application.Run(new MainForm());
#else
            SplashForm splashForm = new SplashForm();
            splashForm.ShowDialog();
            Application.Run(new MainForm());
#endif
        }
    }
}
