# 🚀 GenPro CLI

CLI tool to generate **UI / API / Fullstack** projects from versioned GitHub templates.

---

## ✨ Features

- 📦 Select project type (ui / api / fullstack)
- 🔢 Select template version
- ⬇️ Downloads template at runtime from GitHub
- 🧱 Clean project scaffold
- ⚡ Simple and fast

---

## 📦 Installation

### Global Install

```bash
npm install -g genpro-cli
```

---

## 🚀 Usage

```bash
genpro
```

You will be prompted for:

- Project type
- Template version
- Project name

---

## 📁 Template Repository Structure

Templates are pulled from [Gen Pro Templates Repo](https://github.com/muralikrishnat/pro-gen-templates)

Put together some templates in UI which is available [Boilerplate Hub](https://boilerplate-hub.web.app/)

## 🛠 Example

```bash
genpro
```

```
? Select project type: ui
? Select template version: v1
? Project name: my-app
```

Creates:

```
my-app/
```
### Quick way to get templates

Here you can pass the project type, template version and project name in single command

#### For API

```bash
genpro --api --version=v1 --name=api-app-v1

```

#### For UI
```bash
genpro --ui --version=v1 --name=ui-app-v1
```


---

## 🧠 Tech Stack

- inquirer
- degit

---

## 📜 License

MIT
