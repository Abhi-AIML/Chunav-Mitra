# Technical Excellence: Chunav Mitra Architecture

This document outlines the architectural and design decisions that make **Chunav Mitra** a production-grade, high-fidelity AI agent platform.

## 🏛️ Agent-Canvas Architecture
Unlike traditional chatbots that only return text, Chunav Mitra uses a split-screen **Agent-Canvas architecture**:
1.  **AI Orchestrator (The Agent)**: Powered by **Gemini 2.0 Flash**, the agent understands complex electoral queries and determines the best visual tool to explain the answer.
2.  **Visual Renderer (The Canvas)**: A specialized React layer that renders native components (Simulators, Maps, Timelines) based on the agent's instructions.

## 🛠️ Engineering Highlights

### 1. Secure Tool Orchestration
We implemented a **Server-Side Tool Proxy**. When Gemini suggests a tool call (e.g., `find_polling_booth`), the backend intercepts this call to:
- Inject sensitive environment variables (like **Google Maps API Keys**) server-side.
- Prevent exposing secrets to the client-side code.
- Validate tool arguments using **Pydantic** before execution.

### 2. High-Fidelity Design System
The UI is built with a custom **Tricolor Design System** (Saffron, White, Green):
- **Glassmorphism**: Uses `backdrop-blur` and semi-transparent layers for a modern, premium feel.
- **Accessibility**: 100% ARIA-compliant interactive elements with high-contrast color palettes.
- **Micro-animations**: Leverages `framer-motion` for smooth, meaningful transitions between election phases.

### 3. Production-Grade Observability & Security
Built for the Google Cloud ecosystem:
- **Cloud Logging**: Structured logs for every agent interaction.
- **Cloud Error Reporting**: Real-time crash monitoring.
- **Cloud Trace**: Latency tracking to ensure Gemini responses remain under 2s.
- **Defense in Depth**: Implementation of **HSTS, X-Frame-Options, XSS-Protection, and No-Sniff** headers for enterprise-grade security.

### 4. Efficient Unified Deployment
The entire platform is deployed as a single **Unified Container** on **Google Cloud Run**:
- **Multi-stage Build**: Minimizes image size (under 200MB).
- **Static Asset Caching**: Leverages browser caching for lightning-fast repeat loads.
- **Horizontal Scaling**: Automatically handles traffic spikes during election cycles.

---
*Chunav Mitra: Empowering 900+ million voters with Intelligent Civic Education.*
