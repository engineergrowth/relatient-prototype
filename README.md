# 🗓️ Relatient Scheduling API (Mock)

[![Deployed on Railway](https://img.shields.io/badge/Live%20Demo-Railway-blue?logo=railway)](https://relatient-production.up.railway.app/api-docs)

This is a mock API focused on **patient scheduling workflows**, built to demonstrate REST API development, documentation with Swagger/OpenAPI, and healthcare-relevant routing patterns.

While Relatient's API ecosystem is expansive, this project intentionally covers just a narrow slice of functionality (specifically, core scheduling capabilities) to showcase relevant backend skills and a developer-friendly documentation experience.

---

## 🔍 Live API Docs

👉 [**View interactive Swagger docs**](https://relatient-production.up.railway.app/api-docs)

You can explore all available endpoints and example data directly in the Swagger UI.

---

## 🧩 What's Included

This mock API simulates a scheduling system similar to features described in **Relatient's Dash Direct API**:

- **/patients** – Create and retrieve patient records
- **/appointments** – Book, update, and cancel appointments
- **/providers** – View available healthcare providers

It’s designed to represent the type of workflow integrations Relatient offers through Dash for:

- Self-scheduling
- Provider-matching
- Appointment confirmations & management

The implementation is minimal and entirely in-memory for demo purposes.

---

## 🛠️ Tech Stack

- **Node.js** + **Express**
- **swagger-jsdoc** + **swagger-ui-express**
- **Deployed on Railway**

---

## 🚀 Local Setup

```bash
git clone https://github.com/engineergrowth/relatient-prototype.git
cd relatient-scheduling-mock
npm install
npm start
