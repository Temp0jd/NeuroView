# NeuroView 项目概述

## 项目简介

NeuroView 是一个用于探索和可视化大脑区域多组学数据的基于 Web 的交互式平台。该项目为研究人员提供了一个直观的界面，用于搜索、筛选和可视化神经科学相关的基因组学研究数据。

---

## 项目架构

### 技术栈

| 类别 | 技术 |
|------|------|
| **后端框架** | Flask (Python) |
| **前端** | HTML, CSS, Vanilla JavaScript |
| **数据可视化** | Plotly.js |
| **数据库** | MariaDB / PostgreSQL |
| **数据处理** | pandas, numpy, scipy |
| **生物信息学** | scanpy, anndata |

### 版本

项目包含两个主要版本：

1. **JS Version (旧版)** - `[JS version_old/](JS version_old/)`
   - 使用静态 JSON/JS 文件加载数据
   - 适用于原型开发和演示

2. **Server Version (当前版本)** - `[server version/](server version/)`
   - 连接数据库进行动态查询
   - 实时生成 Plotly.js 可视化
   - 生产环境部署版本

---

## 核心功能模块

### 1. 首页 (Home)
- **路径**: `/home`
- **功能**: 作为中心枢纽，链接到各个核心功能模块
- **模板**: [`home.html`](server version/templates/home.html)

### 2. 研究检索 (Studies)
- **路径**: `/studies`
- **功能**:
  - 可搜索、可筛选的研究元数据展示卡片
  - 支持的筛选条件:
    - 物种 (Species)
    - 大脑区域 (Region/Subregion)
    - 测序类型 (Seq_Type)
    - 期刊 (Journal)
    - 发表年份 (Year)
    - 研究焦点 (Focus)
  - CSV 导出功能
- **API**: [`/api/get_studies`](server version/home.py#L46), [`/api/filter_studies`](server version/home.py#L83)
- **模板**: [`studies.html`](server version/templates/studies.html)

### 3. 脑区图谱 (Portrait)
- **路径**: `/portrait`
- **功能**:
  - 可点击的解剖学脑图谱
  - 高亮显示特定区域的相关研究
  - 区域选择联动研究列表
- **API**: [`/api/portrait_studies`](server version/home.py#L148)
- **模板**: [`portrait.html`](server version/templates/portrait.html)

### 4. 数据查看器 (Data Viewer)
- **路径**: `/viewer`
- **功能**:
  - UMAP 嵌入可视化
  - 交互式单细胞数据探索
  - 支持区域特定数据视图
- **模板**: [`viewer.html`](server version/templates/viewer.html)

### 5. 帮助页面 (Help)
- **路径**: `/help`
- **功能**: 用户指南和使用说明
- **模板**: [`help.html`](server version/templates/help.html)

---

## 数据库架构

### 数据表结构

数据库位于 `[server version/Database table/](server version/Database table/)`，包含以下核心表：

| 表名 | 描述 |
|------|------|
| **Publication** | 研究出版物元数据 |
| **Dataset** | 数据集信息 |
| **Publication_Dataset** | 出版物与数据集关联 |
| **Dataset_Region** | 数据集与大脑区域关联 |
| **Region** | 大脑区域定义 |
| **Subregion** | 大脑子区域定义 |

### 关键数据字段

- `Year_of_Publication`: 发表年份
- `Journal`: 期刊名称
- `Title`: 研究标题
- `Summary`: 研究摘要
- `Focus`: 研究焦点
- `Dataset_Link`: 数据集链接
- `Sample_Number`: 样本数量
- `Lifestage`: 生命阶段
- `Seq_Type`: 测序类型
- `Species`: 物种
- `Region`: 大脑区域
- `Subregion`: 大脑子区域

---

## API 端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/get_studies` | GET | 获取所有研究数据 |
| `/api/filter_studies` | POST | 根据条件筛选研究 |
| `/api/portrait_studies` | POST | 获取特定脑区的研究 |
| `/api/download_csv` | GET | 下载当前筛选结果为 CSV |

---

## 项目结构

```
NeuroView/
├── LICENSE                      # MIT 开源许可证
├── README.md                    # 项目说明文档
├── requirements.txt             # Python 依赖
├── PROJECT_OVERVIEW.md          # 项目概述（本文件）
├── .git/                        # Git 版本控制
├── .vscode/                     # VSCode 配置
├── JS version_old/              # 前端版本（已弃用）
│   ├── app.py
│   ├── static/
│   │   ├── img/
│   │   ├── js/
│   │   └── style.css
│   └── templates/
│       ├── index.html
│       ├── studies.html
│       ├── portrait.html
│       ├── viewer.html
│       └── help.html
└── server version/              # 服务器版本（当前使用）
    ├── home.py                  # Flask 应用主文件
    ├── Database table/          # 数据库架构定义
    ├── static/
    │   ├── css/                 # 样式文件
    │   ├── js/                  # JavaScript 文件
    │   ├── img/                 # 图片资源
    │   └── data/                # 静态数据文件
    └── templates/
        ├── home.html
        ├── studies.html
        ├── portrait.html
        ├── viewer.html
        └── help.html
```

---

## 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/Temp0jd/NeuroView.git
cd NeuroView
```

### 2. 安装依赖
```bash
pip install -r requirements.txt
```

### 3. 配置数据库
编辑 [`server version/home.py`](server version/home.py) 中的数据库配置：
```python
db_config = {
    "user": "your_user",
    "password": "your_password",
    "host": "localhost",
    "port": 3306,
    "database": "your_database"
}
```

### 4. 初始化数据库
```bash
flask db init
flask db migrate
flask db upgrade
```

### 5. 运行应用
```bash
cd "server version"
python home.py
```

### 6. 访问
打开浏览器访问 `http://127.0.0.1:5000/home`

---

## 未来改进计划

- [ ] 支持用户上传自定义数据集 (CSV/loom 格式)
- [ ] 添加图谱、特征、细胞类型的下拉选择器
- [ ] 扩展空间转录组学支持
- [ ] 添加差异表达分析模块
- [ ] 优化大数据集的加载性能

---

## 许可证

MIT License - 详见 [LICENSE](LICENSE)

---

## 联系方式

**作者**: Xinyu Li (Temp0jd)
**邮箱**: tempojd@bu.edu
**GitHub**: https://github.com/Temp0jd/NeuroView

---

*最后更新: 2025年1月14日*
