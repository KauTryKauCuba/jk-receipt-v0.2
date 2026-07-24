"use client";

import { useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import DashboardNavbar from "../../components/DashboardNavbar";
import MatrixText from "../../components/MatrixText";
import CustomDropdown from "../../components/CustomDropdown";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "ACCOUNTANT" | "BOOKKEEPER" | "MEMBER";
  status: "ACTIVE" | "PENDING";
  addedDate: string;
  lastActive: string;
}

const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: "TM-001",
    name: "ALDRIN_02 (YOU)",
    email: "aldrin@jejaku.app",
    role: "ADMIN",
    status: "ACTIVE",
    addedDate: "2026-01-10",
    lastActive: "JUST NOW",
  },
  {
    id: "TM-002",
    name: "SARAH TAN (TAX FIRM)",
    email: "sarahtan@taxcorp.my",
    role: "ACCOUNTANT",
    status: "ACTIVE",
    addedDate: "2026-03-15",
    lastActive: "2 HOURS AGO",
  },
  {
    id: "TM-003",
    name: "MARCUS LEE",
    email: "marcus@company.com",
    role: "BOOKKEEPER",
    status: "PENDING",
    addedDate: "2026-07-22",
    lastActive: "INVITATION SENT",
  },
];

export default function TeamPage() {
  const [activeNav] = useState<string>("team");
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"ACCOUNTANT" | "BOOKKEEPER" | "MEMBER">("ACCOUNTANT");
  const [isAdding, setIsAdding] = useState(false);

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    const newMember: TeamMember = {
      id: `TM-00${members.length + 1}`,
      name: newEmail.split("@")[0].toUpperCase(),
      email: newEmail,
      role: newRole,
      status: "PENDING",
      addedDate: new Date().toISOString().split("T")[0],
      lastActive: "INVITATION SENT",
    };

    setMembers([newMember, ...members]);
    setNewEmail("");
    setIsAdding(false);
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <div style={dashboardWrapperStyle}>
      <DashboardSidebar activeNav={activeNav} />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowY: "auto" }}>
        <DashboardNavbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <div className="dashboard-body-padding animate-slide-left" style={{ padding: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          
          {/* HERO BANNER */}
          <div className="hero-banner-responsive dot-grid-subtle" style={heroBannerStyle}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxWidth: "100%", minWidth: 0 }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", letterSpacing: "0.1em" }}>
                WORKSPACE GOVERNANCE // COLLABORATION &amp; ACCESS PERMISSIONS
              </span>
              <h1 style={{ fontFamily: "var(--font-body)", fontSize: "var(--display-md)", fontWeight: "700", color: "var(--text-display)", margin: 0, letterSpacing: "-0.02em" }}>
                <MatrixText text="TEAM & ACCOUNTANT WORKSPACE" />
              </h1>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)", marginTop: "2px" }}>
                &gt; DELEGATE TAX RECONCILIATION, BOOKKEEPING &amp; AUDIT READ-ONLY ROLES
              </span>
            </div>

            <button
              onClick={() => setIsAdding(!isAdding)}
              style={{
                backgroundColor: "var(--text-display)",
                color: "var(--black)",
                border: "none",
                borderRadius: "999px",
                fontFamily: "var(--font-data)",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.06em",
                padding: "10px 20px",
                cursor: "pointer",
              }}
            >
              {isAdding ? "[ CLOSE FORM ]" : "[ + INVITE COLLABORATOR ]"}
            </button>
          </div>

          {/* INVITATION FORM */}
          {isAdding && (
            <form onSubmit={handleInvite} className="dot-grid-subtle animate-slide-down" style={panelCardStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid var(--border-visible)", paddingBottom: "10px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--success)" }} />
                <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--success)", letterSpacing: "0.08em" }}>
                  [ NEW WORKSPACE COLLABORATOR INVITATION ]
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)", letterSpacing: "0.08em" }}>
                    COLLABORATOR EMAIL
                  </label>
                  <input
                    type="email"
                    placeholder="accountant@taxfirm.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    style={{
                      backgroundColor: "var(--surface-raised)",
                      border: "1px solid var(--border-visible)",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      fontFamily: "var(--font-data)",
                      fontSize: "11px",
                      color: "var(--text-display)",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <CustomDropdown
                    label="WORKSPACE ROLE"
                    value={newRole}
                    onChange={(val) => setNewRole(val as "ACCOUNTANT" | "BOOKKEEPER" | "MEMBER")}
                    options={[
                      { value: "ACCOUNTANT", label: "ACCOUNTANT (TAX AUDIT & READ/WRITE)" },
                      { value: "BOOKKEEPER", label: "BOOKKEEPER (RECEIPT & SLIP AUDITOR)" },
                      { value: "MEMBER", label: "TEAM MEMBER (EXPENSE SUBMITTER)" },
                    ]}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "4px" }}>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid var(--border-visible)",
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-data)",
                    fontSize: "11px",
                    padding: "8px 16px",
                    borderRadius: "999px",
                    cursor: "pointer",
                  }}
                >
                  [ DISCARD ]
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "var(--text-display)",
                    color: "var(--black)",
                    border: "none",
                    fontFamily: "var(--font-data)",
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "8px 20px",
                    borderRadius: "999px",
                    cursor: "pointer",
                  }}
                >
                  [ SEND WORKSPACE INVITATION ]
                </button>
              </div>
            </form>
          )}

          {/* SUMMARY STATS GRID */}
          <div className="metrics-grid" style={metricsGridStyle}>
            <div className="dot-grid-subtle" style={metricCardStyle}>
              <span style={metricLabelStyle}>ACTIVE TEAM MEMBERS</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: "700", color: "var(--text-display)", marginTop: "4px" }}>
                {members.filter((m) => m.status === "ACTIVE").length} <span style={{ fontSize: "11px", fontFamily: "var(--font-data)", color: "var(--text-secondary)" }}>USERS</span>
              </span>
              <span style={metricSubtextStyle}>Granted telemetry permissions</span>
            </div>

            <div className="dot-grid-subtle" style={metricCardStyle}>
              <span style={metricLabelStyle}>EXTERNAL ACCOUNTANTS</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: "700", color: "var(--success)", marginTop: "4px" }}>
                {members.filter((m) => m.role === "ACCOUNTANT").length} <span style={{ fontSize: "11px", fontFamily: "var(--font-data)", color: "var(--text-secondary)" }}>FIRMS</span>
              </span>
              <span style={metricSubtextStyle}>Auditing annual tax receipts</span>
            </div>

            <div className="dot-grid-subtle" style={metricCardStyle}>
              <span style={metricLabelStyle}>PENDING INVITATIONS</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: "700", color: "var(--orange)", marginTop: "4px" }}>
                {members.filter((m) => m.status === "PENDING").length} <span style={{ fontSize: "11px", fontFamily: "var(--font-data)", color: "var(--text-secondary)" }}>INVITES</span>
              </span>
              <span style={metricSubtextStyle}>Awaiting TLS verification</span>
            </div>
          </div>

          {/* TEAM MEMBERS TABLE PANEL */}
          <div className="dot-grid-subtle" style={panelCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", color: "var(--text-display)" }}>
                [ WORKSPACE COLLABORATORS DIRECTORY ] ({filteredMembers.length})
              </span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={tableHeaderRowStyle}>
                    <th style={tableThStyle}>ID</th>
                    <th style={tableThStyle}>NAME & EMAIL</th>
                    <th style={tableThStyle}>ROLE</th>
                    <th style={tableThStyle}>ADDED DATE</th>
                    <th style={tableThStyle}>LAST ACTIVE</th>
                    <th style={{ ...tableThStyle, textAlign: "center" }}>STATUS</th>
                    <th style={{ ...tableThStyle, textAlign: "right" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((m) => (
                    <tr key={m.id} style={tableRowStyle}>
                      <td style={{ ...tableTdStyle, fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)" }}>{m.id}</td>
                      <td style={tableTdStyle}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: "700", color: "var(--text-display)" }}>{m.name}</span>
                          <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)" }}>{m.email}</span>
                        </div>
                      </td>
                      <td style={tableTdStyle}>
                        <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: m.role === "ADMIN" ? "var(--orange)" : m.role === "ACCOUNTANT" ? "var(--success)" : "var(--interactive)", border: "1px solid var(--border-visible)", padding: "2px 6px", borderRadius: "4px" }}>
                          {m.role}
                        </span>
                      </td>
                      <td style={{ ...tableTdStyle, fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)" }}>{m.addedDate}</td>
                      <td style={{ ...tableTdStyle, fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)" }}>{m.lastActive}</td>
                      <td style={{ ...tableTdStyle, textAlign: "center" }}>
                        <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: m.status === "ACTIVE" ? "var(--success)" : "var(--orange)" }}>
                          [{m.status}]
                        </span>
                      </td>
                      <td style={{ ...tableTdStyle, textAlign: "right" }}>
                        {m.role !== "ADMIN" && (
                          <button
                            onClick={() => handleRemoveMember(m.id)}
                            style={{ backgroundColor: "transparent", border: "1px solid var(--border-visible)", color: "var(--text-disabled)", fontFamily: "var(--font-data)", fontSize: "10px", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                          >
                            [ REVOKE ]
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const dashboardWrapperStyle: React.CSSProperties = {
  display: "flex",
  minHeight: "100vh",
  width: "100%",
  backgroundColor: "var(--black)",
};

const heroBannerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  padding: "var(--space-md)",
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border-visible)",
  borderRadius: "12px",
  flexWrap: "wrap",
  gap: "12px",
};

const metricsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "var(--space-md)",
};

const metricCardStyle: React.CSSProperties = {
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border-visible)",
  borderRadius: "10px",
  padding: "14px 16px",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const metricLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "10px",
  color: "var(--text-secondary)",
  letterSpacing: "0.08em",
};

const metricSubtextStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "10px",
  color: "var(--text-disabled)",
};

const panelCardStyle: React.CSSProperties = {
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border-visible)",
  borderRadius: "10px",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "4px",
};

const tableHeaderRowStyle: React.CSSProperties = {
  borderBottom: "1px solid var(--border-visible)",
};

const tableThStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "10px",
  color: "var(--text-disabled)",
  letterSpacing: "0.08em",
  padding: "8px 10px",
  textAlign: "left",
};

const tableRowStyle: React.CSSProperties = {
  borderBottom: "1px solid var(--border)",
};

const tableTdStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "11px",
  padding: "10px",
  verticalAlign: "middle",
};
