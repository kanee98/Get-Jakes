# Get Jakes - cPanel Deployment & GitHub Actions Guide

This guide details how to publish the **Get Jakes** Next.js application & MySQL Database to your cPanel hosting server using GitHub Actions build artifacts.

---

## 🚀 Option A: Using GitHub Actions Artifacts (Manual Upload)

Every time you push code to `main` or `master`, GitHub Actions automatically compiles the Next.js production build and generates a deployment package zip.

### Step 1: Download Artifacts from GitHub
1. Go to your repository on GitHub: `https://github.com/kanee98/Get-Jakes`
2. Click on the **Actions** tab at the top.
3. Select the latest workflow run named **"Build & Deploy Get-Jakes to cPanel"**.
4. Scroll down to the **Artifacts** section at the bottom.
5. Click **`cpanel-getjakes-release`** to download the pre-built zip artifact.

### Step 2: Upload to cPanel File Manager
1. Log in to your **cPanel Dashboard**.
2. Open **File Manager** and navigate to your application root directory (e.g., `/public_html` or `/home/username/getjakes`).
3. Click **Upload** and select the downloaded zip file.
4. Once uploaded, right-click the zip file and choose **Extract**.

---

## ⚙️ Option B: Automatic Deployment via GitHub Actions (FTP Sync)

To have GitHub automatically upload built files to your cPanel server on every `git push`:

1. Go to your GitHub repository -> **Settings** -> **Secrets and variables** -> **Actions**.
2. Click **New repository secret** and add the following secrets:
   - `FTP_SERVER`: `ftp.yourdomain.com` (or your cPanel IP address)
   - `FTP_USERNAME`: `your_cpanel_ftp_username`
   - `FTP_PASSWORD`: `your_cpanel_ftp_password`
   - `FTP_SERVER_DIR`: `/public_html/` (or target directory on server)

---

## 🗄️ Database Setup on cPanel MySQL

1. In **cPanel**, open **MySQL Database Wizard**.
2. Create a new database (e.g., `username_getjakes`).
3. Create a MySQL user with a strong password and assign **All Privileges** to the database.
4. Open **phpMyAdmin** in cPanel:
   - Select your newly created database.
   - Click **Import** and upload `database/schema.sql`.
   - Click **Import** again and upload `database/seed.sql` to populate initial product and review data.

---

## 💻 Setting Up Node.js App in cPanel

1. In **cPanel**, click **Setup Node.js App** (under Software).
2. Click **Create Application**.
3. Fill in the fields:
   - **Node.js version**: Choose **20.x** or **18.x**.
   - **Application mode**: Select **Production**.
   - **Application root**: `getjakes` (or path to uploaded files).
   - **Application URL**: Select your domain name.
   - **Application startup file**: `app.js`
4. Add **Environment Variables** in the cPanel Node interface (or edit `.env`):
   - `DB_HOST` = `localhost`
   - `DB_USER` = `username_getjakes_user`
   - `DB_PASSWORD` = `your_db_password`
   - `DB_NAME` = `username_getjakes`
   - `DB_PORT` = `3306`
   - `NODE_ENV` = `production`
5. Click **Save** and then click **Run JS/NPM Install** or **Restart Application**.

---

## ✅ Verification & Health Check

Visit `https://yourdomain.com/api/health` to verify that your Node.js application and MySQL database connection are active and healthy!
