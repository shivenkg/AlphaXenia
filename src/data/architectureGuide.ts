/**
 * Enterprise Architecture & System Specifications: Step-by-Step Implementation Guide
 * Complete 10-Step, 5-Phase Production Runbook for the Zero-Trust Multi-Tenant VMS.
 */

export interface ArchitectureGuidePhase {
  id: string;
  name: string;
  badge: string;
  description: string;
  targetMilestone: string;
}

export interface ArchitectureGuideStep {
  id: string;
  stepNumber: number;
  phaseId: string;
  title: string;
  subtitle: string;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  estimatedMinutes: number;
  roleResponsible: string;
  specReferences: string[];
  adrReferences: string[];
  objective: string;
  architectureContext: string;
  keyDeliverables: string[];
  prerequisites: string[];
  executionSteps: {
    title: string;
    description: string;
    codeSnippet?: {
      language: string;
      title: string;
      code: string;
    };
  }[];
  verificationChecklist: string[];
  troubleshootingTips: string[];
  relatedTab?: 'ddl' | 'iam' | 'api' | 'uat' | 'adrs';
  relatedTabLabel?: string;
  deepLinkView?: string;
}

export const ARCHITECTURE_PHASES: ArchitectureGuidePhase[] = [
  {
    id: 'phase-1',
    name: 'Phase 1: Zero-Trust Foundation & Storage Layer',
    badge: 'Infrastructure & DDL',
    description: 'Establish isolated multi-tenant schemas, enforce PostgreSQL Row-Level Security (RLS), and provision immutable WORM audit logs.',
    targetMilestone: 'Milestone M1: Data Isolation & Partition Integrity',
  },
  {
    id: 'phase-2',
    name: 'Phase 2: Identity Federation & RBAC Authorization',
    badge: 'OIDC & IAM',
    description: 'Configure corporate IdP federation via OIDC PKCE, map JWT token claims, and enforce the 11-tier RBAC clearance matrix.',
    targetMilestone: 'Milestone M2: Enterprise Single Sign-On & Zero-Trust Clearance',
  },
  {
    id: 'phase-3',
    name: 'Phase 3: Hardware Edge Gateways & IoT Peripherals',
    badge: 'Hardware & Edge',
    description: 'Pair PoE edge controllers, turnstile relays, thermal badge printers, and encrypted QR optical scanners with mTLS.',
    targetMilestone: 'Milestone M3: Facility Perimeters & Physical Access Control',
  },
  {
    id: 'phase-4',
    name: 'Phase 4: High-Throughput Visitor Workflow & Screenings',
    badge: 'Visitor Operations',
    description: 'Deploy touchless pre-registration, biometric photo validation, legal NDA e-signatures, and instant multi-channel host alerts.',
    targetMilestone: 'Milestone M4: Frictionless Guest Ingress & Watchlist Shield',
  },
  {
    id: 'phase-5',
    name: 'Phase 5: Automated Verification, UAT & Disaster Drills',
    badge: 'Verification & BCP',
    description: 'Execute the 25-step automated UAT test suite, audit SOC2 compliance, and simulate offline edge failover and emergency roll call.',
    targetMilestone: 'Milestone M5: 100% UAT Pass Rate & SOC2 Production Readiness',
  },
];

export const ARCHITECTURE_STEPS: ArchitectureGuideStep[] = [
  {
    id: 'STEP-01',
    stepNumber: 1,
    phaseId: 'phase-1',
    title: 'PostgreSQL Multi-Tenant Provisioning & RLS Enforcement',
    subtitle: 'Deploy isolated tenant schemas with cryptographically verified Row-Level Security.',
    criticality: 'CRITICAL',
    estimatedMinutes: 25,
    roleResponsible: 'Database Architect / DevOps Engineer',
    specReferences: ['Spec §15: Multi-Tenant Architecture', 'Spec §24: PostgreSQL DDL Standards'],
    adrReferences: ['ADR-002: Database Per Tenant Isolation Model', 'ADR-001: Cloud-Agnostic Containerized Deployment'],
    objective: 'Provision tenant namespaces, initialize primary keys as UUIDv7/v4, and activate Row-Level Security policies to mathematically prevent cross-tenant data leakage at the query engine level.',
    architectureContext: 'In enterprise deployments, physical and logical data boundaries must withstand connection pooling and malicious query manipulation. Every database session binds to the tenant context via `SET LOCAL app.current_tenant_id`.',
    keyDeliverables: [
      'Production PostgreSQL schema with 18 relational tables',
      'Tenant partition isolation triggers and check constraints',
      'Row-Level Security (RLS) policies on all tables containing tenant_id',
      'Indexed compound foreign keys on (tenant_id, id)',
    ],
    prerequisites: [
      'PostgreSQL 15+ instance with pgcrypto and uuid-ossp extensions enabled',
      'Superuser connection credentials for initial migration migration run',
    ],
    executionSteps: [
      {
        title: 'Step 1.1: Initialize PostgreSQL Extensions & Base Schema',
        description: 'Connect to your PostgreSQL cluster and execute the foundational DDL script to create enum types, timestamp trigger functions, and multi-tenant lookup tables.',
        codeSnippet: {
          language: 'sql',
          title: '01_init_extensions_and_enums.sql',
          code: `-- Enable cryptographic & UUID extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create canonical tenant status and visit enums
CREATE TYPE tenant_tier_enum AS ENUM ('STARTER', 'PROFESSIONAL', 'ENTERPRISE', 'MISSION_CRITICAL');
CREATE TYPE visit_status_enum AS ENUM ('EXPECTED', 'PRE_REGISTERED', 'CHECKED_IN', 'CHECKED_OUT', 'DENIED', 'OVERSTAY');
CREATE TYPE device_type_enum AS ENUM ('KIOSK', 'BARRIER_GATE', 'DESK_SCANNER', 'BADGE_PRINTER', 'FACIAL_TERMINAL');`,
        },
      },
      {
        title: 'Step 1.2: Apply Row-Level Security (RLS) Across Tenant Data',
        description: 'Enable RLS and enforce tenant context constraints on all core operational entities: visitors, visits, badges, and device logs.',
        codeSnippet: {
          language: 'sql',
          title: '02_enforce_row_level_security.sql',
          code: `-- Enable RLS on core visitor management tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

-- Create zero-trust tenant isolation policy
CREATE POLICY tenant_isolation_policy ON visitors
  FOR ALL
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);`,
        },
      },
    ],
    verificationChecklist: [
      'Verify `SELECT current_setting(\'app.current_tenant_id\')` returns expected tenant context in app connection pool.',
      'Execute a test query from Tenant A attempting to select rows belonging to Tenant B; confirm 0 rows returned.',
      'Inspect table indexes with `\\di` in psql to confirm (tenant_id, id) B-Tree indexes are active.',
    ],
    troubleshootingTips: [
      'If queries return permission errors, verify your application connection role has `GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public` without superuser bypass.',
      'Always set `SET LOCAL app.current_tenant_id = ?` within an active transaction block `BEGIN ... COMMIT`.',
    ],
    relatedTab: 'ddl',
    relatedTabLabel: 'View & Copy Production PostgreSQL DDL',
  },
  {
    id: 'STEP-02',
    stepNumber: 2,
    phaseId: 'phase-1',
    title: 'Immutable WORM Audit Trail & Cryptographic Hash Chaining',
    subtitle: 'Implement tamper-evident SHA-256 blockchain-style event logging for SOC2 & ISO 27001 compliance.',
    criticality: 'CRITICAL',
    estimatedMinutes: 20,
    roleResponsible: 'Chief Information Security Officer (CISO) / SecOps Engineer',
    specReferences: ['Spec §18: Immutable Audit Trail', 'Spec §26: SOC2 Type II Trust Criteria'],
    adrReferences: ['ADR-005: Cryptographic Hash Chaining for Audit Trail'],
    objective: 'Ensure all authentication attempts, gate actuations, NDA signatures, and badge print actions are permanently logged with zero modification or truncation capability.',
    architectureContext: 'Each audit record computes a SHA-256 signature containing `(previous_record_hash + timestamp + actor_id + event_type + payload_json)`. Any alteration breaks the cryptographic verification chain immediately.',
    keyDeliverables: [
      'WORM-compliant `audit_events` PostgreSQL table with restricted append-only privileges',
      'Automated SHA-256 hash chaining trigger or backend event handler',
      'Real-time compliance validation monitor',
    ],
    prerequisites: [
      'Step 1 completed (database schema initialized)',
      'Designated audit log storage bucket with object-lock retention enabled',
    ],
    executionSteps: [
      {
        title: 'Step 2.1: Deploy Append-Only Audit Trail Table',
        description: 'Apply strict SQL table permissions prohibiting `UPDATE` or `DELETE` operations on the audit log by any application role.',
        codeSnippet: {
          language: 'sql',
          title: '03_audit_trail_table.sql',
          code: `CREATE TABLE IF NOT EXISTS audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  actor_id VARCHAR(128) NOT NULL,
  actor_name VARCHAR(128) NOT NULL,
  actor_role VARCHAR(64) NOT NULL,
  event_type VARCHAR(64) NOT NULL,
  resource_id VARCHAR(128),
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  previous_hash VARCHAR(64) NOT NULL,
  current_hash VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Revoke mutation rights from standard application user
REVOKE UPDATE, DELETE, TRUNCATE ON audit_events FROM vms_app_user;`,
        },
      },
      {
        title: 'Step 2.2: Verify Cryptographic Chain Integrity',
        description: 'Run the automated tamper-detection validator across existing audit logs to ensure unbroken hash linkage.',
        codeSnippet: {
          language: 'typescript',
          title: 'verifyAuditChain.ts',
          code: `import crypto from 'crypto';

export function verifyAuditChain(records: AuditEvent[]): boolean {
  for (let i = 1; i < records.length; i++) {
    const prev = records[i - 1];
    const curr = records[i];
    if (curr.previousHash !== prev.currentHash) {
      console.error('Audit chain broken at event ID:', curr.id);
      return false;
    }
    const computed = crypto
      .createHash('sha256')
      .update(curr.previousHash + curr.createdAt + curr.actorId + JSON.stringify(curr.payload))
      .digest('hex');
    if (computed !== curr.currentHash) {
      console.error('Payload hash mismatch at event ID:', curr.id);
      return false;
    }
  }
  return true;
}`,
        },
      },
    ],
    verificationChecklist: [
      'Attempt an `UPDATE audit_events SET event_type = \'TAMPERED\';` statement as app user; verify `42501 permission denied`.',
      'Verify all check-ins, badge printings, and badge revocations generate corresponding entries in the audit trail.',
      'Check that `previous_hash` of event N strictly matches `current_hash` of event N-1.',
    ],
    troubleshootingTips: [
      'For genesis records (first event for a tenant), set `previous_hash` to standard SHA-256 of tenant creation UUID.',
      'Store cold audit archives in immutable AWS S3 Glacier with Object Lock (Legal Hold mode) or Google Cloud Storage Bucket Lock.',
    ],
    relatedTab: 'adrs',
    relatedTabLabel: 'Inspect Architecture Decision Records (ADRs)',
    deepLinkView: 'audit',
  },
  {
    id: 'STEP-03',
    stepNumber: 3,
    phaseId: 'phase-2',
    title: 'Enterprise OIDC / SAML SSO Federation & RBAC Matrix',
    subtitle: 'Configure identity providers (Okta, Azure AD, Google) with fine-grained 11-tier authorization.',
    criticality: 'CRITICAL',
    estimatedMinutes: 30,
    roleResponsible: 'IAM Lead / Security Administrator',
    specReferences: ['Spec §20: OIDC Identity Federation', 'Spec §21: Granular RBAC Clearance Matrix'],
    adrReferences: ['ADR-003: Flexible OIDC Identity & Claims Mapping'],
    objective: 'Federate enterprise identity providers with OIDC Authorization Code Flow with PKCE, map corporate directory groups to VMS roles, and enforce least-privilege clearance.',
    architectureContext: 'Zero passwords reside inside the VMS database. Corporate employees authenticate against their enterprise IdP. JWT claims (`iss`, `sub`, `email`, `groups`, `tenant_id`) map dynamically into application permissions.',
    keyDeliverables: [
      'OIDC Client configuration with Discovery Document metadata (`.well-known/openid-configuration`)',
      'JWKS public key rotation caching with 1-hour TTL',
      '11-Tier Role-Based Access Control matrix enforcement across all UI views and REST APIs',
    ],
    prerequisites: [
      'Enterprise IdP tenant created (Azure AD / Entra ID, Okta, or Google Workspace)',
      'Registered OAuth2 Redirect URI in IdP portal (`https://vms.corp.net/auth/callback`)',
    ],
    executionSteps: [
      {
        title: 'Step 3.1: Configure OIDC Discovery & Environment Variables',
        description: 'Bind your application deployment to the identity provider discovery endpoints and OAuth client ID.',
        codeSnippet: {
          language: 'bash',
          title: '.env.production',
          code: `OIDC_ISSUER_URL="https://login.microsoftonline.com/{tenant_id}/v2.0"
OIDC_CLIENT_ID="9b26f5e8-5c8e-4a0b-932d-2026corp"
OIDC_REDIRECT_URI="https://vms.enterprise.com/auth/callback"
OIDC_AUDIENCE="api://vms-enterprise-gateway"
OIDC_SCOPES="openid profile email offline_access"
JWT_ALGORITHMS="RS256,ES256"`,
        },
      },
      {
        title: 'Step 3.2: Inspect & Verify Role Clearance Matrix',
        description: 'Examine the granular permissions assigned to each clearance level (Platform Super Admin down to Compliance Auditor and Escort).',
        codeSnippet: {
          language: 'typescript',
          title: 'rbacGuard.ts',
          code: `export function assertPermission(user: AppUser, requiredFunctionId: string): boolean {
  if (user.role === 'PLATFORM_SUPER_ADMIN') return true;
  const permissions = storageService.getRolePermissions(user.role);
  if (!permissions.includes(requiredFunctionId)) {
    throw new AuthorizationError(\`Clearance tier \${user.role} lacks permission: \${requiredFunctionId}\`);
  }
  return true;
}`,
        },
      },
    ],
    verificationChecklist: [
      'Authenticate with a Host Employee account; verify access to admin settings is blocked (HTTP 403 Forbidden).',
      'Authenticate with a Platform Super Admin account; confirm unrestricted access to multi-tenant controls.',
      'Verify token renewal works seamlessly without user re-prompting via refresh tokens.',
    ],
    troubleshootingTips: [
      'If signature verification fails, check if the IdP rotated its RSA keys and ensure your backend fetches fresh keys from the `jwks_uri`.',
      'Ensure the `sub` claim is treated as immutable user ID, while `email` can change upon corporate renames.',
    ],
    relatedTab: 'iam',
    relatedTabLabel: 'View Interactive OIDC & RBAC Matrix',
  },
  {
    id: 'STEP-04',
    stepNumber: 4,
    phaseId: 'phase-2',
    title: 'OpenAPI 3.1 REST Gateway Contracts & Webhooks',
    subtitle: 'Verify end-to-end HTTP API contracts, correlation IDs, and idempotent mutations.',
    criticality: 'HIGH',
    estimatedMinutes: 20,
    roleResponsible: 'Backend API Engineer / Integration Specialist',
    specReferences: ['Spec §22: RESTful API Specifications', 'Spec §23: Webhook Architecture'],
    adrReferences: ['ADR-004: Modular Monolith First Architecture'],
    objective: 'Expose standardized, hyper-secure RESTful endpoints with OpenAPI 3.1 validation, rate limiting, and correlation ID tracing across all 18 endpoints.',
    architectureContext: 'All client interfaces (Reception Desk, Self-Service Kiosks, Mobile Check-in, Access Control Hardware) communicate through standardized RESTful endpoints with consistent JSON error envelopes and timing telemetry.',
    keyDeliverables: [
      'OpenAPI 3.1 JSON catalog adhering to RFC 7807 Problem Details',
      'Idempotency-Key support on financial and check-in mutations',
      'Real-time interactive API test bench with live bearer token injection',
    ],
    prerequisites: [
      'Step 3 completed (valid JWT bearer tokens available)',
    ],
    executionSteps: [
      {
        title: 'Step 4.1: Test Pre-Registration & Visitor Lookup Endpoints',
        description: 'Dispatch curl requests against the pre-registration and visitor inquiry endpoints, validating 200 OK responses and correlation headers.',
        codeSnippet: {
          language: 'bash',
          title: 'curl_test_endpoints.sh',
          code: `curl -X POST "https://api.vms.enterprise.com/api/v1/visitors/pre-register" \\
  -H "Authorization: Bearer \${ACCESS_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -H "X-Correlation-ID: CORR-TEST-9921" \\
  -H "Idempotency-Key: IDEMP-$(date +%s)" \\
  -d '{
    "fullName": "Sarah Jenkins",
    "email": "sarah.jenkins@acme-partner.com",
    "company": "Acme Dynamics Corp",
    "hostEmployeeId": "usr-host-001",
    "expectedArrival": "2026-09-25T14:30:00Z",
    "purpose": "Vendor System Architecture Review"
  }'`,
        },
      },
      {
        title: 'Step 4.2: Validate Live Responses in OpenAPI 3.1 Explorer',
        description: 'Use the built-in OpenAPI 3.1 Live Catalog tab to execute live mock calls and inspect payload headers, duration, and data structure.',
      },
    ],
    verificationChecklist: [
      'Confirm every response includes `X-Correlation-ID` matching the request or generated by the server.',
      'Test invalid JSON payloads and verify RFC 7807 formatted error envelopes (`type`, `title`, `status`, `detail`).',
      'Verify that re-submitting with the same `Idempotency-Key` returns the cached response without duplicate database inserts.',
    ],
    troubleshootingTips: [
      'If receiving 401 Unauthorized, verify your Bearer token expiration timestamp (`exp` claim in JWT).',
      'Ensure CORS headers permit your kiosk origin: `Access-Control-Allow-Origin: https://kiosk.vms.corp.net`.',
    ],
    relatedTab: 'api',
    relatedTabLabel: 'Open OpenAPI 3.1 Interactive Live Catalog',
  },
  {
    id: 'STEP-05',
    stepNumber: 5,
    phaseId: 'phase-3',
    title: 'Hardware Edge Gateways & Access Control Integration',
    subtitle: 'Enroll IoT edge barrier controllers, optical turnstiles, and PoE readers via mTLS.',
    criticality: 'HIGH',
    estimatedMinutes: 35,
    roleResponsible: 'Hardware Specialist / Physical Security Engineer',
    specReferences: ['Spec §09: Hardware Architecture & Edge Controllers', 'Spec §10: Access Control System (ACS) Relays'],
    adrReferences: ['ADR-001: Cloud-Agnostic Containerized Deployment'],
    objective: 'Commission physical edge controllers, configure Wiegand/OSDP communication to speed gates, and establish mutual TLS (mTLS) with device heartbeats.',
    architectureContext: 'Edge controllers manage localized relay pulses (dry contact N/O or N/C) to physical turnstiles. In the event of wide-area network drops, edge controllers operate in autonomous offline cache mode.',
    keyDeliverables: [
      'Edge Gateway enrollment with cryptographically generated device tokens',
      'Turnstile actuation relay calibration (3000ms pulse duration)',
      'Sub-50ms QR code decoding and optical scanner synchronization',
    ],
    prerequisites: [
      'PoE+ Network switch ports configured on isolated IoT VLAN',
      'Hardware Edge Controller (e.g. Raspberry Pi CM4 Industrial, Wiegand OSDP Relay Board)',
    ],
    executionSteps: [
      {
        title: 'Step 5.1: Enroll Hardware Device in Device Registry',
        description: 'Register the turnstile controller or kiosk in the Hardware Devices inventory, generating a hardware enrollment secret.',
        codeSnippet: {
          language: 'json',
          title: 'device_enrollment_payload.json',
          code: `{
  "deviceName": "Turnstile Lane 1 - Main Ingress Gate",
  "deviceType": "BARRIER_GATE",
  "serialNumber": "SN-EDGE-2026-GATE01",
  "ipAddress": "10.240.12.101",
  "macAddress": "70:B3:D5:E2:81:4A",
  "relayConfig": {
    "pulseDurationMs": 3000,
    "normallyOpen": true,
    "feedbackSensor": "OPTICAL_BEAM_LANE_01"
  },
  "firmwareVersion": "v4.2.1-prod"
}`,
        },
      },
      {
        title: 'Step 5.2: Verify Pulse Actuation & Offline Fallback',
        description: 'Send test actuation command via the Hardware Edge UI and confirm physical relay trigger.',
      },
    ],
    verificationChecklist: [
      'Verify device heartbeat is received within 30 seconds; status shows "ONLINE" in Hardware Center.',
      'Scan a valid visitor QR code at optical reader; turnstile relay triggers within 200ms.',
      'Disconnect external internet link; verify edge controller validates pre-cached visitors in local SQLite store.',
    ],
    troubleshootingTips: [
      'Ensure Wiegand D0/D1 wires are shielded and grounded at one end to prevent EMI from nearby heavy turnstile motors.',
      'Check OSDP v2 channel encryption key (SCBK) matches on both controller and reader head.',
    ],
    deepLinkView: 'devices',
  },
  {
    id: 'STEP-06',
    stepNumber: 6,
    phaseId: 'phase-3',
    title: 'Thermal Badge Printers & Mobile Wallet Pass Provisioning',
    subtitle: 'Configure ESC/POS & ZPL printers, barcode generation, and Apple/Google Wallet passes.',
    criticality: 'MEDIUM',
    estimatedMinutes: 25,
    roleResponsible: 'Facilities Administrator / Front Desk Lead',
    specReferences: ['Spec §06: Badge Generation & Thermal Printing', 'Spec §07: Digital Passes'],
    adrReferences: ['ADR-004: Modular Monolith First Architecture'],
    objective: 'Calibrate Brother QL / Zebra ZPL thermal label printers, customize CR80 plastic card badge templates, and generate dynamic encrypted QR passes.',
    architectureContext: 'Printed badges display the visitor photo, host name, expiry timestamp, and access clearance color band. The printed QR code embeds a signed token preventing badge duplication.',
    keyDeliverables: [
      'Calibrated thermal label printing profile (62mm continuous or die-cut)',
      'Digital Apple Wallet (.pkpass) and Google Wallet integration',
      'High-contrast emergency muster point instructions on badge backside',
    ],
    prerequisites: [
      'Thermal printer connected via USB, Ethernet, or Raw TCP/IP (Port 9100)',
      'Badge template configured with company logo and clearance colors',
    ],
    executionSteps: [
      {
        title: 'Step 6.1: Test Direct RAW / ZPL Print Dispatch',
        description: 'Send test ZPL markup to verify alignment, print density, and barcode readability.',
        codeSnippet: {
          language: 'text',
          title: 'badge_sample.zpl',
          code: `^XA
^PW480
^LL720
^FO40,40^A0N,45,45^FDVISITOR PASS^FS
^FO40,100^A0N,32,32^FDJohn Doe^FS
^FO40,145^A0N,22,22^FDCompany: Acme Engineering^FS
^FO40,180^A0N,22,22^FDHost: David Miller (Engineering)^FS
^FO40,240^BQN,2,8^FDQA,VMS-QR-TOKEN-78192^FS
^FO40,540^A0N,20,20^FDValid Until: 2026-09-25 18:00^FS
^XZ`,
        },
      },
    ],
    verificationChecklist: [
      'Print test badge; verify print finishes in under 2.5 seconds.',
      'Scan printed QR code with standard kiosk camera; ensure 100% first-pass read rate.',
      'Verify thermal print does not smudge under finger friction test.',
    ],
    troubleshootingTips: [
      'If barcodes appear fuzzy, adjust printer darkness setting from default 15 to 20 in Zebra Setup Utilities.',
      'Clean thermal printhead with 99% isopropyl alcohol wipes every 500 badges.',
    ],
    deepLinkView: 'badges',
  },
  {
    id: 'STEP-07',
    stepNumber: 7,
    phaseId: 'phase-4',
    title: 'Touchless Pre-Registration, NDA E-Signing & Watchlist Screening',
    subtitle: 'Deploy visitor registration, legal NDA e-signature capture, and denied party list screening.',
    criticality: 'HIGH',
    estimatedMinutes: 20,
    roleResponsible: 'Compliance Officer / Corporate Legal Counsel',
    specReferences: ['Spec §03: Pre-Registration Workflow', 'Spec §04: Visitor NDA E-Signing', 'Spec §05: Watchlist Screening'],
    adrReferences: ['ADR-005: Cryptographic Hash Chaining for Audit Trail'],
    objective: 'Empower hosts to send pre-registration links, mandate electronic signature of the non-disclosure agreement before arrival, and run automated OFAC/internal watchlist screening.',
    architectureContext: 'Visitors who complete pre-registration receive an express QR pass via email/SMS. Upon kiosk arrival, scanning their pass checks them in in under 5 seconds.',
    keyDeliverables: [
      'Public touchless pre-registration web portal with company branding',
      'HTML5 Canvas biometric signature capture with timestamped legal seal',
      'Instant watchlist screening engine rejecting flagged individuals before arrival',
    ],
    prerequisites: [
      'Tenant NDA legal text configured in Customization settings',
      'Watchlist database populated with restricted entities',
    ],
    executionSteps: [
      {
        title: 'Step 7.1: Verify Watchlist Screening Trigger',
        description: 'Simulate guest pre-registration against both clean and flagged names to confirm automatic security alert dispatch.',
        codeSnippet: {
          language: 'typescript',
          title: 'watchlistScreening.ts',
          code: `export function screenVisitorAgainstWatchlist(visitorName: string, company: string): WatchlistMatchResult {
  const matches = storageService.getState().watchlist.filter(item => 
    item.fullName.toLowerCase() === visitorName.toLowerCase() ||
    (item.company && item.company.toLowerCase() === company.toLowerCase())
  );
  if (matches.length > 0) {
    storageService.logAuditEvent({
      eventType: 'WATCHLIST_HIT_ALERT',
      actorName: 'SYSTEM_WATCHLIST_ENGINE',
      payload: { visitorName, matchedEntity: matches[0] }
    });
    return { flagged: true, reason: matches[0].reason, level: matches[0].riskLevel };
  }
  return { flagged: false };
}`,
        },
      },
    ],
    verificationChecklist: [
      'Generate a public pre-registration share link; open in private window and complete submission.',
      'Sign NDA with mouse or touchscreen; confirm signature is stored with SHA-256 hash.',
      'Check in a test visitor matching an active watchlist rule; confirm reception and security alert modal displays.',
    ],
    troubleshootingTips: [
      'Store captured signatures as base64-encoded PNGs with strict width/height boundaries to minimize database footprint.',
      'Set fuzzy search threshold on watchlist matching (Levenshtein distance <= 2) to catch spelling discrepancies.',
    ],
    deepLinkView: 'pre_register',
  },
  {
    id: 'STEP-08',
    stepNumber: 8,
    phaseId: 'phase-4',
    title: 'Multi-Channel Host Notification Dispatching',
    subtitle: 'Configure real-time arrival alerts via Twilio SMS, SendGrid Email, Slack & Microsoft Teams.',
    criticality: 'MEDIUM',
    estimatedMinutes: 20,
    roleResponsible: 'Systems Integrator / IT Operations',
    specReferences: ['Spec §08: Host Notification Engine', 'Spec §23: Webhook Architecture'],
    adrReferences: ['ADR-004: Modular Monolith First Architecture'],
    objective: 'Deliver sub-3-second arrival alerts to hosts through their preferred corporate communication channels the instant their guest checks in.',
    architectureContext: 'The notification dispatcher runs asynchronous non-blocking webhooks with exponential backoff retries. Hosts can reply or click quick-action buttons: "I am on my way", "Hold at reception", or "Deny Entry".',
    keyDeliverables: [
      'Twilio SMS API integration for instant mobile text notifications',
      'SendGrid / AWS SES transactional email with visitor photo and destination floor',
      'Slack Bot & Microsoft Teams webhook cards with interactive response actions',
    ],
    prerequisites: [
      'Twilio Account SID & Auth Token or corporate webhook endpoints',
      'Verified host employee email addresses and phone numbers in user directory',
    ],
    executionSteps: [
      {
        title: 'Step 8.1: Test Webhook Dispatch to Slack / Teams',
        description: 'Send test arrival card payload and confirm interactive buttons render correctly.',
        codeSnippet: {
          language: 'json',
          title: 'slack_arrival_payload.json',
          code: `{
  "blocks": [
    {
      "type": "header",
      "text": { "type": "plain_text", "text": "🔔 Your Visitor Has Arrived!" }
    },
    {
      "type": "section",
      "fields": [
        { "type": "mrkdwn", "text": "*Visitor:*\\nSarah Jenkins" },
        { "type": "mrkdwn", "text": "*Company:*\\nAcme Dynamics" },
        { "type": "mrkdwn", "text": "*Location:*\\nMain Building - Reception Kiosk 2" },
        { "type": "mrkdwn", "text": "*Arrival Time:*\\n14:32 EST" }
      ]
    },
    {
      "type": "actions",
      "elements": [
        { "type": "button", "text": { "type": "plain_text", "text": "I'm on my way" }, "style": "primary", "value": "status_coming" },
        { "type": "button", "text": { "type": "plain_text", "text": "Hold at Reception" }, "value": "status_hold" }
      ]
    }
  ]
}`,
        },
      },
    ],
    verificationChecklist: [
      'Check in a test visitor assigned to your account; verify SMS received within 3 seconds.',
      'Confirm Slack / Teams notification displays visitor name, photo, and badge ID.',
      'Check host notification delivery log in Audit Trail.',
    ],
    troubleshootingTips: [
      'Register for Twilio 10DLC (A2P 10DLC) brand campaign compliance to prevent SMS carrier spam filtering.',
      'Include a fallback email dispatch whenever SMS or webhook returns non-200 within 5 seconds.',
    ],
    deepLinkView: 'visitors',
  },
  {
    id: 'STEP-09',
    stepNumber: 9,
    phaseId: 'phase-5',
    title: 'Automated 25-Point UAT Suite Execution & Verification',
    subtitle: 'Execute full end-to-end regression tests across all functional modules with cryptographic telemetry.',
    criticality: 'CRITICAL',
    estimatedMinutes: 15,
    roleResponsible: 'Quality Assurance Lead / Release Manager',
    specReferences: ['Spec §25: Master UAT Test Specifications', 'Spec §27: Release Quality Gates'],
    adrReferences: ['ADR-005: Cryptographic Hash Chaining for Audit Trail'],
    objective: 'Run the comprehensive 25-case automated acceptance test suite covering Authentication, Visitor Lifecycle, Hardware Integration, Safety & Roll Call, and System Administration.',
    architectureContext: 'Every UAT case validates inputs, expected outputs, timing SLAs (<100ms execution), and logs cryptographic correlation traces into the test harness.',
    keyDeliverables: [
      '100% Pass rate across all 25 automated enterprise test scenarios',
      'Cryptographic test run evidence trace with timestamped validation certificates',
      'Direct one-click test harness runner integrated into the SuperAdmin portal',
    ],
    prerequisites: [
      'Steps 1-8 completed and active in the environment',
    ],
    executionSteps: [
      {
        title: 'Step 9.1: Execute Full 25-Step Automated UAT Harness',
        description: 'Navigate to the Automated 25 UAT Tests tab or trigger the one-click verification below to execute all test cases concurrently.',
      },
      {
        title: 'Step 9.2: Inspect Detailed Test Case Telemetry & Logs',
        description: 'Review execution durations, cryptographic trace IDs, and expected vs. actual results for any failed or untested scenarios.',
      },
    ],
    verificationChecklist: [
      'Confirm all 25 test cases achieve PASS status (0 FAIL, 0 UNTESTED).',
      'Overall pass rate gauge displays 100%.',
      'Audit log reflects automated test run event with SuperAdmin actor signature.',
    ],
    troubleshootingTips: [
      'If any test fails, inspect the evidence modal to view the exact stack trace and API payload.',
      'Use the "Reset UAT Suite" button if you need to run fresh benchmarks after configuration changes.',
    ],
    relatedTab: 'uat',
    relatedTabLabel: 'Open Automated 25 UAT Tests Runner',
  },
  {
    id: 'STEP-10',
    stepNumber: 10,
    phaseId: 'phase-5',
    title: 'Failover Disaster Recovery & Emergency Evacuation Drills',
    subtitle: 'Validate offline kiosk autonomy, live muster point roll call, and emergency first responder egress.',
    criticality: 'CRITICAL',
    estimatedMinutes: 20,
    roleResponsible: 'Safety & Compliance Director / Facility Security Officer (FSO)',
    specReferences: ['Spec §11: Emergency Evacuation & Roll Call', 'Spec §12: Offline Autonomy & Sync'],
    adrReferences: ['ADR-001: Cloud-Agnostic Containerized Deployment'],
    objective: 'Simulate a total building power/network outage, verify that turnstiles fail-safe to open egress, and conduct a real-time muster point head-count roll call.',
    architectureContext: 'Life safety codes (NFPA 101, EN 13637) strictly mandate that turnstiles and electronic access gates drop their magnetic locks immediately upon fire alarm actuation or power loss. Simultaneously, mobile tablet devices must hold an offline cached list of every human currently on premises.',
    keyDeliverables: [
      'Real-time emergency muster point accounting dashboard',
      'Instant SMS broadcast to all active building occupants',
      'Printable and exportable first-responder manifest with host assignments',
    ],
    prerequisites: [
      'Safety muster zones defined (e.g. North Parking Lot, Assembly Area B)',
      'At least 3 checked-in visitors and hosts on premise in test environment',
    ],
    executionSteps: [
      {
        title: 'Step 10.1: Trigger Emergency Evacuation Roll Call Drill',
        description: 'Initiate a drill from the Emergency Roll Call view or the top navigation bar bell icon.',
      },
      {
        title: 'Step 10.2: Account for Personnel at Assembly Points',
        description: 'Mark occupants as "Accounted For", record emergency notes, and verify the missing count updates live.',
      },
    ],
    verificationChecklist: [
      'Confirm emergency notification banner displays across all active kiosk screens.',
      'Verify the unaccounted occupant counter decreases in real-time as marshals check off names.',
      'Export the First Responder PDF/Manifest and verify all visitor names and emergency contacts are present.',
    ],
    troubleshootingTips: [
      'Ensure muster captains have offline tablet shortcuts saved on their home screens via PWA service worker caching.',
      'Conduct a live evacuation drill every 6 months to maintain OSHA / NFPA regulatory compliance.',
    ],
    deepLinkView: 'emergency',
  },
];

/**
 * Generates a full downloadable Markdown runbook of the entire architecture and specs guide.
 */
export function generateArchitectureRunbookMarkdown(): string {
  const dateStr = new Date().toISOString().split('T')[0];
  let md = `# ENTERPRISE VISITOR MANAGEMENT SYSTEM (VMS)
## Master Enterprise Architecture & System Specifications Runbook
*Version: 4.2.0-Enterprise-Production | Generated: ${dateStr} | Status: OFFICIAL SPECIFICATION*

---

### Executive Summary & Architecture Topology
This document defines the complete end-to-end engineering, security, and operational deployment guide for the Zero-Trust Multi-Tenant Visitor Management System (VMS).

### Table of Contents
1. Executive Architecture Topology
2. Phases & Milestone Roadmap
3. Detailed Step-by-Step Implementation Runbook
4. 25-Point Automated UAT Verification Criteria
5. Compliance & Disaster Recovery Protocols

---

`;

  ARCHITECTURE_PHASES.forEach((phase) => {
    md += `## ${phase.name}\n`;
    md += `**Milestone Target:** ${phase.targetMilestone}\n`;
    md += `**Description:** ${phase.description}\n\n`;

    const steps = ARCHITECTURE_STEPS.filter((s) => s.phaseId === phase.id);
    steps.forEach((step) => {
      md += `### Step ${step.stepNumber}: ${step.title}\n`;
      md += `> **Subtitle:** ${step.subtitle}\n`;
      md += `- **Criticality:** ${step.criticality}\n`;
      md += `- **Estimated Time:** ${step.estimatedMinutes} Minutes\n`;
      md += `- **Lead Role:** ${step.roleResponsible}\n`;
      md += `- **Spec Standards:** ${step.specReferences.join(', ')}\n`;
      md += `- **ADRs Enforced:** ${step.adrReferences.join(', ')}\n\n`;

      md += `#### Objective & Architecture Context\n`;
      md += `${step.objective}\n\n`;
      md += `${step.architectureContext}\n\n`;

      md += `#### Key Deliverables\n`;
      step.keyDeliverables.forEach((d) => {
        md += `- [ ] ${d}\n`;
      });
      md += `\n`;

      md += `#### Execution Steps & Technical Artifacts\n`;
      step.executionSteps.forEach((es) => {
        md += `##### ${es.title}\n`;
        md += `${es.description}\n\n`;
        if (es.codeSnippet) {
          md += `\`\`\`${es.codeSnippet.language}\n// ${es.codeSnippet.title}\n${es.codeSnippet.code}\n\`\`\`\n\n`;
        }
      });

      md += `#### Verification & Acceptance Checklist\n`;
      step.verificationChecklist.forEach((vc) => {
        md += `- [ ] ${vc}\n`;
      });
      md += `\n`;

      md += `#### Troubleshooting & Best Practices\n`;
      step.troubleshootingTips.forEach((tt) => {
        md += `- *Note:* ${tt}\n`;
      });
      md += `\n---\n\n`;
    });
  });

  md += `## Appendix: Cryptographic Verification & Compliance Sign-Off
- **SOC2 Type II Trust Services Criteria:** Enforced via SHA-256 hash chaining on all audit logs.
- **ISO 27001 / NIST SP 800-53:** Zero-trust least privilege clearance on all tenant data.
- **NFPA 101 Life Safety:** Automated fail-safe turnstile release during emergency roll call events.

*Official Document Approved by Enterprise Architecture Review Board (ARB).*
`;

  return md;
}
