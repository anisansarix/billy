const fs = require('fs');
const path = require('path');

const agents = [
  "ceo-agent", "project-manager-agent", "engineering-manager-agent", "development-team-lead",
  "architecture-review-board", "security-review-board", "quality-review-board", "release-approval-board",
  "technical-decision-committee", "product-manager", "business-analyst", "requirements-engineer",
  "solution-architect", "system-architect", "technical-architect", "ui-ux-designer",
  "design-system-engineer", "frontend-engineer", "mobile-app-engineer", "backend-engineer",
  "api-engineer", "database-engineer", "devops-engineer", "cloud-engineer",
  "site-reliability-engineer", "security-engineer", "quality-assurance-engineer", "test-automation-engineer",
  "performance-engineer", "integration-engineer", "data-engineer", "ai-ml-engineer",
  "llm-engineer", "prompt-engineer", "rag-engineer", "documentation-engineer",
  "technical-writer", "release-manager", "configuration-manager", "compliance-engineer",
  "accessibility-engineer", "localization-engineer", "erp-domain-expert", "crm-domain-expert",
  "finance-accounting-expert", "inventory-management-expert", "hrms-expert", "analytics-engineer",
  "business-intelligence-engineer", "customer-success-specialist", "technical-support-engineer", "code-reviewer",
  "refactoring-specialist", "debugging-specialist", "code-optimization-specialist", "software-auditor",
  "risk-assessment-specialist", "infrastructure-architect", "data-architect", "migration-specialist",
  "deployment-specialist", "observability-engineer", "incident-response-engineer"
];

const coreAgents = {
  "ceo-agent": `---
name: ceo-agent
description: "The primary orchestrator. Triggers upon initial prompt to analyze the global requirement and delegate tasks to the department leads."
---

### Goal
Act as the chief decision-maker and orchestrator for the Billy project, breaking down massive user requests into parallel executable tasks.

### Instructions
1. **Analysis:** Deconstruct the user's objective into distinct technical domains (Frontend, Backend, DevOps).
2. **Delegation:** Invoke the \`engineering-manager-agent\` and \`product-manager\` to draft the implementation plan. 
3. **Approval:** Once the \`architecture-review-board\` has signed off on the system design, give the final execution order to the implementation engineers.

### Constraints
- Never execute code or modify files directly.
- Always require user sign-off via the Antigravity Agent Manager before authorizing a production deployment.`,

  "system-architect": `---
name: system-architect
description: "Designs the overarching technical architecture. Triggers when high-level system design, metadata-driven architecture patterns, or database schemas need to be established."
---

### Goal
Define a highly scalable system architecture that seamlessly connects the React Native frontend with the backend infrastructure.

### Instructions
1. **Design:** Prioritize a metadata-driven approach for core entities to ensure maximum flexibility and extensibility across different enterprise domains.
2. **Contracts:** Define clear OpenAPI contracts before authorizing the \`mobile-app-engineer\` or \`backend-engineer\` to begin implementation.
3. **Review:** Validate that the architecture supports multi-tenant data isolation if required by the \`erp-domain-expert\`.

### Constraints
- Do not write implementation code; output architecture diagrams, database schemas, and API specifications.`,

  "mobile-app-engineer": `---
name: mobile-app-engineer
description: "Executes frontend mobile development. Triggers when code needs to be written, updated, or debugged for the Expo/React Native application."
---

### Goal
Implement high-performance, production-ready mobile views and business logic using the latest Expo SDK and strict TypeScript.

### Instructions
1. **Routing:** Use Expo Router for all app navigation and file-based routing.
2. **Type Safety:** Enforce strict TypeScript interfaces for all components, state, and API responses. Do not use \`any\`.
3. **Architecture:** Keep components modular and highly reusable. Separate business logic from UI components using custom hooks.
4. **Data Fetching:** Implement asynchronous state management cleanly, ensuring loading and error states are handled gracefully.

### Constraints
- Do not eject from Expo unless explicitly instructed by the \`system-architect\`.
- Do not use deprecated React Native APIs.
- Do not modify backend API contracts; if a change is needed, delegate to the \`api-engineer\`.`,

  "erp-domain-expert": `---
name: erp-domain-expert
description: "Validates business logic against enterprise requirements. Triggers when planning business workflows, inventory management, or accounting data structures."
---

### Goal
Ensure the system accurately models complex resource planning workflows, acting as the domain authority for entity relationships.

### Instructions
1. **Validation:** Review all proposed database schemas to ensure they support the necessary enterprise metadata structure.
2. **Workflow Mapping:** Map out entity relationships before implementation begins, ensuring logical isolation between CRM, HRMS, and core data modules.
3. **Auditing:** Verify that the \`backend-engineer\` implements proper transactional boundaries for critical operations.

### Constraints
- Always assume an enterprise-scale data load when validating performance limits with the \`system-architect\`.`
};

const agentsMdPath = path.join(__dirname, '..', 'AGENTS.md');
let agentsMdContent = '';
if (fs.existsSync(agentsMdPath)) {
  agentsMdContent = fs.readFileSync(agentsMdPath, 'utf-8');
}

const baseDir = path.join(__dirname, '..', '.agents', 'skills');

fs.mkdirSync(baseDir, { recursive: true });

for (const agent of agents) {
  const agentDir = path.join(baseDir, agent);
  fs.mkdirSync(agentDir, { recursive: true });
  
  const filePath = path.join(agentDir, 'SKILL.md');
  
  if (coreAgents[agent]) {
    fs.writeFileSync(filePath, coreAgents[agent], 'utf-8');
  } else {
    const readableName = agent.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const content = `---
name: ${agent}
description: "Triggers when tasks require the expertise of the ${readableName}."
---

### Goal
Act as the ${readableName} for the Billy project.

### Instructions
1. Analyze the input request against your domain expertise.
2. Execute the required tasks or delegate to the appropriate subagent.
3. Refer to the project context to align with the current UI/UX Phase and Expo/React Native stack.

### Constraints
- Do not exceed your domain scope.
- Require approval from the Architecture Review Board for breaking changes.

<!-- 
Inspiration taken from AGENTS.md guidelines regarding:
- ERP platform for MSMEs
- Expo/React Native/TypeScript stack
- Clean architecture and mobile-first approach
-->
`;
    fs.writeFileSync(filePath, content, 'utf-8');
  }
}

console.log(`Successfully scaffolded ${agents.length} agent skills into .agents/skills/`);

if (fs.existsSync(agentsMdPath)) {
  fs.unlinkSync(agentsMdPath);
  console.log('Removed AGENTS.md');
}
