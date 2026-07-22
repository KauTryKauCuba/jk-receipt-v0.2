"use client";

import OperatorPassCard from "./OperatorPassCard";

interface SidebarPassPeekCardProps {
  callSign?: string;
  useCase?: string;
  mainGoal?: string;
  monthlyVolume?: string;
  trackedItems?: string[];
  collaborators?: string[];
}

export default function SidebarPassPeekCard({
  callSign = "ALDRIN_02",
  useCase = "BUSINESS",
  mainGoal = "TAX OPTIMIZATION",
  monthlyVolume = "50-200",
  trackedItems = ["household", "warranties", "tax"],
  collaborators = ["me", "spouse"],
}: SidebarPassPeekCardProps) {
  return (
    <div style={{ padding: "0 2px", marginBottom: "8px" }}>
      <div className="sidebar-pass-peek-container dot-grid-subtle" title="Hover to view full Operator Pass">
        <OperatorPassCard
          callSign={callSign}
          useCase={useCase}
          mainGoal={mainGoal}
          monthlyVolume={monthlyVolume}
          trackedItems={trackedItems}
          collaborators={collaborators}
          profileImage={null}
          autoSpin={false}
        />
      </div>
    </div>
  );
}
