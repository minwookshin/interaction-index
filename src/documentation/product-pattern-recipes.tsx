import {
  ArrowSquareOut,
  CreditCard,
  DownloadSimple,
  EnvelopeSimple,
  Plus,
  ShieldCheck,
  UserPlus,
  Users,
} from "@phosphor-icons/react";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Chart,
  Checkbox,
  DataTable,
  type DataTableColumn,
  DataToolbar,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FilterBuilder,
  type DataFilter,
  type FilterField,
  Goal,
  Metric,
  Progress,
  SearchInput,
  SegmentedControl,
  Select,
  SharedDetail,
  Sparkline,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextField,
  Timeline,
  type TimelineItem,
  toast,
  type AnalyticsDatum,
  type AnalyticsSeries,
} from "../components/ui";

const compactCurrency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });
const exactCurrency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

type Customer = {
  id: string;
  name: string;
  segment: "Enterprise" | "Growth" | "Startup";
  health: "Healthy" | "Watch" | "At risk";
  plan: string;
  owner: string;
  renewal: string;
  arr: number;
  adoption: number;
  nextAction: string;
};

const customers: readonly Customer[] = [
  { id: "cus_northstar", name: "Northstar Labs", segment: "Enterprise", health: "Healthy", plan: "Enterprise", owner: "Avery Stone", renewal: "Sep 18", arr: 148_000, adoption: 84, nextAction: "Review rollout plan" },
  { id: "cus_fieldwork", name: "Fieldwork", segment: "Growth", health: "Watch", plan: "Scale", owner: "Mina Park", renewal: "Oct 02", arr: 72_000, adoption: 61, nextAction: "Confirm data migration" },
  { id: "cus_relay", name: "Relay Systems", segment: "Enterprise", health: "At risk", plan: "Enterprise", owner: "Noah Williams", renewal: "Aug 29", arr: 196_000, adoption: 43, nextAction: "Resolve SSO blocker" },
  { id: "cus_kindred", name: "Kindred", segment: "Growth", health: "Healthy", plan: "Scale", owner: "Sofia Chen", renewal: "Nov 12", arr: 54_000, adoption: 78, nextAction: "Share QBR notes" },
  { id: "cus_juniper", name: "Juniper Works", segment: "Startup", health: "Healthy", plan: "Pro", owner: "Avery Stone", renewal: "Dec 06", arr: 18_000, adoption: 91, nextAction: "Introduce automation beta" },
  { id: "cus_cinder", name: "Cinder", segment: "Growth", health: "Watch", plan: "Scale", owner: "Mina Park", renewal: "Sep 27", arr: 68_000, adoption: 57, nextAction: "Review seat utilization" },
];

const customerFilterFields: readonly FilterField[] = [
  { id: "health", label: "Health", values: ["Healthy", "Watch", "At risk"].map((value) => ({ label: value, value })) },
  { id: "segment", label: "Segment", values: ["Enterprise", "Growth", "Startup"].map((value) => ({ label: value, value })) },
];

const customerEvents: Record<string, readonly TimelineItem[]> = Object.fromEntries(customers.map((customer, index) => [customer.id, [
  { id: `${customer.id}-1`, label: customer.nextAction, timestamp: "Today", description: `Owned by ${customer.owner}`, tone: customer.health === "At risk" ? "danger" : "accent" },
  { id: `${customer.id}-2`, label: "Usage review", timestamp: `${index + 2}d ago`, description: `${customer.adoption}% feature adoption` },
  { id: `${customer.id}-3`, label: "Account note added", timestamp: `${index + 5}d ago`, description: `${customer.segment} success plan` },
]]));

function healthVariant(health: Customer["health"]) {
  if (health === "Healthy") return "success" as const;
  if (health === "At risk") return "danger" as const;
  return "warning" as const;
}

export function CustomerWorkspaceRecipe() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<readonly DataFilter[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(customers[0].id);
  const [completedActions, setCompletedActions] = useState<readonly string[]>([]);
  const visible = useMemo(() => customers.filter((customer) => {
    const matchesQuery = `${customer.name} ${customer.owner} ${customer.plan}`.toLocaleLowerCase().includes(query.toLocaleLowerCase());
    return matchesQuery && filters.every((filter) => String(customer[filter.fieldId as "health" | "segment"]) === String(filter.value));
  }), [filters, query]);
  const items = visible.map((customer) => ({
    id: customer.id,
    title: customer.name,
    meta: `${customer.segment} · ${customer.owner}`,
    description: customer.nextAction,
    status: customer.health,
  }));

  return (
    <section className="teum-product-pattern" aria-label="Customer Workspace recipe">
      <header className="teum-product-pattern__header">
        <div><span>Customer success</span><h3>Customer Workspace</h3><p>Account health, usage, and follow-up stay attached to one customer.</p></div>
        <Badge variant="outline">{visible.length} {visible.length === 1 ? "account" : "accounts"}</Badge>
      </header>
      <DataToolbar
        label="Customer workspace controls"
        start={<>
          <SearchInput label="Search customers" placeholder="Search accounts…" value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery("")} />
          <FilterBuilder fields={customerFilterFields} filters={filters} onFiltersChange={setFilters} />
        </>}
      />
      {items.length ? (
        <SharedDetail
          className="teum-product-pattern__customer-detail"
          items={items}
          selectedId={items.some((item) => item.id === selectedId) ? selectedId : null}
          onSelectedIdChange={setSelectedId}
          focusOnOpen={false}
          regionLabel="Selected customer"
          renderDetail={(item) => {
            const customer = customers.find((candidate) => candidate.id === item.id)!;
            const actionComplete = completedActions.includes(customer.id);
            return <div className="teum-product-pattern__customer-body">
              <div className="teum-product-pattern__customer-meta"><Badge variant={healthVariant(customer.health)}>{customer.health}</Badge><span>{customer.plan}</span><span>Renews {customer.renewal}</span></div>
              <div className="teum-product-pattern__compact-metrics">
                <Metric label="Annual value" value={compactCurrency.format(customer.arr)} />
                <Metric label="Adoption" value={`${customer.adoption}%`} context={`${Math.max(3, Math.round(customer.adoption / 8))} active teams`} />
              </div>
              <Progress label="Workspace adoption" value={customer.adoption} />
              <Tabs defaultValue="overview" className="teum-product-pattern__inner-tabs">
                <TabsList aria-label={`${customer.name} detail views`}><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger></TabsList>
                <TabsContent value="overview" className="teum-product-pattern__customer-panel">
                  <dl className="teum-product-pattern__facts"><div><dt>Owner</dt><dd>{customer.owner}</dd></div><div><dt>Segment</dt><dd>{customer.segment}</dd></div><div><dt>Next action</dt><dd>{actionComplete ? "Complete" : customer.nextAction}</dd></div></dl>
                  <Button size="small" variant={actionComplete ? "secondary" : "primary"} disabled={actionComplete} onClick={() => { setCompletedActions((current) => [...current, customer.id]); toast("Follow-up completed", { id: "product-pattern-feedback" }); }}>{actionComplete ? "Follow-up complete" : "Complete follow-up"}</Button>
                </TabsContent>
                <TabsContent value="activity" className="teum-product-pattern__customer-panel"><Timeline label={`${customer.name} activity`} items={customerEvents[customer.id]} /></TabsContent>
              </Tabs>
            </div>;
          }}
        />
      ) : <div className="teum-product-pattern__empty" role="status"><strong>No matching accounts</strong><span>Change the query or customer filters.</span><Button size="small" variant="secondary" onClick={() => { setQuery(""); setFilters([]); }}>Clear filters</Button></div>}
    </section>
  );
}

const usageSeries: readonly AnalyticsSeries[] = [
  { id: "requests", label: "API requests", tone: "primary" },
  { id: "included", label: "Included baseline", tone: "secondary", lineStyle: "dashed" },
];

const usageByPeriod: Record<string, readonly AnalyticsDatum[]> = {
  "30d": Array.from({ length: 10 }, (_, index) => ({ id: `30d-${index}`, label: `Aug ${index * 3 + 1}`, values: { requests: 2.8 + index * .31 + Math.sin(index) * .24, included: 4.8 } })),
  "90d": Array.from({ length: 12 }, (_, index) => ({ id: `90d-${index}`, label: `W${index + 1}`, values: { requests: 2.2 + index * .26 + Math.sin(index * .8) * .2, included: 4.8 } })),
};

type Invoice = { id: string; date: string; amount: number; status: "Paid" | "Due"; };
const invoices: readonly Invoice[] = [
  { id: "INV-1048", date: "Aug 01, 2026", amount: 2_840, status: "Paid" },
  { id: "INV-1037", date: "Jul 01, 2026", amount: 2_716, status: "Paid" },
  { id: "INV-1029", date: "Jun 01, 2026", amount: 2_604, status: "Paid" },
];

export function BillingUsageRecipe() {
  const [period, setPeriod] = useState("30d");
  const [manageOpen, setManageOpen] = useState(false);
  const data = usageByPeriod[period];
  const invoiceColumns = useMemo<readonly DataTableColumn<Invoice>[]>(() => [
    { id: "invoice", header: "Invoice", accessor: "id", width: 140 },
    { id: "date", header: "Date", accessor: "date", width: 160 },
    { id: "status", header: "Status", width: 96, cell: (invoice) => <Badge variant={invoice.status === "Paid" ? "success" : "warning"}>{invoice.status}</Badge> },
    { id: "amount", header: "Amount", accessor: "amount", align: "end", width: 110, cell: (invoice) => exactCurrency.format(invoice.amount) },
    { id: "action", header: <span className="teum-sr-only">Download</span>, align: "end", width: 88, cell: (invoice) => <Button size="small" variant="ghost" leadingIcon={<DownloadSimple />} onClick={() => toast(`${invoice.id} downloaded`, { id: "product-pattern-feedback" })}>PDF</Button> },
  ], []);

  return (
    <section className="teum-product-pattern" aria-label="Billing and Usage recipe">
      <header className="teum-product-pattern__header">
        <div><span>Workspace billing</span><h3>Billing &amp; Usage</h3><p>Plan cost, product usage, and invoices share one billing period.</p></div>
        <SegmentedControl size="small" label="Billing period" value={period} onValueChange={(value) => value && setPeriod(value)} options={[{ value: "30d", label: "30D" }, { value: "90d", label: "90D" }]} />
      </header>
      <div className="teum-product-pattern__billing-summary">
        <div className="teum-product-pattern__plan"><span className="teum-product-pattern__plan-icon"><CreditCard aria-hidden="true" /></span><div><strong>Scale plan</strong><span>$2,400 base · Renews Sep 1</span></div><Button size="small" variant="secondary" onClick={() => setManageOpen(true)}>Manage plan</Button></div>
        <div className="teum-product-pattern__compact-metrics teum-product-pattern__compact-metrics--three">
          <Metric label="Current spend" value="$2,840" trend={{ value: "+4.6%", label: "vs last period", direction: "up" }} />
          <Metric label="API requests" value="4.2M" context="87% of included usage" visual={<Sparkline values={data.map((datum) => datum.values.requests)} decorative fill />} />
          <Metric label="Active seats" value="68 / 80" context="12 seats available" />
        </div>
      </div>
      <Alert className="teum-product-pattern__usage-alert" title="API usage is at 87%" action={<Button size="small" variant="ghost" onClick={() => setManageOpen(true)}>Review limits</Button>}><span>Current growth reaches the included limit in about six days.</span></Alert>
      <div className="teum-product-pattern__billing-grid">
        <Chart title="API usage" description={`${period === "30d" ? "Thirty-day" : "Ninety-day"} usage against the included baseline.`} data={data} series={usageSeries} includeZero valueFormatter={(value) => `${value.toFixed(1)}M`} />
        <aside className="teum-product-pattern__limits" aria-label="Plan limits">
          <strong>Plan limits</strong>
          <Progress label="API requests · 4.2M / 4.8M" value={4.2} max={4.8} />
          <Progress label="Seats · 68 / 80" value={68} max={80} />
          <Progress label="Storage · 1.6TB / 3TB" value={1.6} max={3} />
          <Goal label="Annual commitment" value={27_480} target={32_000} formatter={(value) => compactCurrency.format(value)} />
        </aside>
      </div>
      <div className="teum-product-pattern__table-block"><div><strong>Invoices</strong><span>Paid by card ending 4242</span></div><DataTable ariaLabel="Billing invoices" data={invoices} columns={invoiceColumns} getRowId={(invoice) => invoice.id} paginate={false} /></div>
      <Dialog open={manageOpen} onOpenChange={setManageOpen}><DialogContent><DialogHeader><DialogTitle>Review Scale plan</DialogTitle><DialogDescription>Compare the current limits before requesting a plan change.</DialogDescription></DialogHeader><dl className="teum-product-pattern__dialog-facts"><div><dt>Current</dt><dd>$2,400 / month</dd></div><div><dt>Included</dt><dd>4.8M requests · 80 seats</dd></div><div><dt>Renews</dt><dd>Sep 1, 2026</dd></div></dl><DialogFooter><Button variant="ghost" onClick={() => setManageOpen(false)}>Cancel</Button><Button variant="primary" leadingIcon={<ArrowSquareOut />} onClick={() => { setManageOpen(false); toast("Plan request opened", { id: "product-pattern-feedback" }); }}>Contact sales</Button></DialogFooter></DialogContent></Dialog>
    </section>
  );
}

type Member = { id: string; name: string; email: string; role: "Owner" | "Admin" | "Member" | "Viewer"; status: "Active" | "Invited"; initials: string; };
const initialMembers: readonly Member[] = [
  { id: "avery", name: "Avery Stone", email: "avery@northstar.co", role: "Owner", status: "Active", initials: "AS" },
  { id: "mina", name: "Mina Park", email: "mina@northstar.co", role: "Admin", status: "Active", initials: "MP" },
  { id: "noah", name: "Noah Williams", email: "noah@northstar.co", role: "Member", status: "Active", initials: "NW" },
  { id: "sofia", name: "Sofia Chen", email: "sofia@northstar.co", role: "Member", status: "Active", initials: "SC" },
  { id: "jules", name: "Jules Martin", email: "jules@northstar.co", role: "Viewer", status: "Invited", initials: "JM" },
];
const roleOptions = ["Owner", "Admin", "Member", "Viewer"].map((value) => ({ label: value, value }));
const memberFilterFields: readonly FilterField[] = [{ id: "role", label: "Role", values: roleOptions }, { id: "status", label: "Status", values: ["Active", "Invited"].map((value) => ({ label: value, value })) }];
const permissionLabels = ["Manage billing", "Invite members", "Manage integrations", "Export data"] as const;
const initialPermissions: Record<Member["role"], readonly boolean[]> = {
  Owner: [true, true, true, true], Admin: [false, true, true, true], Member: [false, false, true, true], Viewer: [false, false, false, false],
};

export function MembersPermissionsRecipe() {
  const [tab, setTab] = useState("members");
  const [members, setMembers] = useState<readonly Member[]>(initialMembers);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<readonly DataFilter[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Member["role"]>("Member");
  const [permissions, setPermissions] = useState(initialPermissions);
  const visibleMembers = useMemo(() => members.filter((member) => `${member.name} ${member.email}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()) && filters.every((filter) => String(member[filter.fieldId as "role" | "status"]) === String(filter.value))), [filters, members, query]);
  const updateRole = useCallback((memberId: string, role: Member["role"]) => {
    setMembers((current) => current.map((member) => member.id === memberId ? { ...member, role } : member));
    toast("Member role updated", { id: "product-pattern-feedback" });
  }, []);
  const memberColumns = useMemo<readonly DataTableColumn<Member>[]>(() => [
    { id: "member", header: "Member", width: 250, cell: (member) => <span className="teum-product-pattern__member"><Avatar fallback={member.initials} size="small" status={member.status === "Active" ? "online" : "offline"} /><span><strong>{member.name}</strong><small>{member.email}</small></span></span> },
    { id: "status", header: "Status", width: 100, cell: (member) => <Badge variant={member.status === "Active" ? "success" : "neutral"}>{member.status}</Badge> },
    { id: "role", header: "Role", width: 150, cell: (member) => <Select aria-label={`Role for ${member.name}`} options={roleOptions} value={member.role} onValueChange={(value) => value && updateRole(member.id, value as Member["role"])} /> },
  ], [updateRole]);
  const invite = () => {
    const email = inviteEmail.trim();
    if (!email || members.some((member) => member.email.toLocaleLowerCase() === email.toLocaleLowerCase())) return;
    const name = email.split("@")[0].split(/[._-]/).map((part) => part.charAt(0).toLocaleUpperCase() + part.slice(1)).join(" ");
    setMembers((current) => [...current, { id: `invite-${current.length}`, name, email, role: inviteRole, status: "Invited", initials: name.split(" ").map((part) => part[0]).join("").slice(0, 2) }]);
    setInviteOpen(false); setInviteEmail(""); setInviteRole("Member"); toast("Invitation sent", { id: "product-pattern-feedback" });
  };

  return (
    <section className="teum-product-pattern" aria-label="Members and Permissions recipe">
      <header className="teum-product-pattern__header"><div><span>Workspace access</span><h3>Members &amp; Permissions</h3><p>Membership and role policy stay in one administrative task.</p></div><Badge variant="outline"><Users aria-hidden="true" /> {members.length} people</Badge></header>
      <Tabs value={tab} onValueChange={(value) => setTab(value)} className="teum-product-pattern__admin-tabs">
        <div className="teum-product-pattern__tabs-bar"><TabsList aria-label="Access management views"><TabsTrigger value="members">Members</TabsTrigger><TabsTrigger value="permissions">Permissions</TabsTrigger></TabsList><Button size="small" variant="primary" leadingIcon={<UserPlus />} onClick={() => setInviteOpen(true)}>Invite member</Button></div>
        <TabsContent value="members" className="teum-product-pattern__stable-panel">
          <DataToolbar label="Member controls" start={<><SearchInput label="Search members" placeholder="Search people…" value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery("")} /><FilterBuilder fields={memberFilterFields} filters={filters} onFiltersChange={setFilters} /></>} />
          <DataTable ariaLabel="Workspace members" data={visibleMembers} columns={memberColumns} getRowId={(member) => member.id} paginate={false} emptyTitle="No matching members" emptyDescription="Change the query or role filters." />
        </TabsContent>
        <TabsContent value="permissions" className="teum-product-pattern__stable-panel">
          <div className="teum-product-pattern__permission-heading"><div><strong>Role permissions</strong><span>Changes apply to everyone with that role.</span></div><Badge variant="outline"><ShieldCheck aria-hidden="true" /> Workspace policy</Badge></div>
          <div className="teum-product-pattern__permission-scroll" role="region" aria-label="Role permissions table" tabIndex={0}><table><thead><tr><th scope="col">Capability</th>{roleOptions.map((role) => <th scope="col" key={role.value}>{role.label}</th>)}</tr></thead><tbody>{permissionLabels.map((permission, permissionIndex) => <tr key={permission}><th scope="row">{permission}</th>{roleOptions.map((role) => { const roleName = role.value as Member["role"]; const locked = roleName === "Owner"; return <td key={role.value}><Checkbox aria-label={`${permission} for ${role.label}`} checked={permissions[roleName][permissionIndex]} disabled={locked} onCheckedChange={(checked) => setPermissions((current) => ({ ...current, [roleName]: current[roleName].map((value, index) => index === permissionIndex ? checked === true : value) }))} /></td>; })}</tr>)}</tbody></table></div>
          <Alert title="Owner access is protected" icon={<ShieldCheck weight="fill" />}><span>Owner permissions stay enabled so the workspace always has a recoverable administrator.</span></Alert>
        </TabsContent>
      </Tabs>
      <Dialog open={inviteOpen} onOpenChange={(open) => { setInviteOpen(open); if (!open) setInviteEmail(""); }}><DialogContent><DialogHeader><DialogTitle>Invite a workspace member</DialogTitle><DialogDescription>Choose a role before the invitation is sent.</DialogDescription></DialogHeader><div className="teum-product-pattern__invite-form"><TextField label="Work email" type="email" value={inviteEmail} leading={<EnvelopeSimple />} placeholder="name@company.com" onChange={(event) => setInviteEmail(event.target.value)} error={inviteEmail && members.some((member) => member.email.toLocaleLowerCase() === inviteEmail.toLocaleLowerCase()) ? "This person is already in the workspace." : undefined} /><Select label="Role" options={roleOptions} value={inviteRole} onValueChange={(value) => value && setInviteRole(value as Member["role"])} /></div><DialogFooter><Button variant="ghost" onClick={() => setInviteOpen(false)}>Cancel</Button><Button variant="primary" leadingIcon={<Plus />} disabled={!inviteEmail.includes("@") || members.some((member) => member.email.toLocaleLowerCase() === inviteEmail.toLocaleLowerCase())} onClick={invite}>Send invitation</Button></DialogFooter></DialogContent></Dialog>
    </section>
  );
}
