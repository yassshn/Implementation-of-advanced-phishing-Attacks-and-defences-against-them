

Implementation of Advanced Phishing Attacks and Defenses Against Them

## Overview
This research examines **Adversary-in-the-Middle (AiTM)** phishing attacks, focusing on their evolution, implementation, and mitigation. AiTM attacks are capable of bypassing advanced security measures such as Multi-Factor Authentication (MFA). The study demonstrates both server-based and serverless attack models and evaluates the effectiveness of current defense mechanisms against these threats.

---

## Objectives
- Implement AiTM phishing attacks using **server-based** and **serverless architectures**.
- Analyze the effectiveness of mitigation strategies, including phish-resistant MFA and certificate-based authentication.
- Compare the operational and detection differences between server-based and serverless approaches.

---

## Key Features of the Research
1. **Attack Models**:
   - **Server-Based**: Uses tools like Evilginx2 and VPS for phishing attacks.
   - **Serverless**: Leverages cloud services like **Cloudflare Workers** for scalable, low-footprint attacks.

2. **Mitigation Techniques**:
   - Advanced MFA methods like **FIDO2 security keys** and **certificate-based authentication**.
   - Conditional access policies such as trusted locations and compliant devices.

3. **Comparative Analysis**:
   - Discusses infrastructure, cost, scalability, and detection challenges for both attack methods.

4. **Phishing Simulation**:
   - Realistic simulations using Microsoft 365 environments to replicate attacks.

---

## Key Findings
1. **Effectiveness of AiTM**:
   - Successfully bypasses MFA using session cookie theft and real-time credential interception.
   - Serverless attacks are harder to detect due to their temporary and distributed nature.

2. **Defense Strategies**:
   - **FIDO2 keys** and **certificate-based authentication** offer strong protection.
   - Traditional MFA methods, such as SMS-based verification, remain vulnerable.

3. **Infrastructure Comparison**:
   - Serverless models are cost-effective, scalable, and stealthier than server-based models but harder to control for complex simulations.

---

## Applications
- **Cybersecurity Training**: Simulate phishing scenarios for organizational awareness and employee training.
- **Threat Analysis**: Understand vulnerabilities in MFA and authentication systems.
- **Incident Response**: Use insights to improve organizational defenses against evolving phishing techniques.

---


## Future Work
- Explore the use of AI for real-time detection and mitigation of AiTM attacks.
- Enhance phish-resistant MFA solutions for broader scenarios.
- Investigate psychological factors contributing to phishing vulnerabilities.

---

