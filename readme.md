初始化+编译（需求Node.js、NPM、Python3与PIP）
```batch
.\init.bat
cd js
npm install
npm run build
pip3 install -r requirements.txt
python3 server.pyw
```
WallpaperEngine -> 从本地加载壁纸  
将插件文件放入plugins文件夹即可加载自定义插件。
没有现成的插件吗？[插件编写教程](https://github.com/Rundll86/ShrimpOS/blob/main/docs/how-to-develop-plugins.md)