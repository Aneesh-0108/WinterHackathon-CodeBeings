#  Winter Hackathon - Repository Setup Guide

Welcome to the Winter Hackathon organized by **Sceptix** and **GDG SJEC**! To track your progress and collaborate effectively, every team must fork the official repository and follow the steps below.

---

##  Fork the Repository

1. Go to the GitHub page: [https://github.com/gdgsjec/WinterHackathon-TEAM_NAME-](https://github.com/gdgsjec/WinterHackathon-TEAM_NAME-)
2. Click on the **"Fork"** button in the upper-right corner of the page
3. Assign the repository name as `WinterHackathon-<TeamName>`
> 📝 **Note:** Please use **[PascalCase](https://pascal-case.com/)** for your team name.


**Example:**
```
Repository Name: WinterHackathon-BossBandit
```

---

##  Clone Your Forked Repository

1. Go to your forked repository on GitHub
2. Click the green **"Code"** button, then click the clipboard icon to copy the URL
3. Open your terminal and run the following command to copy the repository to your local machine (replace `<repository-url>` with your forked repository URL):

```bash
git clone <repository-url>
```

---

##  Start Working on Your Project

Begin building your solution! Collaborate with your teammates and push changes regularly.

---
## Update the README (Mandatory)

Before writing any code, replace the existing README.md with information specific to your project.
Your README is the first thing mentors and judges will see, so make sure it clearly explains what you built and why.
You can replace the README with the recommended template below and update the contents as you work on the project.

### Recommended Format for README:
Use the structure below:
```
 # Arcade Companion– Hybrid AI Chatbot for Google Cloud Arcade & Skill Boost

## Description
Arcade Assist is a hybrid AI-powered chatbot designed to support participants of Google Cloud Arcade and Skill Boost programs by providing instant, accurate answers to common queries.

Participants often face repeated issues related to labs, badges, eligibility, deadlines, and progress tracking, which leads to repetitive questions in community groups and delays in responses from organizers.
This project solves that problem by combining a rule-based knowledge system with AI intelligence to understand user queries, classify them, and respond safely.

When a query cannot be resolved automatically or requires account-level verification, the chatbot responsibly escalates the issue and logs it for organizers, ensuring human-in-the-loop support.

Target Users:

Google Cloud Arcade & Skill Boost participants

Community organizers and mentors

# Demo Video Link: <insert Google Drive link to the demo video of the working of your project>

## Features
✅ Instant Query Resolution using a curated, domain-specific knowledge base
🧠 Hybrid AI Architecture (Rule-based + AI fallback) for safe and explainable responses
🚨 Smart Escalation Handling for unresolved or account-specific issues
📊 Firebase Logging Dashboard for organizers to track escalated queries
⚡ Lightweight Chat Interface for real-time interaction
🛡️ Responsible AI Design – avoids hallucinations and unsafe answers
- 

## Tech Stack
Frontend

React (Vite)

HTML, CSS

Fetch API for backend communication

Backend

Node.js

Express.js

Modular service-based architecture

AI & Logic

Rule-based intent classification

AI fallback for low-confidence queries

Keyword-driven knowledge lookup (knowledge.json)

## Google Technologies Used


List the Google technologies you used and clearly explain **why** you chose them.

Firebase Firestore –
Used to log escalated queries in real time, enabling organizers to review unresolved issues and provide manual assistance.

Google Cloud (Conceptual Integration) –
The chatbot is designed to be cloud-ready and can be deployed on Google Cloud Run or App Engine for scalable backend hosting.

Google Gemini API (Optional / Controlled Use) –
Used as a fallback AI layer to assist with rephrasing or general guidance when rule-based responses are insufficient, while maintaining safety through escalation logic.

## Setup Instructions
Steps to run the project locally:
1. Clone the repository
2. Install dependencies
3. Add environment variables (if any)
4. Run the project

## Team Members
- Aneesh Hebbar
- Akshaj Shetty
- Deekshith Shetty
```


## Commit Your Changes

Track and save your progress using Git:

### Check the status of your changes
```bash
git status
```

### Stage your changes
Use the `git add` command to stage the changes you want to commit:
```bash
git add .
```

### Commit with a meaningful message

#### **Option 1: Simple Commit Format** (Beginner Friendly)
Use this if you're new to Git:
```bash
git commit -m "Your descriptive commit message"
```

#### **Option 2: Conventional Commits** (Recommended)
Follow this format for more structured, professional commit history:
```bash
git commit -m "<type>(<scope>): <subject>"
```

**Commit Types:**

| Type | Purpose |
|------|---------|
| `feat` | For a new feature for the user, not a new feature for build script. Such commit will trigger a release bumping a MINOR version |
| `fix` | For a bug fix for the user, not a fix to a build script. Such commit will trigger a release bumping a PATCH version |
| `perf` | For performance improvements. Such commit will trigger a release bumping a PATCH version |
| `docs` | For changes to the documentation |
| `test` | For adding missing tests, refactoring tests; no production code change |
| `style` | For formatting changes, missing semicolons, etc |
| `refactor` | For refactoring production code, e.g. renaming a variable |
| `build` | For updating build configuration, development tools or other changes irrelevant to the user |

- **Scope:** Area of change (e.g., api, ui, auth)
- **Subject:** One-line summary in present tense, no period at the end

**Example:**
```bash
git commit -m "fix(button): fix submit button not working"
```

---

## Push Your Changes

Send your local commits to GitHub:
```bash
git push origin
```

---

##  Tips for Success

- **Commit often:** Small, frequent commits help track progress and fix bugs easily
- **Write clear messages:** Describe what you did in each commit
- **Collaborate:** Make sure everyone in your team contributes
- **Stay organized:** Use branches for different features if needed
- **Test regularly:** Ensure your code works before pushing

---

##  Need Help?

For any issues or doubts, reach out to the organizing team.

**Happy Hacking!** ✨

---

*Organized by Sceptix & GDG SJEC*  
