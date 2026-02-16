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

## 🛠 Example

```bash
genpro
```

```
? Select project type: ui
? Select template version: 1.0.1
? Project name: my-app
```

Creates:

```
my-app/
```

---

## 🧠 Tech Stack

- inquirer
- degit
- axios
- chalk
- ora

---

## 🛣 Roadmap

- [ ] Auto npm install
- [ ] Template variable replacement
- [ ] Git initialization
- [ ] CI/CD ready templates
- [ ] Monorepo scaffolding
- [ ] Own template repo

---

## 📜 License

MIT
