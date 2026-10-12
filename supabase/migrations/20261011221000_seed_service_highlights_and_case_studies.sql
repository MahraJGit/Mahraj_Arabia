-- Seed Highlights and Case Studies for published demo services.

update public.services
set
  highlights_title = 'Key highlights',
  highlights_description = 'Practical advantages for site offices, welfare units and temporary workplace setups.',
  highlights = $json$[
    {
      "title": "Site-ready delivery",
      "description": "Units arrive prepared for rapid placement with clear access and utility connection points.",
      "icon": "zap",
      "points": ["Fast mobilisation", "Clear site access planning", "Ready for temporary power"]
    },
    {
      "title": "Flexible layouts",
      "description": "Configure offices, meeting rooms, security cabins and storage to match your site programme.",
      "icon": "layers",
      "points": ["Single or linked units", "Multiple room options", "Scalable as works grow"]
    },
    {
      "title": "Built for site conditions",
      "description": "Robust construction suited to Saudi project environments and everyday site use.",
      "icon": "shield",
      "points": ["Durable finishes", "Secure entry options", "Low-maintenance operation"]
    }
  ]$json$::jsonb,
  case_studies_title = 'From concept to completion',
  case_studies_description = 'Examples of how porta cabins and site offices support real project requirements.',
  case_studies = $json$[
    {
      "title": "Porta Cabins & Site Offices",
      "imageUrl": "/images/projects/porta-cabins-site-offices.jpg",
      "imageAlt": "Porta cabins and site offices",
      "meta": "Site ready portable facilities",
      "badge": "Capability",
      "price": "Quote on request"
    },
    {
      "title": "Ablution & Sanitary Units",
      "imageUrl": "/images/projects/ablution-sanitary-units.jpg",
      "imageAlt": "Ablution and sanitary units",
      "meta": "Portable welfare facilities",
      "badge": "Capability",
      "price": "Quote on request"
    },
    {
      "title": "Customized Modular Solutions",
      "imageUrl": "/images/projects/customized-modular-solutions.jpg",
      "imageAlt": "Customized modular solutions",
      "meta": "Purpose built modular environments",
      "badge": "Project",
      "price": "Quote on request"
    }
  ]$json$::jsonb
where slug = 'porta-cabins-site-offices';

update public.services
set
  highlights_title = 'Key highlights',
  highlights_description = 'Professional modular workplaces designed for flexible commercial and site use.',
  highlights = $json$[
    {
      "title": "Professional workplaces",
      "description": "Create focused office and meeting environments without committing to permanent build-out.",
      "icon": "home",
      "points": ["Meeting-ready rooms", "Clean finishes", "Quiet working zones"]
    },
    {
      "title": "Adaptable floor plans",
      "description": "Adjust layouts as teams, visitors and project phases change over time.",
      "icon": "layers",
      "points": ["Open or partitioned plans", "Expandable modules", "Reusable across sites"]
    },
    {
      "title": "Integrated services",
      "description": "Plan lighting, cooling, furniture and access around how the space will actually be used.",
      "icon": "wrench",
      "points": ["Utility coordination", "Comfort-focused fit-out", "Practical access routes"]
    }
  ]$json$::jsonb,
  case_studies_title = 'From concept to completion',
  case_studies_description = 'Modular office and meeting room setups shaped around day-to-day operations.',
  case_studies = $json$[
    {
      "title": "Modular Offices & Meeting Rooms",
      "imageUrl": "/images/projects/modular-offices-meeting-rooms.jpg",
      "imageAlt": "Modular offices and meeting rooms",
      "meta": "Flexible modular workplaces",
      "badge": "Capability",
      "price": "Quote on request"
    },
    {
      "title": "Customized Modular Solutions",
      "imageUrl": "/images/projects/customized-modular-solutions.jpg",
      "imageAlt": "Customized modular solutions",
      "meta": "Purpose built modular environments",
      "badge": "Project",
      "price": "Quote on request"
    },
    {
      "title": "Porta Cabins & Site Offices",
      "imageUrl": "/images/projects/porta-cabins-site-offices.jpg",
      "imageAlt": "Porta cabins and site offices",
      "meta": "Site ready portable facilities",
      "badge": "Capability",
      "price": "Quote on request"
    }
  ]$json$::jsonb
where slug = 'modular-offices-meeting-rooms';

update public.services
set
  highlights_title = 'Key highlights',
  highlights_description = 'Engineered shade structures for commercial, residential and industrial parking.',
  highlights = $json$[
    {
      "title": "Engineered shade",
      "description": "Design shade coverage around parking density, vehicle types and site constraints.",
      "icon": "award",
      "points": ["Span options", "Durable framing", "Weather-minded detailing"]
    },
    {
      "title": "Practical installation",
      "description": "Coordinate foundations, access and sequencing so parking areas stay usable during works.",
      "icon": "wrench",
      "points": ["Clear installation plan", "Minimal disruption", "Site-ready components"]
    },
    {
      "title": "Long-term value",
      "description": "Protect vehicles and improve comfort while keeping maintenance straightforward.",
      "icon": "check",
      "points": ["UV protection", "Low upkeep finishes", "Commercial and residential use"]
    }
  ]$json$::jsonb,
  case_studies_title = 'From concept to completion',
  case_studies_description = 'Shade and structure examples that support parking and outdoor coverage needs.',
  case_studies = $json$[
    {
      "title": "Car Parking Shades",
      "imageUrl": "/images/projects/car-parking-shades.jpg",
      "imageAlt": "Car parking shades",
      "meta": "Engineered shade structures",
      "badge": "Capability",
      "price": "Quote on request"
    },
    {
      "title": "Steel Structures & Fabrication",
      "imageUrl": "/images/projects/steel-structures-fabrication-works.jpg",
      "imageAlt": "Steel structures and fabrication",
      "meta": "Frames, sheds and platforms",
      "badge": "Capability",
      "price": "Quote on request"
    },
    {
      "title": "Custom Steel Fabrication",
      "imageUrl": "/images/projects/custom-steel-fabrication.jpg",
      "imageAlt": "Custom steel fabrication",
      "meta": "Made to order steel components",
      "badge": "Project",
      "price": "Quote on request"
    }
  ]$json$::jsonb
where slug = 'car-parking-shades';
