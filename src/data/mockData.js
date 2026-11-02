// Local mock data (no backend). Replace these with API calls when integrating a backend.
import { ALL_TASKS, materialId } from './constants';

const DAY = 86400000;
const iso = (offsetDays) => new Date(Date.now() + offsetDays * DAY).toISOString().slice(0, 10);
const ago = (minutes) => new Date(Date.now() - minutes * 60000).toISOString();

export const img = (id, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMAGES = {
  hero: img('photo-1541888946425-d81bb19240f5', 1920),
  site1: img('photo-1504307651254-35680f356dfd'),
  site2: img('photo-1503387762-592deb58ef4e'),
  site3: img('photo-1581094794329-c8112a89af12'),
  site4: img('photo-1621905251189-08b45d6a269e'),
  tower: img('photo-1486406146926-c627a92ad1ab'),
  villa: img('photo-1600585154340-be6161a56a0c'),
  house: img('photo-1600566753190-17f0baa2a6c3'),
  apartment: img('photo-1522708323590-d24dbb6b0267'),
  living: img('photo-1586023492125-27b2c045efd7'),
  bedroom: img('photo-1616594039964-ae9021a400a0'),
  kitchen: img('photo-1556909114-f6e7ad7d3136'),
  ceiling: img('photo-1618221195710-dd6b41faaea6'),
  lighting: img('photo-1600607687939-ce8a6c25118c'),
  panel: img('photo-1600210492493-0946911123ea'),
  finish: img('photo-1600566753086-00f18fb6b3ea'),
  electrical: img('photo-1621905252507-b35492cc74b4'),
  plumbing: img('photo-1585704032915-c3400ca199e7'),
  team: img('photo-1531973576160-7125cd663d86'),
};

const tasks = (obj) => {
  const base = {};
  ALL_TASKS.forEach((t) => (base[t.id] = 0));
  return { ...base, ...obj };
};

export const initialClients = [
  { id: 'c1', name: 'Ramesh Kumar', email: 'ramesh@example.com', password: 'client123', company: 'Kumar Family', active: true, joined: iso(-210) },
  { id: 'c2', name: 'Priya Nair', email: 'priya@example.com', password: 'client123', company: 'Nair Developers', active: true, joined: iso(-310) },
  { id: 'c3', name: 'Arun Prakash', email: 'arun@example.com', password: 'client123', company: 'Prakash Retail Pvt Ltd', active: true, joined: iso(-160) },
  { id: 'c4', name: 'Meena Subramanian', email: 'meena@example.com', password: 'client123', company: 'Subramanian Industries', active: false, joined: iso(-95) },
];

export const initialSites = [
  {
    id: 's1',
    name: 'Skyline Residency Villa',
    location: 'Anna Nagar, Chennai',
    type: 'Residential',
    startDate: iso(-200),
    expectedDate: iso(40),
    clientId: 'c1',
    optional: { showcase: false, ceiling: false },
    tasks: tasks({ b1: 100, b2: 100, b3: 100, b4: 80, e1: 100, e2: 100, e3: 80, e4: 40, p1: 100, p2: 100, p3: 60, p4: 40 }),
    updates: [
      { id: 'u1', date: iso(-1), text: 'Finishing plaster work completed on the ground floor. Switchboard fixing continues on first floor.', author: 'Site Engineer' },
      { id: 'u2', date: iso(-3), text: 'Overhead water tank installed and pressure tested successfully.', author: 'Plumbing Supervisor' },
      { id: 'u3', date: iso(-6), text: 'Wiring completed in all bedrooms. Light fitting layout marked.', author: 'Electrical Supervisor' },
    ],
    remarks: [{ id: 'r1', date: iso(-2), text: 'Client requested a change in master bedroom switch positions - under review.' }],
    images: [
      { id: 'i1', url: IMAGES.site1, caption: 'Ground floor finishing', date: iso(-1) },
      { id: 'i2', url: IMAGES.site2, caption: 'Roof concrete curing', date: iso(-12) },
      { id: 'i3', url: IMAGES.site4, caption: 'Electrical conduit layout', date: iso(-20) },
      { id: 'i4', url: IMAGES.site3, caption: 'Plumbing line pressure test', date: iso(-4) },
    ],
    history: [
      { id: 'h1', taskId: 'b4', ts: Date.now() - DAY, date: ago(1440), text: 'Finishing Touch (Building) updated to 80%', value: 80 },
      { id: 'h2', taskId: 'p3', ts: Date.now() - 3 * DAY, date: ago(4320), text: 'Water Tank Fixing (Plumbing) updated to 60%', value: 60 },
      { id: 'h3', taskId: 'e3', ts: Date.now() - 5 * DAY, date: ago(7200), text: 'Switchboard Fixing (Electrical) updated to 80%', value: 80 },
    ],
    materials: [
      ...['Cement', 'M-Sand', 'Bricks', 'Steel', 'Concrete', 'Tiles', 'Paint', 'Waterproofing Materials'].map((n) => materialId('building', n)),
      ...['Electrical Wires', 'Switch Boards', 'Switches', 'Conduits', 'LED Lights'].map((n) => materialId('electrical', n)),
      ...['PVC Pipes', 'CPVC Pipes', 'Water Taps', 'Water Tank', 'Bathroom Fittings'].map((n) => materialId('plumbing', n)),
    ],
  },
  {
    id: 's2',
    name: 'Green Valley Apartments',
    location: 'Velachery, Chennai',
    type: 'Residential',
    startDate: iso(-300),
    expectedDate: iso(20),
    clientId: 'c2',
    optional: { showcase: true, ceiling: true },
    tasks: tasks({ b1: 100, b2: 100, b3: 100, b4: 90, e1: 100, e2: 100, e3: 100, e4: 80, p1: 100, p2: 100, p3: 90, p4: 70, s1: 100, s2: 100, s3: 70, s4: 50, c1: 100, c2: 90, c3: 70, c4: 60 }),
    updates: [
      { id: 'u4', date: iso(-1), text: 'Showcase units installed in the lobby. Final polishing in progress.', author: 'Site Engineer' },
      { id: 'u5', date: iso(-4), text: 'False ceiling profile lighting wiring completed for all floors.', author: 'Interior Supervisor' },
    ],
    remarks: [{ id: 'r2', date: iso(-5), text: 'Bathroom tap leakage reported on level 3 - plumber assigned.' }],
    images: [
      { id: 'i5', url: IMAGES.apartment, caption: 'Tower exterior', date: iso(-2) },
      { id: 'i6', url: IMAGES.tower, caption: 'Facade finishing', date: iso(-9) },
      { id: 'i7', url: IMAGES.lighting, caption: 'Lobby ceiling lights', date: iso(-4) },
    ],
    history: [{ id: 'h4', taskId: 's3', ts: Date.now() - DAY, date: ago(1440), text: 'Installation (Showcase) updated to 70%', value: 70 }],
    materials: [
      ...['Cement', 'Steel', 'Concrete', 'Tiles', 'Paint'].map((n) => materialId('building', n)),
      ...['Electrical Wires', 'Distribution Board', 'LED Lights'].map((n) => materialId('electrical', n)),
      ...['PVC Pipes', 'Valves', 'Water Taps'].map((n) => materialId('plumbing', n)),
      ...['Gypsum Boards', 'Profile Lighting', 'Wall Panels', 'Decorative Lights'].map((n) => materialId('interior', n)),
    ],
  },
  {
    id: 's3',
    name: 'Metro Commercial Plaza',
    location: 'OMR, Chennai',
    type: 'Commercial',
    startDate: iso(-150),
    expectedDate: iso(-5),
    clientId: 'c3',
    optional: { showcase: false, ceiling: true },
    tasks: tasks({ b1: 100, b2: 100, b3: 60, e1: 100, e2: 50, p1: 100, p2: 40, c1: 20 }),
    updates: [{ id: 'u6', date: iso(-2), text: 'Roof concrete for the third floor delayed due to material delivery. New schedule shared.', author: 'Project Manager' }],
    remarks: [{ id: 'r3', date: iso(-2), text: 'Delay flagged. Escalated to procurement team.' }],
    images: [
      { id: 'i8', url: IMAGES.site3, caption: 'Structural framework', date: iso(-7) },
      { id: 'i9', url: IMAGES.tower, caption: 'Core block progress', date: iso(-15) },
    ],
    history: [{ id: 'h5', taskId: 'b3', ts: Date.now() - 2 * DAY, date: ago(2880), text: 'Roof Concrete (Building) updated to 60%', value: 60 }],
    materials: ['Cement', 'Steel', 'Concrete', 'Gravel'].map((n) => materialId('building', n)),
  },
  {
    id: 's4',
    name: 'Lakeview Industrial Unit',
    location: 'Ambattur, Chennai',
    type: 'Industrial',
    startDate: iso(-90),
    expectedDate: iso(120),
    clientId: 'c4',
    optional: { showcase: false, ceiling: false },
    tasks: tasks({ b1: 100, b2: 60, e1: 40, p1: 50 }),
    updates: [{ id: 'u7', date: iso(-3), text: 'Lintel level reinforcement work in progress on the eastern wing.', author: 'Site Engineer' }],
    remarks: [],
    images: [{ id: 'i10', url: IMAGES.site4, caption: 'Foundation and columns', date: iso(-10) }],
    history: [{ id: 'h6', taskId: 'b2', ts: Date.now() - 3 * DAY, date: ago(4320), text: 'Lintel (Building) updated to 60%', value: 60 }],
    materials: ['Cement', 'Steel', 'Bricks', 'Gravel'].map((n) => materialId('building', n)),
  },
];

export const initialNotifications = [
  { id: 'n1', type: 'correction', siteId: 's2', title: 'New client correction submitted', text: 'Priya Nair reported a bathroom tap leakage (Plumbing Work).', at: ago(12), read: false },
  { id: 'n2', type: 'message', siteId: 's3', title: 'New client message received', text: 'Arun Prakash requested a site visit schedule.', at: ago(55), read: false },
  { id: 'n3', type: 'milestone', siteId: 's2', title: 'Project reached 85%', text: 'Green Valley Apartments crossed the 85% completion milestone.', at: ago(180), read: false },
  { id: 'n4', type: 'progress', siteId: 's1', title: 'Project progress updated', text: 'Skyline Residency Villa: Finishing Touch now 80%.', at: ago(1440), read: true },
  { id: 'n5', type: 'client', siteId: 's4', title: 'New client assigned', text: 'Meena Subramanian was assigned to Lakeview Industrial Unit.', at: ago(2880), read: true },
  { id: 'n6', type: 'site', siteId: 's4', title: 'New site registered', text: 'Lakeview Industrial Unit has been registered.', at: ago(4320), read: true },
];

export const initialTickets = [
  {
    id: 't1', siteId: 's1', clientId: 'c1', category: 'Electrical Work', type: 'correction', subject: 'Switchboard position change in master bedroom',
    status: 'Under Review', createdAt: ago(2880),
    thread: [
      { id: 'm1', from: 'client', text: 'Please move the switchboard near the bed to the left side of the wall, about 30 cm from the headboard.', at: ago(2880) },
      { id: 'm2', from: 'admin', text: 'Noted, Mr. Kumar. Our electrical supervisor will inspect the wall and confirm feasibility by tomorrow.', at: ago(2400) },
    ],
  },
  {
    id: 't2', siteId: 's2', clientId: 'c2', category: 'Plumbing Work', type: 'correction', subject: 'Bathroom tap leakage on level 3',
    status: 'In Progress', createdAt: ago(700),
    thread: [
      { id: 'm3', from: 'client', text: 'The tap in the level 3 bathroom is leaking continuously. Kindly get it fixed.', at: ago(700) },
      { id: 'm4', from: 'admin', text: 'A plumber has been assigned and will replace the tap cartridge today.', at: ago(300) },
    ],
  },
  {
    id: 't3', siteId: 's3', clientId: 'c3', category: 'General', type: 'message', subject: 'Request for site visit schedule',
    status: 'Submitted', createdAt: ago(55),
    thread: [{ id: 'm5', from: 'client', text: 'Could we schedule a site visit this Saturday to review the revised timeline?', at: ago(55) }],
  },
  {
    id: 't4', siteId: 's1', clientId: 'c1', category: 'Building Work', type: 'correction', subject: 'Tile alignment in the living room',
    status: 'Resolved', createdAt: ago(10080),
    thread: [
      { id: 'm6', from: 'client', text: 'The tiles near the living room entrance look slightly misaligned.', at: ago(10080) },
      { id: 'm7', from: 'admin', text: 'Re-laid and checked with a spirit level. Marking this as resolved.', at: ago(8000) },
    ],
  },
];

export const initialFeedbacks = [
  {
    id: 'f0', siteId: 'site-old', siteName: 'Orchid Residency (Completed)', clientName: 'Sanjay Rao', rating: 5,
    comment: 'Outstanding quality and very transparent progress updates. The team was professional throughout.', at: ago(20000),
  },
];

export const initialActivities = [
  { id: 'a1', text: 'Daily update added for Skyline Residency Villa', at: ago(30) },
  { id: 'a2', text: 'Lintel progress updated for Lakeview Industrial Unit', at: ago(240) },
  { id: 'a3', text: 'Materials list updated for Green Valley Apartments', at: ago(600) },
  { id: 'a4', text: 'Image uploaded to Metro Commercial Plaza', at: ago(1300) },
];

// Interior Works Showcase (client dashboard carousel)
export const interiorSlides = [
  { id: 1, title: 'Modern Living Room', caption: 'Open-plan living with warm lighting, textured wall finish and curated furniture layout.', image: IMAGES.living },
  { id: 2, title: 'Bedroom Interiors', caption: 'Serene master bedroom with upholstered headboard panel and concealed cove lighting.', image: IMAGES.bedroom },
  { id: 3, title: 'Modular Kitchen', caption: 'Handle-less modular kitchen with quartz counters, soft-close storage and task lighting.', image: IMAGES.kitchen },
  { id: 4, title: 'False Ceiling Design', caption: 'Layered gypsum false ceiling with recessed spotlights and a clean cove profile.', image: IMAGES.ceiling },
  { id: 5, title: 'Profile Lighting', caption: 'Slim LED profile lighting that adds depth and drama to feature walls and ceilings.', image: IMAGES.lighting },
  { id: 6, title: 'Wall Panel Designs', caption: 'Fluted wall panels and decorative laminates crafted for a premium look.', image: IMAGES.panel },
  { id: 7, title: 'Premium Interior Finishing', caption: 'Fine detailing, seamless joinery and a flawless paint finish across every room.', image: IMAGES.finish },
  { id: 8, title: 'Completed Interior Project', caption: 'A handed-over villa interior - delivered on time and styled to the last detail.', image: IMAGES.villa },
];
