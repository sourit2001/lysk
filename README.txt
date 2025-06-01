# 恋与深空 - 图片站

本项目是一个基于Web的图片画廊，专门用于展示游戏《恋与深空》中的角色和艺术作品。它具有动态图片加载、基于标签的筛选、分页和多语言支持等功能。

## 主要功能

*   **动态图片展示**: 图片从 `images_data.json` 文件动态加载。
*   **图片详情**: 点击缩略图会打开一个模态窗口，显示完整图片、名称、尺寸和相关标签。
*   **标签筛选**: 通过点击标签来筛选图片。
*   **分页浏览**: 通过页面导航浏览图片。
*   **多语言支持**: 界面可以在多种语言之间切换（例如：中文、英文、日文、韩文、法文、德文）。
*   **响应式设计**: 使用 CSS 构建，以适应不同设备的显示。

## 技术栈

*   HTML5
*   CSS3 (Tailwind CSS)
*   原生 JavaScript (ES6+)
*   Node.js (用于图片数据生成脚本)
*   `image-size` (Node.js 脚本使用的 npm 包)

## 项目结构

```
/
├── css/
│   └── styles.css         # 编译后的 Tailwind CSS
├── images/                # 存放所有图片文件 (建议按子文件夹组织以作为标签)
│   ├── 角色名_1/
│   │   └── image1.jpg
│   └── ...
├── js/
│   ├── gallery.js         # 图库、模态框、分页、筛选的核心逻辑
│   └── i18n.js            # 国际化和语言切换逻辑
├── locales/               # 存放翻译的 JSON 文件
│   ├── de.json
│   ├── en.json
│   ├── fr.json
│   ├── ja.json
│   ├── ko.json
│   ├── zh-CN.json
│   └── zh-TW.json
├── index.html             # 图库的主 HTML 文件
├── images_data.json       # 生成的 JSON 文件，包含所有图片的元数据
├── generate_image_data.js # Node.js 脚本，用于扫描 images/ 文件夹并创建 images_data.json
├── package.json           # 列出图片生成脚本的依赖项 (例如 image-size)
├── package-lock.json      # 记录依赖项的精确版本
└── README.txt             # 本文件 (或 README.md)
```

## 本地安装与运行

1.  **环境准备**:
    *   必须安装 Node.js 和 npm (Node 包管理器) 才能运行图片生成脚本。您可以从 [nodejs.org](https://nodejs.org/) 下载。

2.  **克隆仓库 (可选)**:
    如果项目已上传到 GitHub，可以克隆它：
    ```bash
    git clone https://github.com/sourit2001/lysk.git
    cd lysk
    ```

3.  **安装脚本依赖**:
    在项目根目录的终端中运行：
    ```bash
    npm install image-size
    ```
    这将安装 `generate_image_data.js` 使用的 `image-size` 包。(如果 `package.json` 文件中已包含 `image-size` 作为依赖，则只需运行 `npm install`)。

4.  **准备图片**:
    *   将您的图片文件放入 `images/` 目录。
    *   建议在 `images/` 目录内创建子文件夹来组织图片 (例如 `images/Xavier`, `images/Rafayel`)。这些子文件夹的名称将用作标签。

5.  **生成图片数据**:
    运行 Node.js 脚本来扫描 `images/` 文件夹并创建/更新 `images_data.json` 文件：
    ```bash
    node generate_image_data.js
    ```
    此文件对于图库查找和显示图片至关重要。

6.  **查看图库**:
    在您的网页浏览器中打开 `index.html` 文件。
    *   您可以直接双击该文件。
    *   为了获得更好的体验 (尤其是在处理本地文件限制或希望实时重新加载时)，您可以使用本地 Web 服务器。如果您安装了 Node.js，可以安装并使用 `live-server`：
        ```bash
        npm install -g live-server
        live-server
        ```
        然后在浏览器中打开提供的 localhost 地址。

## 添加或更新图片

1.  在 `images/` 目录 (及其子目录) 中添加、删除或修改图片文件。
2.  重新运行 `generate_image_data.js` 脚本以更新 `images_data.json`：
    ```bash
    node generate_image_data.js
    ```
3.  如果您使用 Git 进行版本控制，请提交更改 (新的/修改的图片和更新后的 `images_data.json`) 并将其推送到您的仓库。

## 本地化 (i18n)

*   **翻译文件**: 语言翻译存储在 `locales/` 目录下的 JSON 文件中 (例如 `en.json`, `zh-CN.json`)。
*   **添加/编辑翻译**:
    1.  修改 `locales/` 中的现有 JSON 文件以更新不同 UI 元素的文本。
    2.  如果添加新的可翻译字符串，请确保它们在所有语言文件中都有对应的键，并在 `js/i18n.js` 中被引用 (例如，在 `translations` 对象中或通过 `getTranslation('yourKey')` 使用)。
    3.  `index.html` 文件中使用 `data-i18n="yourKey"` 属性来标记需要翻译的元素。

## 部署

本网站由静态文件 (HTML, CSS, JS, JSON, 图片) 组成，可以部署到任何静态 Web 托管服务。一些流行的免费/简易选项包括：

*   **GitHub Pages**: 直接与您的 GitHub 仓库集成。
*   **Netlify**: 提供从 GitHub 的持续部署、自定义域名等功能。
*   **Vercel**: 与 Netlify 类似，非常适合静态站点和现代 Web 应用。

在部署之前，请确保所有文件，包括生成的 `images_data.json` 和 `images/` 文件夹的内容，都已推送到您的仓库。
