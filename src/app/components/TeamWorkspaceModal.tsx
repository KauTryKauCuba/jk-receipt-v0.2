"use client";

import { useState } from "react";
import CustomDropdown from "./CustomDropdown";

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: "ACCOUNTANT" | "BOOKKEEPER" | "MEMBER" | "ADMIN";
  status: "ACTIVE" | "PENDING";
}

interface TeamWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_COLLABORATORS: Collaborator[] = [
  { id: "col-1", name: "ALDRIN_02 (YOU)", email: "aldrin@jejaku.app", role: "ADMIN", status: "ACTIVE" },
  { id: "col-2", name: "SARAH TAN (ACCOUNTANT)", email: "sarahtan@taxcorp.my", role: "ACCOUNTANT", status: "ACTIVE" },
];

export default function TeamWorkspaceModal({ isOpen, onClose }: TeamWorkspaceModalProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(INITIAL_COLLABORATORS);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ACCOUNTANT" | "BOOKKEEPER" | "MEMBER">("ACCOUNTANT");

  if (!isOpen) return null;

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const newCol: Collaborator = {
      id: `col-${Date.now()}`,
      name: email.split("@")[0].toUpperCase(),
      email,
      role,
      status: "PENDING",
    };

    setCollaborators((prev) => [...prev, newCol]);
    setEmail("");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "16px",
      }}
    >
      <div
        className="dot-grid-subtle"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border-visible)",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "520px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-visible)", paddingBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", color: "var(--text-display)" }}>
              [ TEAM & ACCOUNTANT WORKSPACE PERMISSIONS ]
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-data)",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            [✕]
          </button>
        </div>

        {/* Invite Form */}
        <form onSubmit={handleInvite} style={{ display: "flex", gap: "8px" }}>
          <input
            type="email"
            placeholder="accountant@firm.com or team@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ flex: 1, backgroundColor: "var(--surface-raised)", border: "1px solid var(--border-visible)", borderRadius: "6px", padding: "8px 10px", fontFamily: "var(--font-data)", fontSize: "11px", color: "var(--text-display)", outline: "none" }}
          />
          <div style={{ width: "160px" }}>
            <CustomDropdown
              value={role}
              onChange={(val) => setRole(val as "ACCOUNTANT" | "BOOKKEEPER" | "MEMBER")}
              options={[
                { value: "ACCOUNTANT", label: "ACCOUNTANT" },
                { value: "BOOKKEEPER", label: "BOOKKEEPER" },
                { value: "MEMBER", label: "TEAM MEMBER" },
              ]}
            />
          </div>
          <button
            type="submit"
            style={{ backgroundColor: "var(--text-display)", color: "var(--black)", border: "none", borderRadius: "6px", padding: "8px 12px", fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            [ + INVITE ]
          </button>
        </form>

        {/* Members List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
          <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", letterSpacing: "0.08em" }}>
            ACTIVE WORKSPACE COLLABORATORS ({collaborators.length})
          </span>
          {collaborators.map((c) => (
            <div
              key={c.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "var(--surface-raised)",
                border: "1px solid var(--border-visible)",
                borderRadius: "6px",
                padding: "8px 12px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--text-display)" }}>
                  {c.name}
                </span>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)" }}>
                  {c.email}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-data)",
                    fontSize: "9px",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    border: "1px solid var(--border-visible)",
                    color: c.role === "ACCOUNTANT" ? "var(--interactive)" : c.role === "ADMIN" ? "var(--success)" : "var(--text-secondary)",
                  }}
                >
                  [{c.role}]
                </span>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: c.status === "ACTIVE" ? "var(--success)" : "var(--warning)" }}>
                  ● {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            backgroundColor: "transparent",
            border: "1px solid var(--border-visible)",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-data)",
            fontSize: "11px",
            padding: "8px",
            borderRadius: "6px",
            cursor: "pointer",
            marginTop: "8px",
          }}
        >
          [ CLOSE PERMISSIONS WINDOW ]
        </button>
      </div>
    </div>
  );
}
