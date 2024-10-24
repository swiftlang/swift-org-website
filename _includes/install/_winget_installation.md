Install from the following WinGet configurations:

```powershell
$ winget configure -f {{ site.url }}/install/windows/winget/enable-configure-elevation.dsc.yaml
$ winget configure -f {{ site.url }}{{ page.dir }}configuration.dsc.yaml
```