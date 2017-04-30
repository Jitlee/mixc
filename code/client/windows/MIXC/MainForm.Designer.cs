namespace MIXC
{
    partial class MainForm

    {
        /// <summary>
        /// 必需的设计器变量。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 清理所有正在使用的资源。
        /// </summary>
        /// <param name="disposing">如果应释放托管资源，为 true；否则为 false。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows 窗体设计器生成的代码

        /// <summary>
        /// 设计器支持所需的方法 - 不要修改
        /// 使用代码编辑器修改此方法的内容。
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MainForm));
            this.SNLabel = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // SNLabel
            // 
            this.SNLabel.AccessibleRole = System.Windows.Forms.AccessibleRole.None;
            this.SNLabel.BackColor = System.Drawing.Color.Transparent;
            this.SNLabel.CausesValidation = false;
            this.SNLabel.Enabled = false;
            this.SNLabel.FlatStyle = System.Windows.Forms.FlatStyle.Popup;
            this.SNLabel.Font = new System.Drawing.Font("微软雅黑", 36F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.SNLabel.ForeColor = System.Drawing.SystemColors.ScrollBar;
            this.SNLabel.Location = new System.Drawing.Point(152, 232);
            this.SNLabel.Name = "SNLabel";
            this.SNLabel.Size = new System.Drawing.Size(206, 81);
            this.SNLabel.TabIndex = 0;
            this.SNLabel.Text = "未注册";
            this.SNLabel.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // MainForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(370, 322);
            this.Controls.Add(this.SNLabel);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Name = "MainForm";
            this.Text = "导航软件";
            this.TopMost = true;
            this.WindowState = System.Windows.Forms.FormWindowState.Maximized;
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.MainForm_FormClosing);
            this.Load += new System.EventHandler(this.MainForm_Load);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Label SNLabel;
    }
}

