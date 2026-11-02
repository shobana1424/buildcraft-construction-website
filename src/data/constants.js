// Shared constants: work categories, task definitions, material groups, statuses.

export const COMPANY = {
  name: 'BuildCraft Constructions',
  tagline: 'Building Trust. Delivering Excellence.',
  email: 'enquiries@buildcraftconstructions.com',
  address: ['Skyline Business Park, 4th Floor', 'Industrial Estate Road', 'Chennai, Tamil Nadu 600032, India'],
  hours: 'Mon - Sat, 9:00 AM - 6:00 PM',
};

export const CATEGORY_ORDER = ['building', 'electrical', 'plumbing', 'showcase', 'ceiling'];

export const CATEGORIES = {
  building: {
    key: 'building',
    name: 'Building Work',
    short: 'Building',
    mandatory: true,
    color: '#1769E0',
    tasks: [
      { id: 'b1', name: 'Basement' },
      { id: 'b2', name: 'Lintel' },
      { id: 'b3', name: 'Roof Concrete' },
      { id: 'b4', name: 'Finishing Touch' },
    ],
  },
  electrical: {
    key: 'electrical',
    name: 'Electrical Work',
    short: 'Electrical',
    mandatory: true,
    color: '#F5A623',
    tasks: [
      { id: 'e1', name: 'Wiring Pipe Concealing' },
      { id: 'e2', name: 'Wiring' },
      { id: 'e3', name: 'Switchboard Fixing' },
      { id: 'e4', name: 'Light Fitting' },
    ],
  },
  plumbing: {
    key: 'plumbing',
    name: 'Plumbing Work',
    short: 'Plumbing',
    mandatory: true,
    color: '#0891B2',
    tasks: [
      { id: 'p1', name: 'Water Line Pipe Concealing' },
      { id: 'p2', name: 'Water Input and Output Pipe Fitting' },
      { id: 'p3', name: 'Water Tank Fixing' },
      { id: 'p4', name: 'Bathroom Fittings Fixing' },
    ],
  },
  showcase: {
    key: 'showcase',
    name: 'Showcase Work',
    short: 'Showcase',
    mandatory: false,
    color: '#7C3AED',
    tasks: [
      { id: 's1', name: 'Design & Layout' },
      { id: 's2', name: 'Fabrication' },
      { id: 's3', name: 'Installation' },
      { id: 's4', name: 'Final Polish' },
    ],
  },
  ceiling: {
    key: 'ceiling',
    name: 'Wall Ceiling Work',
    short: 'Wall Ceiling',
    mandatory: false,
    color: '#E11D48',
    tasks: [
      { id: 'c1', name: 'Framing' },
      { id: 'c2', name: 'Gypsum Board Fixing' },
      { id: 'c3', name: 'Profile Lighting' },
      { id: 'c4', name: 'Painting & Finish' },
    ],
  },
};

export const ALL_TASKS = CATEGORY_ORDER.flatMap((k) =>
  CATEGORIES[k].tasks.map((t) => ({ ...t, cat: k }))
);
export const findTask = (id) => ALL_TASKS.find((t) => t.id === id);

export const MATERIAL_GROUPS = [
  {
    key: 'building',
    title: 'Building Materials',
    color: '#1769E0',
    items: ['Cement', 'M-Sand', 'P-Sand', 'Bricks', 'Steel', 'Concrete', 'Gravel', 'Tiles', 'Paint', 'Waterproofing Materials'],
  },
  {
    key: 'electrical',
    title: 'Electrical Materials',
    color: '#F5A623',
    items: ['Electrical Wires', 'Switch Boards', 'Switches', 'Conduits', 'LED Lights', 'Distribution Board', 'Electrical Accessories'],
  },
  {
    key: 'plumbing',
    title: 'Plumbing Materials',
    color: '#0891B2',
    items: ['PVC Pipes', 'CPVC Pipes', 'Water Taps', 'Bathroom Fittings', 'Water Tank', 'Valves', 'Plumbing Accessories'],
  },
  {
    key: 'interior',
    title: 'Interior Materials',
    color: '#7C3AED',
    items: ['Gypsum Boards', 'Ceiling Materials', 'Wall Panels', 'Decorative Lights', 'Profile Lighting', 'Laminates', 'Interior Fittings'],
  },
];
export const materialId = (groupKey, name) => `${groupKey}:${name}`;
export const ALL_MATERIAL_IDS = MATERIAL_GROUPS.flatMap((g) => g.items.map((i) => materialId(g.key, i)));

export const TICKET_STATUSES = ['Submitted', 'Under Review', 'In Progress', 'Resolved'];
export const TICKET_CATEGORIES = ['General', 'Building Work', 'Electrical Work', 'Plumbing Work', 'Showcase Work', 'Wall Ceiling Work'];
export const PROJECT_TYPES = ['Residential', 'Commercial', 'Industrial', 'Renovation'];

export const STATUS_STYLES = {
  'On Track': 'bg-green-100 text-green-700 ring-green-200',
  'In Progress': 'bg-orange-100 text-orange-700 ring-orange-200',
  Delayed: 'bg-red-100 text-red-700 ring-red-200',
  Completed: 'bg-royal-50 text-royal ring-blue-200',
};
export const TICKET_STYLES = {
  Submitted: 'bg-slate-100 text-slate-700 ring-slate-200',
  'Under Review': 'bg-amber-100 text-amber-700 ring-amber-200',
  'In Progress': 'bg-blue-100 text-blue-700 ring-blue-200',
  Resolved: 'bg-green-100 text-green-700 ring-green-200',
};
