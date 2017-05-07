
del %~sdp0\点餐软件.rar

"C:\Program Files (x86)\MSBuild\14.0\bin\msbuild" %~sdp0\code\client\windows\MIXC\MIXC.csproj /p:Configuration="Release";Platform=x64;VisualStudioVersion=14.0 /tv:14.0 /v:M /fl /flp:LogFile=msbuild.log;Verbosity=diag /nr:false /t:Rebuild

%~sdp0\winrar\WinRAR.exe -y -inul -ep a 导航软件x64.rar  %~sdp0\code\client\windows\MIXC\bin\x86\Release\导航软件.exe %~sdp0\code\client\windows\MIXC\bin\x86\Release\dc.ini %~sdp0\code\client\windows\MIXC\bin\x86\Release\CefSharp.BrowserSubprocess.exe %~sdp0\code\client\windows\MIXC\bin\x86\Release\*.dll %~sdp0\code\client\windows\MIXC\bin\x86\Release\*.bin %~sdp0\code\client\windows\MIXC\bin\x86\Release\*.dat %~sdp0\code\client\windows\MIXC\bin\x86\Release\*.pak

@echo.
@echo [%date:~0,4%年%date:~5,2%月%date:~8,2%日 %time:~0,2%:%time:~3,2%:%time:~6,2%]
@echo 打包成功：  导航软件x64.rar
@echo.
@echo.
@pause