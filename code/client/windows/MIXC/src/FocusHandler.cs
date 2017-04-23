using System;
using CefSharp;

namespace MIXC
{
    internal class FocusHandler : IFocusHandler
    {
        public void OnGotFocus()
        {
        }

        public bool OnSetFocus(CefFocusSource source)
        {
            return true;
        }

        public void OnTakeFocus(bool next)
        {
        }
    }
}
