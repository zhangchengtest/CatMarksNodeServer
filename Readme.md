# NetMarks
###### 计划开发一款用于记录和同步网络书签的Web应用。
* 架构选取基于Restful风格的Web API来实现；
* 后端采用Node.js+MongoDB+Redis；
* 前端主要使用Angular Sass；
* 工具用到 Git+Yeoman+Grunt+Bower。
<hr>

## 目的
* 初衷是解决自己网络书签同步的问题，目前在用Raindrop.io同步，体验很好，所以也萌生了自己开发的念头
* 将自己近期学到的知识点整合熟练
<hr>

## 数据库设计

### 用户信息表 users
| 字段名 | 数据类型 | 描述 |
| --- | --- | --- |
| id | ObjectId | 编号 |
| username | string | 用户名 |
| password | string | 密码 |
| email | string | 邮箱 |
| register_time | int | 注册时间 |
| recently_time | int | 最近登录 |
| role | int | 权限 |
| level | int | 等级 |
| status | int | 状态 |

### 书签表 marks
| 字段名 | 数据类型 | 描述 |
| --- | --- | --- |
| id | ObjectId | 编号 |
| title | string | 标题 |
| uri | string | 链接 |
| decribe | string | 描述 |
| content | string | 内容 |
| tags | array | 标签 |
| sort | int | 排序 |
| status | int | 状态 |
| date | int | 创建日期 |
| user_id | ObjectId | 所属用户 |
| folder_id | ObjectId | 所属文件夹 |

### 文件夹表 folders
| 字段名 | 数据类型 | 描述 |
| --- | --- | --- |
| id | ObjectId | 编号 |
| title | string | 标题 |
| describe | string | 描述 |
| sort | int | 排序 |
| status | int | 状态 |
| date | int | 创建日期 |
| user_id | ObjectId | 所属用户 |
| folder_id | ObjectId | 所属文件夹 |
