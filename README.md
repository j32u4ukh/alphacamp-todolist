# alphacamp-todolist
Alphacamp todo list 專案

## 專案執行

### VS code 設置環境變數
```
$env:NODE_ENV="development"
```

### 程式運行
```
npm run dev
```

## 初始化
### Step 1 安裝相關套件

首先把相關套件安裝起來吧，需要安裝的有三個：mySQL、Sequelize、和 Sequelize CLI：

```
npm install mysql2@3.2.0 sequelize@6.30.0 sequelize-cli@6.6.0
```

### Step 2 透過 sequelize-cli 初始設置

在 Sequelize CLI 裡，已經把初始化時需要的設定寫成 sequelize init 腳本了，我們可以直接執行指令。這裡因為指令集安裝在工具目錄下，需要先使用 npx 指令來找到路徑，再呼叫 sequelize init：

```
npx sequelize init
```

指令執行後，請仔細看一下系統訊息，它就是自動幫你開了一些空的資料夾和檔案。

### Step 3 透過 sequelize-cli 建立 todo model

讓我們先加入 name 這個屬性，注意屬性之間不能有空白，空白在 command line 裡會被視為新的指令。

```
npx sequelize model:generate --name Todo --attributes name:string
```

這個指令會同時生成 migrations 和 models 當中的檔案，新建表格時可以使用這個。

## Migration

```
npx sequelize migration:generate --name migrationName
```

* up： `npx sequelize db:migrate`
* down： `npx sequelize db:migrate:undo`

## Seed

建立 Seed 檔案: `npx sequelize seed:generate --name initial-data`

執行 Seeder: `npx sequelize db:seed:all`

撤銷 Seeder: `npx sequelize db:seed:undo`

## 依賴套件安裝

### 安裝套件 passport 與 passport-local
```
npm install passport@0.6.0 passport-local@1.0.0
```


## 部屬
### 初始化
```
eb init
eb create
```

### 上傳到 AWS
```
eb deploy
```