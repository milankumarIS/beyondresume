import {
  faBicycle,
  faBus,
  faCar,
  faCube,
  faTruckPickup,
} from "@fortawesome/free-solid-svg-icons";

const icons = {
  bike: faBicycle,
  bus: faBus,
  car: faCar,
  rickshaw: faTruckPickup,
  shipping: faCube,
};
const categoryArray = [
  {
    label: "Select",
    value: "",
  },
  {
    label: "category 1",
    value: "category 1",
  },
];

const subCategoryArray = [
  {
    label: "Select1",
    value: "",
  },
  {
    label: "category 1",
    value: "category 1",
  },
];

const priorityArray = [
  {
    label: "Low",
    value: "LOW",
  },
  {
    label: "Medium",
    value: "MEDIUM",
  },
  {
    label: "High",
    value: "HIGH",
  },
];

const workTypeArray = [
  {
    label: "Ongoing Applied Work",
    value: "OAW",
  },
  {
    label: "Ongoing Posted Work",
    value: "OPW",
  },
  {
    label: "Completd Applied Work",
    value: "CAW",
  },
  {
    label: "Completd Posted Work",
    value: "CPW",
  },
];

const genderArray = [
  {
    label: "Male",
    value: "MALE",
  },
  {
    label: "Female",
    value: "FEMALE",
  },
  {
    label: "Any",
    value: "ANY",
  },
  {
    label: "Other",
    value: "OTHER",
  },
];

const criticalityArray = [
  {
    label: "Low",
    value: "Low",
  },
  {
    label: "Moderate",
    value: "Moderate",
  },
  {
    label: "High",
    value: "High",
  },
  {
    label: "Critical",
    value: "Critical",
  },
];

const jobTypeArray = [
  {
    label: "Contractual",
    value: "CONTRACTUAL",
  },
  {
    label: "Permanent",
    value: "PERMANENT",
  },
];

const durationPeriodArray = ["SHORT", "MEDIUM", "LONG", "ADHOC"];

const jobType = [
  "Full-Time",
  "Part-Time",
  "Temporary",
  "Freelance",
  "Internship",
];

const jobMode = ["Hybrid", "Onsite", "Work From Home"];
const jobShift = ["Day", "Night", "Flexible"];

const payroll = ["Company Payroll", "3rd Party Payroll", "No Payroll"];

const addressType = ["Permanent", "Temporary"];

const contactStatusType = ["ACTIVE", "PASSIVE"];

const vehicleType = ["AUTO", "BIKE", "CAR", "PICKUP", "TRUCK"];

const healthEntityType = ["INDIVIDUAL", "CLINIC", "LAB", "HOSPITAL"];

const shippingFee = 40;

const platformFee = 5;

const userTypeArray = [
  {
    label: "Individual",
    value: "INDIVIDUAL",
  },
  {
    label: "Family",
    value: "FAMILY",
  },
  {
    label: "Community",
    value: "Community",
  },
];

const userSecurityType = [
  {
    label: "Change Password",
    value: "P",
  },
  {
    label: "Delete Account",
    value: "D",
  },
];

const userDeleteType = [
  {
    label:
      "Do you wantt to delete your account only (your account will be deactivated)",
    value: "DU",
  },
  {
    label:
      "Do you wantt to delete your account along with every data (your personal info will be deleted but your work history will be stored username will be there as masked data rest data will be deleted)",
    value: "DA",
  },
];

const vehicleCategories = [
  "LIGHT MOTOR VEHICLE",
  "HEAVY MOTOR VEHICLE",
  "Motorcycle Without Gear",
  "Motorcycle With Gear",
  "Light Motor Vehicle (Non-Transport)",
  "Light Motor Vehicle (Transport)",
  "Heavy Motor Vehicle",
  "Heavy Passenger Motor Vehicle",
  "Heavy Transport Vehicle",
  "Medium Goods Vehicle",
  "Medium Passenger Vehicle",
  "Electric Rickshaw",
];

const fuels = [
  "DIESEL",
  "PETROL",
  "CNG",
  "LPG",
  "ELECTRIC",
  "HYBRID",
  "BIO-DIESEL",
  "ETHANOL",
  "HYDROGEN",
];

const strokes = ["2 Stroke", "4 Stroke"];

const permitType = ["National Permit", "State Permit"];
const purposeofUse = ["Passenger Transport", "Goods Transport"];

const puc = ["Yes", "No"];

const buttons = [
  { label: "Driving Licence", url: "/mylicense" },
  { label: "National Id", url: "/national-id" },
  { label: "Pan Card", url: "/pan-card" },
];

const buttons1 = [
  { label: "Council License", url: "/council-certificate" },
  { label: "Professional Certificate", url: "/professional-certificate" },
];

const buttons2 = [
  { label: "Daily Ride", url: "/myRides" },
  { label: "Digital Stand", url: "/digitalStand" },
];

const buttons3 = [
  { label: "Prescription Reports", url: "/prescriptionReports" },
  { label: "Lab Reports", url: "/labReports" },
];

const units = ["Piece", "Plate", "Kg", "Gram", "Litre", "Ml", "Dozen"];
const productDisplayType = ["VEG", "NON-VEG"];

const categories = [
  "LIGHT MOTOR VEHICLE",
  "HEAVY MOTOR VEHICLE",
  "Motorcycle Without Gear",
  "Motorcycle With Gear",
  "Light Motor Vehicle (Non-Transport)",
  "Light Motor Vehicle (Transport)",
  "Heavy Motor Vehicle",
  "Heavy Passenger Motor Vehicle",
  "Heavy Transport Vehicle",
  "Medium Goods Vehicle",
  "Medium Passenger Vehicle",
  "Electric Rickshaw",
];

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const vehicleBodies = [
  "AUTO",
  "SUV",
  "HATCHBACK",
  "MUV",
  "TRUCK",
  "BUS",
  "VAN",
  "MOTORCYCLE",
  "TRAILER",
  "TANKER",
];

const orderFilter = [
  {
    label: "Last 30 Days",
    value: "30days",
  },
  {
    label: "Last 3 Months",
    value: "3months",
  },
  {
    label: "Older",
    value: "Older",
  },
  {
    label: "Cancelled",
    value: "CANCELLED",
  },
  {
    label: "Returned",
    value: "RETURNED",
  },
  {
    label: "Delivered",
    value: "DELIVERED",
  },
];

const foodType = [
  { label: "Indian" },
  { label: "Italian" },
  { label: "Fast Food" },
  { label: "South Indian" },
  { label: "Mexican" },
  { label: "Chinese" },
  { label: "Mediterranean" },
];

const BrandsList = [
  { label: "Brand 1" },
  { label: "Brand 2" },
  { label: "Brand 3" },
  { label: "Brand 4" },
  { label: "Brand 5" },
  { label: "Brand 6" },
  { label: "Brand 7" },
];

const storeType = ["INDIVIDUAL", "ORGANIZATION", "BRAND"];

const appointmentTypes = [
  "By Clinic",
  "By Hospital",
  "By Health Camp",
  "By Doctor",
];

const levels = [
  "Novice Explorer",
  "Curious Seeker",
  "Problem Pioneer",
  "Knowledge Scout",
  "Solution Architect",
  "Master Analyst",
  "Innovation Leader",
  "Wisdom Sage",
  "Knowledge Vanguard",
  "Academic Titan",
];

const genderArray1 = [
  { label: "Male", value: "1" },
  { label: "Female", value: "2" },
  { label: "Other", value: "3" },
];

const relations = [
  { label: "Father", value: "father" },
  { label: "Mother", value: "mother" },
  { label: "Guardian", value: "guardian" },
  { label: "Brother", value: "brother" },
  { label: "Sister", value: "sister" },
  { label: "Uncle", value: "uncle" },
  { label: "Aunt", value: "aunt" },
  { label: "Grandfather", value: "grandfather" },
  { label: "Grandmother", value: "grandmother" },
  { label: "Other", value: "other" },
];

const compCategory = [
  { label: "Junior", value: "JUNIOR" },
  { label: "Sub-Junior", value: "SUB-JUNIOR" },
  { label: "Senior", value: "SENIOR" },
];

const compSubject = [
  { label: "Drawing", value: "Drawing" },
  { label: "Quiz", value: "Quiz" },
  { label: "Creative Thinking", value: "Creative Thinking" },
];

const jobFunctions = [
  "Application Development",
  "Product Development",
  "Human Resources in IT",
  "Software Testing",
  "Network Administration",
  "Database Administration",
  "Cybersecurity",
  "Cloud Computing",
  "Data Analysis",
  "Data Science",
  "DevOps Engineering",
  "System Engineering",
  "Technical Support",
  "IT Project Management",
  "Business Intelligence",
  "Technical Writing",
  "UI/UX Design",
  "Software Architecture",
  "IT Consulting",
  "Infrastructure Management",
  "Network Security",
  "Mobile App Development",
  "Web Development",
  "ERP Implementation",
  "Software Maintenance",
  "AI & Machine Learning",
  "Blockchain Development",
  "Quality Assurance (QA)",
  "Systems Analysis",
  "Firmware Development",
  "Security Operations Center (SOC) Analyst",
  "Technical Sales",
  "IT Audit and Compliance",
  "Software Configuration Management",
  "Big Data Engineering",
  "Network Engineering",
  "Systems Integration",
  "Virtualization Engineering",
  "Technical Training & Development",
  "SaaS Operations",
  "CRM Development & Support",
  "Hardware Engineering",
  "Technical Account Management",
  "Data Warehouse Development",
  "Geographic Information Systems (GIS)",
  "IT Procurement & Vendor Management",
  "Technical Program Management",
  "Cloud Security",
  "Ethical Hacking/Penetration Testing",
  "Technical Recruiter",
  "Data Engineer",
  "Solutions Architect",
  "Security Analyst",
  "Automation Engineer",
  "Release Management",
  "IT Asset Management",
  "Disaster Recovery Planning",
  "Mainframe Operations",
  "Embedded Systems Development",
  "Network Design",
  "Compliance & Risk Management",
  "Technical Customer Support",
  "Technical Operations",
  "Software Licensing Management",
  "Data Governance",
  "Telecommunications Engineering",
  "Penetration Tester",
  "IT Strategy & Planning",
  "Software Development Lifecycle (SDLC) Management",
  "Performance Testing",
  "Technical Account Executive",
  "Cloud Infrastructure Engineer",
  "Data Privacy Officer",
  "Technical Business Analyst",
  "Software Deployment Engineer",
  "Middleware Support",
  "Technical Vendor Support",
  "IT Policy Development",
  "E-commerce Platform Development",
  "Augmented Reality (AR) & Virtual Reality (VR) Development",
  "User Support Specialist",
  "Computer Forensics",
  "Network Operations Center (NOC) Technician",
  "System Administrator",
  "Technical Solutions Engineer",
  "IoT (Internet of Things) Development",
  "Technical Product Manager",
  "Remote Infrastructure Support",
  "Software Localization & Internationalization",
  "SaaS Product Owner",
  "Technology Evangelist",
  "Software Licensing and Compliance",
  "Technical Data Analyst",
  "Cloud Migration Specialist",
  "Open Source Software Development",
  "Mobile Device Management (MDM)",
  "Technical Incident Response",
  "Augmented Reality (AR) Developer",
  "Technical Vendor Negotiator",
  "IT Service Management (ITSM) Specialist",
  "Software Packaging and Deployment",
  "Network Operations Engineer",
  "Data Center Operations",
  "Technical Account Manager",
  "Virtual Desktop Infrastructure (VDI) Specialist",
  "Augmented Reality Developer",
  "Software Development Manager",
  "IT Infrastructure Auditor",
  "Technical Sales Engineer",
  "Application Support Analyst",
  "Cloud Solutions Architect",
  "Network Operations Center (NOC) Manager",
  "Data Integration Specialist",
  "Automation Tester",
  "Data Visualization Specialist",
  "Technical Content Developer",
  "Security Software Developer",
  "Digital Transformation Consultant",
  "Cybersecurity Analyst",
  "Incident Response Coordinator",
  "Technical System Analyst",
  "Customer Success Manager (IT)",
  "Application Support Engineer",
  "Network Security Engineer",
  "Cloud Operations Engineer",
  "Data Quality Analyst",
  "Software Performance Tester",
  "Security Compliance Officer",
  "IoT Security Specialist",
  "Information Security Manager",
  "Data Governance Lead",
  "Technical Data Scientist",
  "Cloud Infrastructure Administrator",
  "Virtualization Support Engineer",
  "Cloud Cost Optimization Analyst",
  "Technical Account Director",
  "Network Risk Analyst",
  "Software Release Coordinator",
  "IT Service Desk Technician",
  "Systems Programmer",
  "Technical Solutions Consultant",
  "Data Migration Specialist",
  "Remote Support Technician",
  "Application Security Engineer",
  "Network Infrastructure Engineer",
  "Software Configuration Analyst",
  "Data Center Network Engineer",
  "Security Operations Analyst",
  "Software Quality Engineer",
  "Digital Forensics Analyst",
  "Systems Capacity Planner",
  "EDI (Electronic Data Interchange) Specialist",
  "Network Protocol Engineer",
  "Cloud Security Architect",
  "Technical Program Coordinator",
  "Software Product Owner",
  "IT Vendor Relationship Manager",
  "Network Troubleshooting Specialist",
  "Cloud Native Engineer",
  "Data Privacy Analyst",
  "Technical Documentation Specialist",
  "Software Licensing Analyst",
  "Hardware Support Technician",
  "Network Performance Engineer",
  "Cloud Backup & Recovery Specialist",
  "Data Analytics Engineer",
  "Application Performance Engineer",
  "Virtualization Infrastructure Engineer",
  "Technical Solutions Architect",
  "Network Compliance Analyst",
  "Quantum Computing Researcher",
  "Hardware Design Engineer",
  "Embedded Software Engineer",
  "Software Implementation Specialist",
  "IT Asset Disposition Specialist",
  "Data Pipeline Developer",
  "Technical Content Strategist",
  "Cloud Network Engineer",
  "Software Release Manager",
  "Security Incident Analyst",
  "Data Center Technician",
  "Technical Support Engineer",
  "Software Localization Engineer",
  "Network Security Auditor",
  "Cloud Operations Manager",
  "Systems Integration Engineer",
  "Penetration Testing Consultant",
  "IT Governance Specialist",
  "Software Development Coordinator",
  "Data Operations Manager",
  "Technical Customer Success Specialist",
  "Cloud Compliance Analyst",
  "Application Lifecycle Manager",
  "Network Automation Engineer",
  "IT Infrastructure Project Coordinator",
  "Data Security Analyst",
  "Cloud Adoption Strategist",
  "Software Development Lead",
  "Network Design Engineer",
  "Technical Solutions Sales Specialist",
  "Data Platform Engineer",
  "Software Deployment Specialist",
  "Cloud Data Engineer",
  "Technical Compliance Auditor",
  "Cybersecurity Governance Lead",
  "Software Test Automation Engineer",
  "Data Modeling Specialist",
  "IT Process Improvement Specialist",
  "Cloud Platform Engineer",
  "Application Performance Monitoring Engineer",
  "Network Operations Officer",
  "Technical Customer Engagement Manager",
  "Data Platform Architect",
  "Security Incident Response Lead",
  "Cloud Infrastructure Support Technician",
  "Software Quality Assurance Lead",
  "Network Security Manager",
  "Digital Workplace Specialist",
  "Data Privacy Engineer",
  "Cloud Migration Engineer",
  "Application Security Architect",
  "Technical Sales Support Specialist",
  "Data Storage Engineer",
  "Network Security Consultant",
  "Cloud Platform Support Engineer",
  "Software Configuration Manager",
  "Technical Training Specialist",
  "Data Engineering Lead",
  "Network Operations Supervisor",
  "IoT Solution Architect",
  "Cloud Security Engineer",
  "Application Monitoring Engineer",
  "Data Orchestration Engineer",
  "VPN & Remote Access Engineer",
  "Software Development Operations (DevOps) Lead",
  "Cloud Security Operations Center (SOC) Analyst",
  "Technical Product Owner",
  "Data Infrastructure Engineer",
  "Network Automation Developer",
  "Security Compliance Auditor",
  "Cloud Cost Management Analyst",
  "Systems Test Engineer",
  "Application Infrastructure Engineer",
  "Data Security Officer",
  "Network Capacity Planner",
  "Cloud Data Platform Developer",
  "Technical Support Manager",
  "Data Quality Engineer",
  "Network Forensics Specialist",
  "Cloud Security Policy Analyst",
  "Application Performance Tester",
  "IT Compliance Auditor",
  "Software Development Coach",
  "Network Protocol Analyst",
  "Cloud Infrastructure Security Engineer",
  "Data Governance Analyst",
  "Technical Customer Experience Designer",
  "Network Optimization Engineer",
  "Cloud Operations Analyst",
  "Application Security Tester",
  "Data Migration Engineer",
  "Network Security Engineer Lead",
  "Cloud Automation Engineer",
  "Software Deployment Manager",
  "Security Vulnerability Analyst",
  "Data Privacy Compliance Officer",
  "Network Monitoring Specialist",
  "Cloud Network Security Engineer",
  "Software Reliability Engineer",
  "DevSecOps Engineer",
  "Application Development Lead",
  "Data Warehouse Architect",
  "Network Security Operations Analyst",
  "Cloud Infrastructure Engineer II",
  "IT Service Delivery Manager",
  "Data Center Operations Manager",
  "Technical Product Evangelist",
  "Cloud Systems Engineer",
  "Application Optimization Engineer",
  "Network Security Compliance Analyst",
  "Data Analytics Manager",
  "Cloud Data Security Specialist",
  "Software Engineering Manager",
  "Software Engineering",
  "Technical Solutions Engineer II",
  "Data Integration Engineer",
  "Network Security Operations Lead",
  "Cloud Infrastructure Consultant",
  "Application Platform Engineer",
  "Data Privacy & Security Analyst",
  "Network Automation Architect",
  "Cloud Infrastructure Project Manager",
  "Software Release Engineer",
  "Security Architecture Engineer",
  "Data Engineering Manager",
  "Network Optimization Specialist",
  "Cloud Security Operations Specialist",
  "Application Security Lead",
  "Data Science Lead",
  "Network Engineering Manager",
  "Cloud Infrastructure Operations Lead",
  "Software Development Operations (DevOps) Engineer",
  "Data Platform Support Engineer",
  "Network Operations Technician",
  "Cloud Security Analyst",
  "Application Support Lead",
  "Data Governance Lead",
  "Network Security Threat Analyst",
  "Cloud Infrastructure Deployment Engineer",
  "Software Quality Assurance Tester",
  "Security Incident Handler",
  "Data Privacy & Compliance Engineer",
  "Network Troubleshooting Engineer",
  "Cloud Network Architect",
  "Application DevOps Engineer",
  "Data Management Specialist",
  "Internship",
  "IoT (Internet of Things) Development",
  "IoT Solution Architect",
  "MLOps Engineer",
];

const pricingPlans = [
  {
    title: "Free",
    description: "Get started with basic access to job posting or applying.",
    features: [
      { label: "1 Job Post / Month", highlight: true },
      { label: "2 Mock Interview / Month", highlight: true },
      { label: "Basic JD & Question Generator", highlight: true },
      { label: "Limited Analytics Access", highlight: false },
      { label: "No Voice Interview Access", highlight: false },
    ],
    prices: {
      "1month": 0,
      "3month": 0,
      "6month": 0,
      lifetime: 0,
    },
  },
  {
    title: "Starter",
    description:
      "Ideal for startups or individuals hiring or preparing for interviews.",
    features: [
      { label: "5 Job Posts / Month", highlight: true },
      { label: "5 Mock Interviews / Month", highlight: true },
      { label: "AI JD & Question Generator", highlight: true },
      { label: "Basic Analytics", highlight: true },
      { label: "Email Support", highlight: true },
    ],
    prices: {
      "1month": 499,
      "3month": 1299,
      "6month": 2299,
      lifetime: 3999,
    },
  },
  {
    title: "Growth",
    description:
      "For teams growing fast, hiring at scale or job seekers upskilling.",
    features: [
      { label: "20 Job Posts / Month", highlight: true },
      { label: "10 Mock Interviews / Month", highlight: true },
      { label: "Advanced Analytics & Scoring", highlight: true },
      { label: "5 Video Interviews / Month", highlight: true },
      { label: "Priority Email Support", highlight: true },
    ],
    prices: {
      "1month": 1499,
      "3month": 3999, // ~11% off
      "6month": 7299, // ~18% off
      lifetime: 10999, // ~39% off
    },
  },
  // {
  //   title: "Enterprise",
  //   price: 0,
  //   originalPrice: 0,
  //   period: "month",
  //   description: "Custom plan for high-volume hiring or career partners.",
  //   features: [
  //     { label: "Unlimited Job Posts & Interviews", highlight: true },
  //     { label: "Full Access to Analytics", highlight: true },
  //     { label: "Dedicated Account Manager", highlight: true },
  //     { label: "Team Member Access", highlight: true },
  //   ],
  //   zIndex: 3,
  // },
];

const experienceLevels = ["Fresher", "Junior", "Mid-Level", "Lead", "Director"];

const evaluationCategories = [
  "Technical Competence",
  "Cognitive Ability",
  "Communication & Collaboration",
  "Leadership & Initiative",
  "Cultural Fit & Integrity",
];

const JobSeekerScriptLines = [
  "Hey future superstar! I’m your Career Coach from Beyond Resume. Forget LinkedIn’s resume spam—we help you land roles by showing your skills, not just stating them. Ready for a job hunt that actually works? Let’s go!",
  "Say, ‘Find me remote marketing jobs,’ and boom! Our AI scans thousands of openings instantly. No more typing filters. See a match? Click ‘Apply’—and here’s where magic happens",
  "Option 1: Traditional written assessment.",
  "Option 2 (our favorite!): An AI-powered voice interview. Chat naturally for an hour—no cameras, no nerves. Our AI adapts to your answers, making it feel like practice with a mentor!",
  "Post-interview, get instant feedback: ‘Your Python skills shined, but practice cloud concepts—here’s a free module!’ Plus, use our ‘Fitment Analyzer’ to test your match for any job. Low fit? We’ll suggest skills to learn",
  "Try preloaded tests for top companies (yes, Google’s included!). Or build custom practice drills—like ‘5 data questions + 2 leadership scenarios.’ Nail weaknesses before the real deal!",
  "No more ‘apply and pray.’ We turn interviews into growth moments. Ready to stand out? Click ‘Find Jobs’ and use your voice—or test your fitment for that dream role right now. Your next career leap starts today!",
];

const TalentPartnerScriptLines = [
  "Welcome, visionary! I’m your AI Talent Guide from Beyond Resume. Tired of sifting through endless resumes on LinkedIn or Naukri? Let me show you how we revolutionize hiring—saving you time while finding perfect-fit candidates.",
  "Imagine describing a role in plain English—say, ‘Need a data scientist with Python and leadership skills’—and poof! Our AI crafts a full job description and tailored interview questions. Or upload your own. Either way, your job goes live in 30 seconds. No more template headaches!",
  "Here’s the game-changer: Candidates choose how they’re assessed. Traditional hour-long written tests? Or an interactive AI voice interview that feels like a live chat? You get the same rich insights either way. Watch as candidates solve real problems—not just polish resumes.",
  "See every applicant at a glance. Filter by ‘shortlisted,’ ‘rejected,’ or ‘needs review.’ Love a candidate? Shortlist them instantly. Best part? Grab a cumulative report—one PDF with every applicant’s skills, scores, and interview highlights. No more juggling spreadsheets!",
  "Picture this: 70% less screening time, 50% deeper candidate insights, and zero ‘resume fluff.’ Our AI even flags hidden gems you might miss. Ready to hire smarter, not harder? Click ‘Post a Job’ now—or explore your dashboard. Let’s build your dream team together!",
];

// statusConfig.ts
const STATUS_CONFIG = [
  { label: "SUGGESTED", color: "#16a34a" },
  { label: "APPLIED", color: "#14b8a6" },
  { label: "PENDING ASSESSMENT", color: "#f97316" },
  { label: "ASSESSED", color: "#16a34a" },

  { label: "CONTACTED", color: "#06b6d4" },
  { label: "SHORTLISTED", color: "#0f766e" },
  { label: "INTERVIEW SCHEDULED", color: "#0284c7" },
  { label: "WAITLISTED", color: "#86efac" },
  { label: "REJECTED", color: "#f87171" },
  { label: "FINAL ROUND", color: "#4ade80" },
  { label: "OFFER SENT", color: "#facc15" },
  { label: "OFFER ACCEPTED", color: "#65a30d" },
  { label: "OFFER DECLINED", color: "#fda4af" },
  { label: "JOINED", color: "#166534" },
  { label: "NOT JOINED", color: "#b45309" },
  // { label: "Emerging Talent", color: "#93c5fd" },
  // { label: "Proven Performer", color: "#60a5fa" },
  // { label: "Seasoned Professional", color: "#2563eb" },
  // { label: "Elite Specialist", color: "#1e3a8a" },
];

export {
  addressType,
  STATUS_CONFIG,
  appointmentTypes,
  BrandsList,
  buttons,
  buttons1,
  buttons2,
  buttons3,
  categories,
  categoryArray,
  compCategory,
  compSubject,
  contactStatusType,
  criticalityArray,
  durationPeriodArray,
  evaluationCategories,
  experienceLevels,
  foodType,
  fuels,
  genderArray,
  genderArray1,
  healthEntityType,
  jobFunctions,
  jobMode,
  jobShift,
  jobType,
  jobTypeArray,
  levels,
  orderFilter,
  payroll,
  permitType,
  platformFee,
  pricingPlans,
  priorityArray,
  productDisplayType,
  puc,
  purposeofUse,
  relations,
  shippingFee,
  storeType,
  strokes,
  subCategoryArray,
  units,
  userDeleteType,
  userSecurityType,
  userTypeArray,
  vehicleBodies,
  vehicleCategories,
  vehicleType,
  weekDays,
  workTypeArray,
  JobSeekerScriptLines,
  TalentPartnerScriptLines,
};
