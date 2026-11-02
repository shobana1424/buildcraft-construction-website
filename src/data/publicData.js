// Content for the public website pages.
import { IMAGES } from './mockData';

export const services = [
  { id: 'residential', icon: 'Home', title: 'Residential Construction', image: IMAGES.house, desc: 'Custom villas, independent homes and apartment complexes built with structural integrity and thoughtful design.', points: ['Architectural planning and structural design', 'Premium materials with quality checks', 'Transparent timelines and budgets'] },
  { id: 'commercial', icon: 'Building2', title: 'Commercial Construction', image: IMAGES.tower, desc: 'Offices, retail plazas and hospitality spaces engineered for efficiency, safety and brand presence.', points: ['Turnkey commercial delivery', 'Fast-track scheduling', 'Compliance and safety management'] },
  { id: 'industrial', icon: 'Factory', title: 'Industrial Construction', image: IMAGES.site3, desc: 'Warehouses, factories and industrial units with heavy-duty foundations and scalable layouts.', points: ['Pre-engineered and RCC structures', 'Heavy load flooring', 'Utility and logistics planning'] },
  { id: 'renovation', icon: 'Hammer', title: 'Renovation', image: IMAGES.site1, desc: 'Transform existing spaces with structural upgrades, remodelling and modern finishes - with minimal disruption.', points: ['Structural assessment', 'Space re-planning', 'Phased execution to keep you moving'] },
  { id: 'electrical', icon: 'Zap', title: 'Electrical Work', image: IMAGES.electrical, desc: 'Safe, certified electrical systems from concealed conduits to smart switchboards and lighting design.', points: ['Concealed wiring and conduits', 'Distribution boards and earthing', 'LED and decorative lighting'] },
  { id: 'plumbing', icon: 'Droplets', title: 'Plumbing', image: IMAGES.plumbing, desc: 'Reliable water supply and drainage systems using quality PVC and CPVC lines with leak-tested joints.', points: ['Water line concealing', 'Tank and pump installation', 'Bathroom and kitchen fittings'] },
  { id: 'interior', icon: 'PaintRoller', title: 'Interior Design & Ceiling Work', image: IMAGES.ceiling, desc: 'Modular kitchens, false ceilings, profile lighting and wall panelling designed to elevate every room.', points: ['3D design visualisation', 'Gypsum ceilings and profile lights', 'Wall panels and premium laminates'] },
];

export const stats = [
  { label: 'Projects Completed', value: 450, suffix: '+' },
  { label: 'Years of Experience', value: 18, suffix: '' },
  { label: 'Happy Clients', value: 380, suffix: '+' },
  { label: 'Skilled Professionals', value: 220, suffix: '+' },
];

export const whyUs = [
  { icon: 'ShieldCheck', title: 'Quality Assured', text: 'Multi-stage quality inspections and certified materials on every site.' },
  { icon: 'Clock', title: 'On-Time Delivery', text: 'Disciplined scheduling and live progress tracking keep projects on track.' },
  { icon: 'Eye', title: 'Full Transparency', text: 'Clients follow daily updates, photos and materials from their own dashboard.' },
  { icon: 'Users', title: 'Expert Team', text: 'Engineers, architects and supervisors with decades of combined experience.' },
  { icon: 'BadgeCheck', title: 'Honest Pricing', text: 'Clear estimates with no hidden costs and detailed material lists.' },
  { icon: 'Wrench', title: 'After-Handover Support', text: 'Dedicated correction handling and post-completion service.' },
];

export const testimonials = [
  { name: 'Sanjay Rao', role: 'Homeowner, Orchid Residency', text: 'The progress dashboard made the entire build stress-free. I could see every update and photo without chasing anyone.' },
  { name: 'Lakshmi Venkat', role: 'Director, Venkat Retail', text: 'Our commercial plaza was delivered with superb finishing. The team handled every correction promptly.' },
  { name: 'Imran Sheikh', role: 'Plant Manager, Sheikh Industries', text: 'Professional, punctual and precise. The industrial unit was ready ahead of schedule and within budget.' },
];

export const projects = [
  { id: 1, title: 'Skyline Residency Villa', category: 'Residential', location: 'Chennai', image: IMAGES.villa, status: 'Completed' },
  { id: 2, title: 'Metro Commercial Plaza', category: 'Commercial', location: 'Chennai', image: IMAGES.tower, status: 'Completed' },
  { id: 3, title: 'Lakeview Industrial Unit', category: 'Industrial', location: 'Chennai', image: IMAGES.site3, status: 'Ongoing' },
  { id: 4, title: 'Heritage Home Renovation', category: 'Renovation', location: 'Coimbatore', image: IMAGES.site1, status: 'Completed' },
  { id: 5, title: 'Serene Living Interiors', category: 'Interior', location: 'Bengaluru', image: IMAGES.living, status: 'Completed' },
  { id: 6, title: 'Green Valley Apartments', category: 'Residential', location: 'Chennai', image: IMAGES.apartment, status: 'Ongoing' },
  { id: 7, title: 'Modular Kitchen Studio', category: 'Interior', location: 'Madurai', image: IMAGES.kitchen, status: 'Completed' },
  { id: 8, title: 'Corporate Tech Park', category: 'Commercial', location: 'Hyderabad', image: IMAGES.site2, status: 'Ongoing' },
  { id: 9, title: 'Premium Bedroom Suite', category: 'Interior', location: 'Chennai', image: IMAGES.bedroom, status: 'Completed' },
  { id: 10, title: 'Modern Family Home', category: 'Residential', location: 'Trichy', image: IMAGES.house, status: 'Completed' },
  { id: 11, title: 'Warehouse Complex', category: 'Industrial', location: 'Hosur', image: IMAGES.site4, status: 'Completed' },
  { id: 12, title: 'Ceiling & Lighting Showcase', category: 'Interior', location: 'Chennai', image: IMAGES.ceiling, status: 'Completed' },
];
export const galleryFilters = ['All', 'Residential', 'Commercial', 'Industrial', 'Renovation', 'Interior'];

export const values = [
  { icon: 'ShieldCheck', title: 'Integrity', text: 'We do what we say, and we build what we promise.' },
  { icon: 'Award', title: 'Excellence', text: 'Every detail is inspected to exceed standards.' },
  { icon: 'Handshake', title: 'Partnership', text: 'Clients are collaborators from first sketch to handover.' },
  { icon: 'Leaf', title: 'Sustainability', text: 'Efficient design and responsible material choices.' },
];

export const team = [
  { name: 'Rajesh Menon', role: 'Founder & Managing Director' },
  { name: 'Anitha Krishnan', role: 'Chief Architect' },
  { name: 'Vikram Sethi', role: 'Head of Construction' },
  { name: 'Deepa Raghavan', role: 'Interior Design Lead' },
];

export const timeline = [
  { year: '2008', text: 'Founded with a small residential team.' },
  { year: '2013', text: 'Expanded into commercial construction.' },
  { year: '2018', text: 'Launched industrial and renovation divisions.' },
  { year: '2024', text: 'Introduced digital project tracking for every client.' },
];

export const enquiryServices = ['Residential Construction', 'Commercial Construction', 'Industrial Construction', 'Renovation', 'Electrical Work', 'Plumbing', 'Interior Design and Ceiling Work'];
