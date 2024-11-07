import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('kanbanBoard.start', () => {
      // 创建 Webview Panel
      const panel = vscode.window.createWebviewPanel(
        'kanbanBoard',
        'Kanban Board',
        vscode.ViewColumn.One,
        {
          enableScripts: true, // 启用脚本
          retainContextWhenHidden: true // 可选，保留 Webview 状态
        }
      );

      // 设置 Webview 的 HTML 内容
      panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);
    })
  );
}

function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  // 获取打包生成的 webview.js 文件的 URI
  const scriptPathOnDisk = vscode.Uri.file(
    path.join(extensionUri.fsPath, 'dist', 'webview.js')
  );
  const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

  // 返回 HTML 字符串，包含应用的容器和脚本引用
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kanban Board</title>
</head>
<body>
  <div id="app">Loading...</div>
  <script src="${scriptUri}"></script>
  <script>
    console.log("Checking if webview.js is loaded...");
  </script>
</body>

</html>`;
}
