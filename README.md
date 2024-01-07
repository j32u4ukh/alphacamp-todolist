# alphacamp-todolist
Alphacamp todo list 專案


## Step 1 安裝相關套件

首先把相關套件安裝起來吧，需要安裝的有三個：mySQL、Sequelize、和 Sequelize CLI：

```
npm install mysql2@3.2.0 sequelize@6.30.0 sequelize-cli@6.6.0
```

## Step 2 透過 sequelize-cli 初始設置

在 Sequelize CLI 裡，已經把初始化時需要的設定寫成 sequelize init 腳本了，我們可以直接執行指令。這裡因為指令集安裝在工具目錄下，需要先使用 npx 指令來找到路徑，再呼叫 sequelize init：

```
npx sequelize init
```

指令執行後，請仔細看一下系統訊息，它就是自動幫你開了一些空的資料夾和檔案。

## Step 3 透過 sequelize-cli 建立 todo model

讓我們先加入 name 這個屬性，注意屬性之間不能有空白，空白在 command line 裡會被視為新的指令。

```
npx sequelize model:generate --name Todo --attributes name:string
```