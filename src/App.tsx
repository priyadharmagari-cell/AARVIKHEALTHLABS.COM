/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, FormEvent, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { jsPDF } from "jspdf";
import { 
  Activity, 
  Beaker, 
  ChevronLeft,
  ChevronRight,
  ChevronDown, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Stethoscope, 
  TestTube,
  ShoppingCart,
  Search,
  CheckCircle2,
  X,
  CreditCard,
  Smartphone,
  MessageCircle,
  Wallet,
  Home,
  Scan,
  TrendingDown,
  Info,
  HeartPulse,
  Wind,
  Zap,
  Droplets,
  ShieldAlert,
  BrainCircuit,
  Microscope,
  Syringe,
  Lock,
  Binary,
  Download,
  Dna,
  Skull,
  Thermometer,
  FlaskConical,
  Copy,
  Plus,
  Sun,
  Moon,
  ArrowRight,
  QrCode,
  MessageSquare,
  Baby,
  Target,
  User,
  LogIn
} from "lucide-react";
import { Logo } from "./components/Logo";

interface Test {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: "Blood" | "Radiology" | "Wellness";
  department: string;
  details: string;
}

const getTestDetails = (test: Test) => {
  const nameLower = test.name.toLowerCase();
  
  // Default values
  let fasting = "Fasting Optional (Can be done anytime)";
  let sample = "Blood (Serum)";
  let tat = "Reports TAT 8 Hrs";
  let parameters: string[] = ["Primary pathology investigation metrics"];
  
  if (test.category === "Radiology") {
    fasting = "Prior Appointment Highly Recommended";
    sample = "In-Clinic Ultrasound Scan";
    tat = "2 Hours (Instant Digital Reporting)";
    parameters = ["High-resolution scanning visualization", "Detailed expert clinical audit review"];
  } else if (test.category === "Wellness") {
    fasting = "10 to 12 Hours fasting is mandatory";
    sample = "Blood (Serum) + Urine Spot";
    tat = "Same day electronic dispatch (TAT 8 Hours)";
    parameters = [
      "Full Hemogram (CBC + ESR check)",
      "Standard Liver Function profiles",
      "Essential Kidney assessment markers",
      "Lipid Cholesterol spectrum",
      "Basic Thyroid Screen (TSH Level)",
      "Screening Urinalysis indicators"
    ];
  }

  // Fasting requirements based on test name
  if (nameLower.includes("sugar") || nameLower.includes("glucose") || nameLower.includes("lipid") || nameLower.includes("fasting") || nameLower.includes("gtt")) {
    fasting = "Strict 10-12 Hours fasting (Water permitted)";
  } else if (nameLower.includes("urine") || nameLower.includes("cue")) {
    fasting = "No fasting constraints (Mid-stream urine preferred)";
    sample = "Spot Urine Sample";
  } else if (nameLower.includes("stool")) {
    fasting = "No fasting constraints";
    sample = "Stool Specimen";
  }

  // Parameters list mapping for realism and elite presentation
  if (nameLower.includes("cbc") || nameLower.includes("complete blood count")) {
    parameters = [
      "Hemoglobin (Hb percentage)",
      "Total Red Blood Cells (RBC count)",
      "Leukocytes (Total WBC count)",
      "Thrombocytes (Platelet estimation)",
      "Packed Cell Volume (PCV / Hematocrit)",
      "Mean Corpuscular Volume (MCV / MCH)",
      "Differential Leukocyte Count (DLC)"
    ];
    sample = "EDTA Whole Blood Sample";
  } else if (nameLower.includes("liver") || nameLower.includes("lft")) {
    parameters = [
      "Bilirubin Total (Jaundice evaluation)",
      "Bilirubin Direct & Indirect fractions",
      "SGOT / AST (Liver enzyme evaluation)",
      "SGPT / ALT (Liver cellular damage status)",
      "Alkaline Phosphatase (Biliary status)",
      "Serum Albumin & Globulin metrics",
      "Albumin / Globulin (A/G Ratio)"
    ];
  } else if (nameLower.includes("kidney") || nameLower.includes("kft") || nameLower.includes("renal")) {
    parameters = [
      "Serum Creatinine (Glomerular filtration)",
      "Blood Urea Nitrogen (BUN indicator)",
      "Serum Uric Acid level",
      "Urea Concentration",
      "BUN / Creatinine Ratio calculation",
      "Serum Calcium",
      "Serum Phosphorus"
    ];
  } else if (nameLower.includes("lipid")) {
    parameters = [
      "Total Blood Cholesterol",
      "Triglycerides level",
      "High Density Lipoprotein (HDL - Good)",
      "Low Density Lipoprotein (LDL - Bad)",
      "Very Low Density Lipoprotein (VLDL)",
      "CHOL / HDL risk calculation ratio"
    ];
  } else if (nameLower.includes("sugar") || nameLower.includes("hba1c") || nameLower.includes("glucose")) {
    parameters = [
      "Fasting Plasma Glucose (FPG)",
      "Post-Prandial Blood Glucose (optional)",
      "Average Glycosylated Hemoglobin (HbA1c)",
      "Estimated Average Glucose (eAG)"
    ];
  } else if (nameLower.includes("thyroid")) {
    parameters = [
      "Triiodothyronine (Serum Total T3)",
      "Thyroxine (Serum Total T4)",
      "Thyroid Stimulating Hormone (Ultra TSH)"
    ];
    sample = "Serum Venous Blood";
  } else if (nameLower.includes("vitamin d")) {
    parameters = [
      "25-Hydroxy Vitamin D3 estimation",
      "Primary calcium absorption metabolic tracking"
    ];
  } else if (nameLower.includes("vitamin b12")) {
    parameters = [
      "Serum Cyanocobalamin B12 estimation",
      "Active neurological vitamin reserve indicator"
    ];
  } else if (nameLower.includes("crp") || nameLower.includes("c-reactive")) {
    parameters = [
      "C-Reactive Protein (Quantitative titer)",
      "Systemic acute phase inflammatory evaluation"
    ];
  } else if (nameLower.includes("urine")) {
    parameters = [
      "Physical traits (Color, Specific Gravity, pH)",
      "Chemical features (Sugar, Albumin levels)",
      "Microscopic analysis (Pus Cells, Epithelial Cells)",
      "Crystals, Casts, Bacteria estimation"
    ];
  }

  return { fasting, sample, tat, parameters };
};

const TESTS: Test[] = [
  // --- BLOOD TESTS: HEMATOLOGY ---
  { id: "b1", name: "Complete Blood Picture (CBP / CBC)", price: 250, category: "Blood", department: "Hematology", details: "Analyzes RBC, WBC, Hemoglobin and Platelets." },
  { id: "b2", name: "ESR (Erythrocyte Sedimentation Rate)", price: 200, category: "Blood", department: "Hematology", details: "Detects non-specific inflammation in the body." },
  { id: "b3", name: "Peripheral Smear Study", price: 500, category: "Blood", department: "Hematology", details: "Detailed microscopic exam of blood cell morphology." },
  
  // --- BLOOD TESTS: BIOCHEMISTRY ---
  { id: "b4", name: "Liver Function Test (LFT)", price: 500, category: "Blood", department: "Biochemistry", details: "Measures proteins, enzymes, and bilirubin levels." },
  { id: "b5", name: "Kidney Function Test (KFT)", price: 800, category: "Blood", department: "Biochemistry", details: "Evaluates urea, creatinine, and uric acid status." },
  { id: "b6", name: "Lipid Profile (Full)", price: 500, category: "Blood", department: "Biochemistry", details: "Cholesterol, Triglycerides, HDL, LDL, VLDL & Ratios." },
  { id: "b7", name: "Blood Sugar (Fast & PP)", price: 250, category: "Blood", department: "Biochemistry", details: "Essential screening for diabetes monitoring." },
  { id: "b8", name: "HbA1c (Glycosylated Hemoglobin)", price: 450, category: "Blood", department: "Biochemistry", details: "Shows average blood sugar over last 3 months." },
  { id: "b13", name: "Serum Uric Acid", price: 350, category: "Blood", department: "Biochemistry", details: "Screening for Gout and kidney stone risk." },
  { id: "b14", name: "Serum Calcium", price: 400, category: "Blood", department: "Biochemistry", details: "Essential for bone health and nerve monitoring." },
  { id: "b15", name: "Serum Electrolytes (Na, K, Cl)", price: 750, category: "Blood", department: "Biochemistry", details: "Measures vital mineral balance in the body." },
  { id: "b16", name: "Serum Amylase", price: 800, category: "Blood", department: "Biochemistry", details: "Screening for pancreatic health and disorders." },
  { id: "b17", name: "Serum Lipase", price: 900, category: "Blood", department: "Biochemistry", details: "Specific marker for pancreatic inflammation." },
  { id: "b18", name: "Alkaline Phosphatase (ALP)", price: 450, category: "Blood", department: "Biochemistry", details: "Evaluates liver and bone metabolism." },
  { id: "b19", name: "Serum Bilirubin (Total, D & I)", price: 500, category: "Blood", department: "Biochemistry", details: "Checks for jaundice and liver bile flow." },
  { id: "b20", name: "Gamma GT (GGT)", price: 650, category: "Blood", department: "Biochemistry", details: "Sensitive marker for liver and bile duct injury." },
  { id: "b21", name: "Serum LDH", price: 700, category: "Blood", department: "Biochemistry", details: "Indicator of tissue damage and cell turnover." },
  { id: "b22", name: "Serum Phosphorus", price: 400, category: "Blood", department: "Biochemistry", details: "Measures phosphorus levels for bone and kidney health." },

  // --- BLOOD TESTS: SEROLOGY & IMMUNOLOGY ---
  { id: "b9", name: "Thyroid Profile (T3, T4, TSH)", price: 450, category: "Blood", department: "Serology", details: "Comprehensive screening for thyroid disorders." },
  { id: "b10", name: "Vitamin D (25-OH)", price: 800, category: "Blood", department: "Serology", details: "Measures Vitamin D levels for bone and immune health." },
  { id: "b11", name: "Vitamin B12 (Cyanocobalamin)", price: 800, category: "Blood", department: "Serology", details: "Analyzes levels for nerve and blood function." },
  { id: "b12", name: "CRP (C-Reactive Protein)", price: 600, category: "Blood", department: "Serology", details: "Detects acute infection or inflammatory conditions." },

  // --- BLOOD TESTS: MICROBIOLOGY & PATHOLOGY ---
  { id: "p1", name: "Urine Routine & Microscopic", price: 250, category: "Blood", department: "Pathology", details: "Analyzes urine for infection, sugar and protein." },
  { id: "p2", name: "Stool Routine", price: 300, category: "Blood", department: "Pathology", details: "Checks for digestive health and parasitic load." },
  { id: "p3", name: "Urine Culture & Sensitivity", price: 800, category: "Blood", department: "Microbiology", details: "Identifies bacteria and elective antibiotics." },
  { id: "p4", name: "Blood Culture (Bactec)", price: 1500, category: "Blood", department: "Microbiology", details: "Advanced screening for blood stream infections." },
  { id: "p5", name: "Sputum for AFB", price: 400, category: "Blood", department: "Microbiology", details: "Screening for Tuberculosis and lung infections." },
  { id: "p6", name: "Sputum Culture & Sensitivity", price: 850, category: "Blood", department: "Microbiology", details: "Identifies respiratory pathogens and antibiotics." },
  { id: "p7", name: "Sputum for Gram Stain", price: 350, category: "Blood", department: "Microbiology", details: "Microscopic exam for bacterial classification." },
  { id: "p8", name: "Sputum for Cytology", price: 900, category: "Blood", department: "Pathology", details: "Checks for abnormal or cancerous cells in sputum." },
  { id: "p9", name: "Sputum GeneXpert MTBRIF", price: 2500, category: "Blood", department: "Microbiology", details: "Rapid molecular test for TB and drug resistance." },
  { id: "p10", name: "Sputum for Fungal Stain (KOH)", price: 450, category: "Blood", department: "Microbiology", details: "Detects fungal elements in respiratory samples." },

  // --- RADIOLOGY: X-RAY ---
  { id: "r1", name: "Chest X-Ray (PA View)", price: 450, category: "Radiology", department: "X-Ray", details: "Basic screening for lungs and heart structure." },
  { id: "r2", name: "X-Ray C-Spine (AP/Lat)", price: 800, category: "Radiology", department: "X-Ray", details: "Imaging for cervical spine issues/neck pain." },
  { id: "r3", name: "X-Ray Knee Joint (Lat)", price: 600, category: "Radiology", department: "X-Ray", details: "Imaging for bone and joint injuries." },
  { id: "r11", name: "X-Ray LS Spine (AP/Lat)", price: 900, category: "Radiology", department: "X-Ray", details: "Scans lower back for disc or bone issues." },
  { id: "r12", name: "X-Ray PNS (Water's View)", price: 500, category: "Radiology", department: "X-Ray", details: "Dedicated imaging for sinus infections." },
  { id: "rx1", name: "X-Ray Skull (AP/Lat)", price: 750, category: "Radiology", department: "X-Ray", details: "Imaging for cranial bone and head injuries." },
  { id: "rx2", name: "X-Ray Shoulder Joint (AP/Axial)", price: 650, category: "Radiology", department: "X-Ray", details: "Visualizes the humerus and glenoid cavity." },
  { id: "rx3", name: "X-Ray Hip Joint (AP/Lat)", price: 850, category: "Radiology", department: "X-Ray", details: "Assesses the ball and socket joint of the hip." },
  { id: "rx4", name: "X-Ray Ankle Joint (AP/Lat)", price: 550, category: "Radiology", department: "X-Ray", details: "Commonly used for spotting fractures or sprains." },
  { id: "rx5", name: "X-Ray Foot (AP/Oblique)", price: 500, category: "Radiology", department: "X-Ray", details: "Examines the small bones of the foot." },

  // --- RADIOLOGY: ULTRASOUND (USG) ---
  { id: "r4", name: "USG Whole Abdomen", price: 1500, category: "Radiology", department: "Ultrasound", details: "Scans liver, gallbladder, kidneys, and spleen." },
  { id: "r5", name: "USG Pelvis (Female)", price: 1200, category: "Radiology", department: "Ultrasound", details: "Checks uterus, ovaries, and bladder health." },
  { id: "r6", name: "USG Follicular Study", price: 2500, category: "Radiology", department: "Ultrasound", details: "Serial scanning for pregnancy planning." },
  { id: "r13", name: "USG KUB", price: 1100, category: "Radiology", department: "Ultrasound", details: "Specific scan for Kidneys, Ureter and Bladder." },
  { id: "r14", name: "USG Pregnancy (NT Scan)", price: 2800, category: "Radiology", department: "Ultrasound", details: "First trimester screening for chromosomal health." },
  { id: "r15", name: "USG Anomaly Scan (TIFFA)", price: 4500, category: "Radiology", department: "Ultrasound", details: "Detailed 2nd trimester fetal anatomy survey." },
  { id: "r16", name: "USG Scrotum / Doppler", price: 2200, category: "Radiology", department: "Ultrasound", details: "Analyzes soft tissue and blood flow." },
  { id: "ru1", name: "USG Breast (Bilateral)", price: 2500, category: "Radiology", department: "Ultrasound", details: "Screening for lumps or cysts in breast tissue." },
  { id: "ru2", name: "USG Thyroid / Neck", price: 1800, category: "Radiology", department: "Ultrasound", details: "Evaluates thyroid nodules and neck glands." },
  { id: "ru3", name: "USG Level 2 / Growth Scan", price: 3200, category: "Radiology", department: "Ultrasound", details: "Third trimester fetal growth monitoring." },
  { id: "ru4", name: "USG TVS (Transvaginal)", price: 1800, category: "Radiology", department: "Ultrasound", details: "Internal scan for detailed uterine assessment." },
  { id: "ru5", name: "USG Obstetric (Early/Routine Pregnancy)", price: 1300, category: "Radiology", department: "Ultrasound", details: "Essential screening for early fetal status, gestational age and heartbeat." },
  { id: "ru6", name: "USG Renal Doppler", price: 3200, category: "Radiology", department: "Ultrasound", details: "Analyzes blood flow to the kidneys and renal arteries." },
  { id: "ru7", name: "USG Soft Tissue Swelling Scan", price: 1500, category: "Radiology", department: "Ultrasound", details: "High-resolution scan for muscle, tendon, or general swelling assessment." },
  { id: "ru8", name: "USG Carotid Doppler (Bilateral)", price: 3000, category: "Radiology", department: "Ultrasound", details: "Measures blood flow through carotid arteries to assess stroke risks." },

  // --- RADIOLOGY: CT & MRI ---
  { id: "r7", name: "CT Brain (Plain)", price: 3500, category: "Radiology", department: "CT Scan", details: "Rapid imaging for brain structure and trauma." },
  { id: "r8", name: "CT Chest (HRCT)", price: 5500, category: "Radiology", department: "CT Scan", details: "Highly detailed lung structure analysis." },
  { id: "r17", name: "CT Abdomen & Pelvis", price: 7500, category: "Radiology", department: "CT Scan", details: "Comprehensive scan of all internal organs." },
  { id: "rc1", name: "CT KUB (Non-Contrast)", price: 4500, category: "Radiology", department: "CT Scan", details: "Gold standard for detecting kidney stones." },
  { id: "rc2", name: "CT PNS (Coronal/Axial)", price: 3800, category: "Radiology", department: "CT Scan", details: "Detailed mapping of the paranasal sinuses." },
  { id: "rc3", name: "CT Spine LS (Plain)", price: 5000, category: "Radiology", department: "CT Scan", details: "Cross-sectional view of the lumbar spine." },
  { id: "rc4", name: "CT Whole Abdomen (Contrast)", price: 10500, category: "Radiology", department: "CT Scan", details: "Advanced imaging for vascular or tumor study." },
  { id: "r9", name: "MRI Brain (Plain)", price: 6500, category: "Radiology", department: "MRI", details: "Advanced neuro-imaging for soft tissues." },
  { id: "r10", name: "MRI Lumbar Spine", price: 6000, category: "Radiology", department: "MRI", details: "Detailed view of spinal discs and nerves." },
  { id: "r18", name: "MRI Knee Joint", price: 6500, category: "Radiology", department: "MRI", details: "High-resolution imaging for ligament/meniscus tears." },
  { id: "r19", name: "MRI Cervical Spine", price: 6000, category: "Radiology", department: "MRI", details: "Detailed imaging for neck and upper spine." },
  { id: "rm1", name: "MRI Whole Spine (Screening)", price: 12500, category: "Radiology", department: "MRI", details: "Scans entire vertebral column for anomalies." },
  { id: "rm2", name: "MRI Shoulder Joint", price: 6800, category: "Radiology", department: "MRI", details: "High-resolution view for rotator cuff tears." },
  { id: "rm3", name: "MRI Brain + Contrast", price: 9500, category: "Radiology", department: "MRI", details: "Detailed study for tumors or infections." },
  { id: "rm4", name: "MRI Pelvis", price: 7200, category: "Radiology", department: "MRI", details: "Detailed imaging for pelvic organs and joints." },
  { id: "rm5", name: "MRI Hip Joint (Bilateral)", price: 7500, category: "Radiology", department: "MRI", details: "Detailed study of hip joints for avascular necrosis, injury or arthritis." },
  { id: "rm6", name: "MRI Spine Thoracic (Dorsal)", price: 6000, category: "Radiology", department: "MRI", details: "Advanced scan for dorsal/thoracic spinal cord and vertebrae." },
  { id: "rm7", name: "MRI Ankle Joint (Single Joint)", price: 6500, category: "Radiology", department: "MRI", details: "Visualizes ligaments, tendons, and cartilage around ankle." },
  { id: "rm8", name: "MRI Abdomen with MRCP", price: 8500, category: "Radiology", department: "MRI", details: "Specialized non-invasive scan of the biliary and pancreatic ducts." },
  { id: "rc5", name: "CT Brain with Contrast", price: 4800, category: "Radiology", department: "CT Scan", details: "Contrast enhanced scan to target lesions, tumors or vascular issues." },
  { id: "rc6", name: "CT Upper Abdomen (Plain)", price: 4200, category: "Radiology", department: "CT Scan", details: "High accuracy cross-sectional imaging for upper abdominal organs." },
  { id: "rc7", name: "CT Neck / Cervical Spine", price: 5000, category: "Radiology", department: "CT Scan", details: "Comprehensive cross-sectional study of neck tissues and cervical spine." },

  // --- RADIOLOGY: CARDIAC ---
  { id: "c1", name: "ECG (12 Lead)", price: 400, category: "Radiology", department: "Cardiology", details: "Measures heart rhythm and electrical activity." },
  { id: "c2", name: "2D Echo with Doppler", price: 2500, category: "Radiology", department: "Cardiology", details: "Live ultrasound of heart valves and chambers." },
  { id: "c3", name: "TMT (Stress Test)", price: 1800, category: "Radiology", department: "Cardiology", details: "Evaluates heart performance during exercise." },

  // --- BLOOD TESTS: IMMUNOLOGY & ANTIBODIES ---
  { id: "a1", name: "ANA (Antinuclear Antibody)", price: 1200, category: "Blood", department: "Immunology", details: "Screening for systemic autoimmune disorders." },
  { id: "a2", name: "Dengue IgG & IgM Antibody", price: 900, category: "Blood", department: "Immunology", details: "Detects current or past dengue infection." },
  { id: "a3", name: "Typhodot (IgG & IgM)", price: 750, category: "Blood", department: "Immunology", details: "Rapid screening for Typhoid fever antibodies." },
  { id: "a4", name: "COVID-19 IgG Antibody (Total)", price: 1100, category: "Blood", department: "Immunology", details: "Measures immunity/exposure to SARS-CoV-2." },
  { id: "a5", name: "HIV 1 & 2 Antibody Screen", price: 800, category: "Blood", department: "Immunology", details: "Confidential screening for viral antibodies." },
  { id: "a6", name: "Anti-HCV (Hepatitis C)", price: 1000, category: "Blood", department: "Immunology", details: "Detects antibodies against Hepatitis C virus." },
  { id: "a7", name: "HBsAb (Anti-HBs)", price: 850, category: "Blood", department: "Immunology", details: "Checks for Hepatitis B immunity/vaccine status." },
  { id: "a8", name: "RA Factor (Rheumatoid Arthritis)", price: 700, category: "Blood", department: "Immunology", details: "Marker for rheumatoid arthritis and inflammation." },
  { id: "a9", name: "Torch Profile (IgG&IgM)", price: 4500, category: "Blood", department: "Immunology", details: "8 markers for Toxoplasma, Rubella, CMV & Herpes." },

  // --- GENERAL PHYSICIAN (GP) TESTS ---
  { id: "gp1", name: "Blood Grouping & Rh Type", price: 300, category: "Blood", department: "General Physician", details: "Determines blood type (A, B, AB, O) and Rh factor." },
  { id: "gp2", name: "Widal Test (Slide)", price: 350, category: "Blood", department: "General Physician", details: "Screening for Salmonella typhi (Typhoid fever)." },
  { id: "gp3", name: "Mantoux Test (10 TU)", price: 600, category: "Blood", department: "General Physician", details: "Skin test for diagnostic screening of Tuberculosis." },
  { id: "gp4", name: "H. Pylori Antibody", price: 900, category: "Blood", department: "General Physician", details: "Detects evidence of H. Pylori infection (gastritis)." },
  { id: "gp5", name: "Stool for Occult Blood", price: 400, category: "Blood", department: "General Physician", details: "Screening for gastrointestinal bleeding." },
  { id: "gp6", name: "Pregnancy Test (Urine/Urine hCG)", price: 250, category: "Blood", department: "General Physician", details: "Rapid screening for pregnancy via urine sample." },
  { id: "gp7", name: "Widal (Tube Method)", price: 650, category: "Blood", department: "General Physician", details: "Quantitative test for enterica fever diagnosis." },
  { id: "gp8", name: "Blood Culture & Sensitivity", price: 1500, category: "Blood", department: "General Physician", details: "Gold standard for identifying systemic infections." },
  { id: "gp9", name: "Triple Marker Screen", price: 3500, category: "Blood", department: "General Physician", details: "Prenatal screening for genetic health." },
  { id: "gp10", name: "Anti-ccp (Cyclic Citrullinated Peptide)", price: 2200, category: "Blood", department: "General Physician", details: "Specific test for early Rheumatoid Arthritis." },

  // --- ORTHO DEPARTMENT TESTS ---
  { id: "o1", name: "HLA-B27 (DNA Based)", price: 3500, category: "Blood", department: "Ortho", details: "Genetic marker for Ankylosing Spondylitis and related disorders." },
  { id: "o2", name: "Bone Mineral Density (DEXA) - Hip/Spine", price: 2500, category: "Radiology", department: "Ortho", details: "Gold standard test for measuring bone strength." },
  { id: "o3", name: "Synovial Fluid Analysis", price: 1500, category: "Blood", department: "Ortho", details: "Joint fluid exam to diagnose gout, arthritis, or infection." },
  { id: "o4", name: "Bone Profile (Extended)", price: 1800, category: "Blood", department: "Ortho", details: "Includes Calcium, Phosphorus, ALP and Total Protein." },
  { id: "o5", name: "Vitamin D (Ultra Sensitive)", price: 2200, category: "Blood", department: "Ortho", details: "Highly accurate monitoring for severe bone deficiencies." },
  { id: "o6", name: "DEXA Whole Body", price: 4500, category: "Radiology", department: "Ortho", details: "Measures total bone density and body fat percentage." },

  // --- PULMONOLOGIST DEPARTMENT TESTS ---
  { id: "pu1", name: "PFT (Spirometry) - Gold Standard", price: 1500, category: "Radiology", department: "Pulmonology", details: "Measures lung capacity and airflow to diagnose asthma/COPD." },
  { id: "pu2", name: "DLCO (Diffusion Capacity Test)", price: 2500, category: "Radiology", department: "Pulmonology", details: "Measures how well lungs transfer gas from air to blood." },
  { id: "pu3", name: "Sleep Study (Level 1 Polysomnography)", price: 8500, category: "Radiology", department: "Pulmonology", details: "Comprehensive overnight study for Obstructive Sleep Apnea." },
  { id: "pu4", name: "Exhaled Nitric Oxide (FeNO)", price: 3500, category: "Blood", department: "Pulmonology", details: "Marker for allergic airway inflammation and asthma control." },
  { id: "pu5", name: "Lung Volume & Airway Resistance", price: 2800, category: "Radiology", department: "Pulmonology", details: "Determines total lung capacity via body plethysmography." },
  { id: "pu6", name: "Home Sleep Test (Level 3)", price: 3000, category: "Radiology", department: "Pulmonology", details: "Simplified screening for snoring and sleep disorders at home." },
  { id: "pu7", name: "6-Minute Walk Test (6MWT)", price: 1200, category: "Radiology", department: "Pulmonology", details: "Functional assessment for cardiac and respiratory endurance." },

  // --- GASTROENTEROLOGY DEPARTMENT TESTS ---
  { id: "g1", name: "Upper GI Endoscopy (Gastroscopy)", price: 4500, category: "Radiology", department: "Gastrology", details: "Visual exam of esophagus, stomach, and duodenum." },
  { id: "g2", name: "Colonoscopy (Full)", price: 8500, category: "Radiology", department: "Gastrology", details: "Complete endoscopic exam of the large intestine." },
  { id: "g3", name: "Liver Fibroscan", price: 3500, category: "Radiology", department: "Gastrology", details: "Non-invasive assessment of liver scarring and fat." },
  { id: "g4", name: "H. Pylori Urea Breath Test (UBT)", price: 2500, category: "Blood", department: "Gastrology", details: "Gold standard test for active H. pylori infection." },
  { id: "g5", name: "Faecal Calprotectin", price: 3000, category: "Blood", department: "Gastrology", details: "Marker for Inflammatory Bowel Disease (IBD)." },
  { id: "g6", name: "Celiac Profile (tTG-IgA)", price: 2200, category: "Blood", department: "Gastrology", details: "Screening for gluten sensitivity and celiac disease." },
  { id: "g7", name: "Gastric Panel (Gastrin/Pepsinogen)", price: 4000, category: "Blood", department: "Gastrology", details: "Comprehensive blood test for stomach health." },
  { id: "g8", name: "Breath Test for Carbohydrate Intolerance", price: 2800, category: "Blood", department: "Gastrology", details: "Detects Lactose or Fructose malabsorption." },

  // --- GYNAECOLOGY & FERTILITY TESTS ---
  { id: "f1", name: "AMH (Anti-Mullerian Hormone)", price: 2500, category: "Blood", department: "Fertility", details: "Ovarian reserve marker for fertility potential." },
  { id: "f2", name: "FSH / LH / Prolactin Panel", price: 1800, category: "Blood", department: "Fertility", details: "Comprehensive hormonal check for ovulation issues." },
  { id: "f3", name: "Semen Analysis (Computerized)", price: 800, category: "Blood", department: "Fertility", details: "Advanced sperm count and motility assessment." },
  { id: "f4", name: "Pap Smear (LBC Method)", price: 1500, category: "Blood", department: "Gynaecology", details: "Cervical cancer screening with high accuracy." },
  { id: "f5", name: "HVS (High Vaginal Swab) Culture", price: 900, category: "Blood", department: "Gynaecology", details: "Identifies infections and provides sensitivity report." },
  { id: "f6", name: "CA-125 (Ovarian Marker)", price: 1200, category: "Blood", department: "Gynaecology", details: "Tumor marker for ovarian health monitoring." },
  { id: "f7", name: "Beta hCG (Quantitative)", price: 1000, category: "Blood", department: "Gynaecology", details: "Highly accurate pregnancy confirmation and tracking." },
  { id: "f8", name: "PCOS Profile (Mini)", price: 3500, category: "Blood", department: "Fertility", details: "Includes Insulin, Testosterone, and Glucose DUS." },
 
  // --- ONCOLOGY DEPARTMENT TESTS ---
  { id: "on1", name: "PSA (Prostate Specific Antigen)", price: 1200, category: "Blood", department: "Oncolgy", details: "Screening and monitoring for prostate health in men." },
  { id: "on2", name: "CEA (Carcinoembryonic Antigen)", price: 1500, category: "Blood", department: "Oncology", details: "General tumor marker for colon and lung cancers." },
  { id: "on3", name: "AFP (Alpha-Fetoprotein)", price: 1400, category: "Blood", department: "Oncology", details: "Marker for liver and germ cell tumors." },
  { id: "on4", name: "CA 19-9 (Pancreatic Marker)", price: 1800, category: "Blood", department: "Oncology", details: "Primary marker for pancreatic and biliary cancers." },
  { id: "on5", name: "CA 15-3 (Breast Cancer Marker)", price: 1600, category: "Blood", department: "Oncology", details: "Monitoring breast cancer treatment and recurrence." },
  { id: "on6", name: "Beta-2 Microglobulin", price: 2500, category: "Blood", department: "Oncology", details: "Assess prognosis for multiple myeloma and lymphomas." },
  { id: "on7", name: "LDH (Lactate Dehydrogenase)", price: 600, category: "Blood", department: "Oncology", details: "General marker for tissue damage and tumor burden." },
  { id: "on8", name: "Whole Body PET-CT Scan", price: 21500, category: "Radiology", department: "Oncology", details: "Advanced metabolic imaging for cancer staging." },
 
  // --- CLINICAL PATHOLOGY DEPARTMENT TESTS ---
  { id: "cp1", name: "PT (Prothrombin Time) with INR", price: 600, category: "Blood", department: "Clinical Pathology", details: "Evaluates blood clotting time and extrinsic pathway." },
  { id: "cp2", name: "APTT (Activated Partial Thromboplastin Time)", price: 700, category: "Blood", department: "Clinical Pathology", details: "Screens for coagulation factor deficiencies (Intrinsic)." },
  { id: "cp3", name: "Urine Microalbumin (Random)", price: 850, category: "Blood", department: "Clinical Pathology", details: "Early screening for kidney damage in diabetic patients." },
  { id: "cp4", name: "24-Hour Urine Protein/Urea", price: 1200, category: "Blood", department: "Clinical Pathology", details: "Quantitative assessment of protein excretion over 24 hours." },
  { id: "cp5", name: "CSF (Cerebrospinal Fluid) Routine", price: 2500, category: "Blood", department: "Clinical Pathology", details: "Biochemical and microscopic exam for meningitis screening." },
  { id: "cp6", name: "Body Fluid Study (Pleural/Ascitic)", price: 1800, category: "Blood", department: "Clinical Pathology", details: "Analysis of fluid buildup in lungs or abdomen." },
  { id: "cp7", name: "Bone Marrow Aspiration Report", price: 4500, category: "Blood", department: "Clinical Pathology", details: "Specialized microscopic study of blood-forming cells." },
  { id: "cp8", name: "Stool for Reduce Substances", price: 350, category: "Blood", department: "Clinical Pathology", details: "Screens for carbohydrate malabsorption in infants." },
  { id: "cp9", name: "Bence Jones Protein (Urine)", price: 1100, category: "Blood", department: "Clinical Pathology", details: "Specific screening for multiple myeloma proteins." },
  { id: "cp10", name: "Serum Protein Electrophoresis", price: 2200, category: "Blood", department: "Clinical Pathology", details: "Detailed separation of blood proteins for diagnosis." },
 
  // --- ENDOCRINOLOGY & HORMONE TESTS ---
  { id: "h1", name: "Free T3, Free T4 & TSH", price: 1100, category: "Blood", department: "Endocrinology", details: "Advanced screening for thyroid function using free hormones." },
  { id: "h2", name: "Testosterone (Total)", price: 800, category: "Blood", department: "Endocrinology", details: "Primary male sex hormone baseline test." },
  { id: "h3", name: "Testosterone (Free)", price: 1500, category: "Blood", department: "Endocrinology", details: "Measures bioactive testosterone levels in the blood." },
  { id: "h4", name: "Serum Cortisol (8 AM)", price: 900, category: "Blood", department: "Endocrinology", details: "Measures adrenal function and stress levels." },
  { id: "h5", name: "Fasting Insulin", price: 750, category: "Blood", department: "Endocrinology", details: "Evaluates insulin resistance and pancreatic health." },
  { id: "h6", name: "Growth Hormone (GH)", price: 1200, category: "Blood", department: "Endocrinology", details: "Assesses pituitary function and growth disorders." },
  { id: "h7", name: "PTH (Parathyroid Hormone)", price: 1400, category: "Blood", department: "Endocrinology", details: "Regulates calcium and phosphorus metabolism." },
  { id: "h8", name: "Estradiol (E2)", price: 850, category: "Blood", department: "Endocrinology", details: "Main estrogen hormone assessment for women." },
  { id: "h9", name: "DHEA-S", price: 1100, category: "Blood", department: "Endocrinology", details: "Adrenal androgen marker for hormonal imbalance." },
  { id: "h10", name: "Anti-TPO Antibody", price: 1300, category: "Blood", department: "Endocrinology", details: "Detects autoimmune thyroiditis (Hashimoto's)." },
  { id: "h11", name: "Serum Progesterone", price: 850, category: "Blood", department: "Endocrinology", details: "Monitors ovulation and early pregnancy health." },
  { id: "h12", name: "SHBG (Sex Hormone Binding Globulin)", price: 1600, category: "Blood", department: "Endocrinology", details: "Protein carrying sex hormones in blood." },
 
  // --- MOLECULAR BIOLOGY (VIRAL LOADS) ---
  { id: "v1", name: "HIV-1 Viral Load (Quantitative PCR)", price: 4500, category: "Blood", department: "Molecular Biology", details: "Measures the amount of HIV virus in the blood." },
  { id: "v2", name: "HCV Viral Load (Quantitative PCR)", price: 5000, category: "Blood", department: "Molecular Biology", details: "Quantifies Hepatitis C viral replication (Real-time PCR)." },
  { id: "v3", name: "HBV Viral Load (Quantitative PCR)", price: 4800, category: "Blood", department: "Molecular Biology", details: "Monitors Hepatitis B viral DNA levels and treatment." },
  { id: "v4", name: "CMV Viral Load (Quantitative)", price: 5500, category: "Blood", department: "Molecular Biology", details: "Assesses Cytomegalovirus replication in immunocompromised." },
  { id: "v5", name: "EBV Viral Load (Quantitative PCR)", price: 5200, category: "Blood", department: "Molecular Biology", details: "Detection and quantification of Epstein-Barr virus DNA." },

  // --- SPECIALIZED BIOMARKERS & ADVANCED MARKERS ---
  { id: "m1", name: "High Sensitivity Troponin I (hsTnI)", price: 1500, category: "Blood", department: "Biochemistry", details: "Highly sensitive marker for early myocardial infarction." },
  { id: "m2", name: "NT-proBNP (Heart Failure Marker)", price: 2800, category: "Blood", department: "Biochemistry", details: "Assesses cardiac strain and heart failure severity." },
  { id: "m3", name: "hs-CRP (Cardiac Risk)", price: 800, category: "Blood", department: "Biochemistry", details: "Highly sensitive risk factor for cardiovascular disease." },
  { id: "m4", name: "Procalcitonin (PCT)", price: 3200, category: "Blood", department: "Microbiology", details: "Specific biomarker for severe bacterial sepsis." },
  { id: "m5", name: "Ferritin (Iron Stores)", price: 900, category: "Blood", department: "Biochemistry", details: "Measures the body's stored iron reserves." },
  { id: "m6", name: "Homocysteine (Serum)", price: 1400, category: "Blood", department: "Biochemistry", details: "Risk factor for heart disease and stroke." },
  { id: "m7", name: "Cystatin C (Renal Marker)", price: 1200, category: "Blood", department: "Biochemistry", details: "Early indicator of kidney function impairment." },
  { id: "m8", name: "HE4 (Ovarian Cancer Marker)", price: 3500, category: "Blood", department: "Oncology", details: "Advanced biomarker for ovarian cancer screening." },
  { id: "m9", name: "Thyroglobulin (TG)", price: 1800, category: "Blood", department: "Oncology", details: "Monitoring for thyroid cancer recurrence." },
  { id: "m10", name: "Lp(a) - Lipoprotein a", price: 1500, category: "Blood", department: "Biochemistry", details: "Genetic risk marker for heart disease." },
  { id: "m11", name: "CK-MB (Cardiac Muscle Enzyme)", price: 700, category: "Blood", department: "Biochemistry", details: "Traditional marker for heart muscle injury." },
  { id: "m12", name: "Iron Studies (Full Profile)", price: 1800, category: "Blood", department: "Biochemistry", details: "Includes Serum Iron, TIBC, and Transferrin saturation." },
 
  // --- WELLNESS PACKAGES ---
  { id: "w_complete", name: "Aarvik Fit India Full Body Checkup (82 Tests)", price: 1499, originalPrice: 5600, category: "Wellness", department: "Full Body Checkup", details: "Comprehensive Health Standard. Includes Liver (11), Kidney (8), Lipids (8), Thyroid (3), Fasting Glucose, Complete Urine (10), Complete Hemogram (28), Vit D (1), Vit B12 (1) & Iron Studies (10)." },
  { id: "w1", name: "Aarvik Starter Health Screening (31 Tests)", price: 499, originalPrice: 1599, category: "Wellness", department: "Basic Profile", details: "Includes Hemogram (24), Fasting Glucose (1), Kidney Core (3) & Urine Screen (3)." },
  { id: "w2", name: "Aarvik Fasting Metabolic Active Profile (60 Tests)", price: 999, originalPrice: 2499, category: "Wellness", department: "Active Health", details: "Includes Liver Profile, Kidney Panel, Lipids, Fasting Glucose, CBC & Urine routine." },
  { id: "w3", name: "Aarvik Fit India Pro (86 Tests)", price: 1499, originalPrice: 3299, category: "Wellness", department: "Full Body Elite", details: "Fit India list + Extended Diabetes Profile with HbA1c, Average Blood Sugar, and Cardiac CRP status." },
  { id: "w4", name: "Aarvik Platinum Full Body Screen (100+ Tests)", price: 2999, originalPrice: 6999, category: "Wellness", department: "Comprehensive Care", details: "Ultimate platinum health survey: full vitamins, minerals, advanced cardiac markers, iron studies, full liver, and kidney dynamics." },
  { id: "w7", name: "Aarvik Complete Fever Profile (Malaria, Dengue & Typhoid)", price: 999, originalPrice: 2100, category: "Wellness", department: "Fever Care", details: "Diagnostic panel: Dengue NS1 & IgG/IgM, Typhodot, Malaria Card, CBC, ESR, Liver enzymes, and Urine Microscopic analysis." },
  { id: "w5", name: "Aarvik Executive Men Wellness Profile (88 Tests)", price: 3999, originalPrice: 8500, category: "Wellness", department: "Premium Health", details: "Full Body Screening + PSA (Prostate) + Cardiac risk, Hormones, and Testosterone." },
  { id: "w6", name: "Aarvik Healthy Joint & Bone Profile (15 Tests)", price: 799, originalPrice: 1800, category: "Wellness", department: "Joint & Bone", details: "Includes Calcium, Vitamin D3, Phosphorus, ALP, RA Factor and Uric Acid." },
  { id: "w9", name: "Aarvik PCOS Screening Package", price: 2499, originalPrice: 4500, category: "Wellness", department: "Women Hormones", details: "Hormonal monitoring: LH, FSH, Prolactin, Insulin, Free Testosterone, and Thyroid Panel." },
  { id: "w10", name: "Aarvik Diabetes Control & Care Package", price: 1299, originalPrice: 2800, category: "Wellness", department: "Diabetes Care", details: "Includes HbA1c, Fasting Glucose, Estimated Average Glucose, Serum Creatinine and Urine Microalbumin." },
  { id: "w11", name: "Aarvik Vital Organ Health Assessment", price: 1999, originalPrice: 4200, category: "Wellness", department: "Organ Care", details: "Evaluates the health index of your Heart, Liver, Kidneys, and Thyroid gland in one premium package." },
  { id: "w12", name: "Aarvik Vitamin Deficiency Essential Duo", price: 1199, originalPrice: 2400, category: "Wellness", department: "Vitamin Care", details: "Simultaneous high-accuracy evaluation of Vitamin D (25-OH Total) and Vitamin B12 levels." },
  { id: "b23", name: "Dengue NS1 Antigen", price: 800, category: "Blood", department: "Immunology", details: "Early detection of Dengue virus in first 5 days." },
  { id: "b24", name: "Chikungunya IgM Antibody", price: 1200, category: "Blood", department: "Immunology", details: "Diagnostic marker for active Chikungunya infection." },
  { id: "b25", name: "HBsAg (Australia Antigen)", price: 450, category: "Blood", department: "Immunology", details: "Primary screening for Hepatitis B infection." },
  { id: "b26", name: "VDRL / RPR Test", price: 300, category: "Blood", department: "Serology", details: "Traditional screening for Syphilis infection." },
  { id: "b27", name: "G6PD (Quantitative)", price: 900, category: "Blood", department: "Biochemistry", details: "Screens for enzyme deficiency causing hemolysis." },
  { id: "b28", name: "Hb Electrophoresis (HPLC)", price: 1800, category: "Blood", department: "Hematology", details: "Diagnostic for Thalassemia and Sickle Cell." },
  { id: "b29", name: "S. Albumin / Globulin Ratio", price: 400, category: "Blood", department: "Biochemistry", details: "Calculates protein balance for liver/kidney health." },
  { id: "b30", name: "Lipid Profile (Mini)", price: 600, category: "Blood", department: "Biochemistry", details: "Total Cholesterol, HDL & Triglycerides only." },
  { id: "b31", name: "Serum Magnesium", price: 500, category: "Blood", department: "Biochemistry", details: "Vital for muscle, nerve and heart function." },
  { id: "b32", name: "Serum Urea", price: 250, category: "Blood", department: "Biochemistry", details: "Basic indicator of protein metabolism and renal health." },
  { id: "b33", name: "Serum Creatinine", price: 300, category: "Blood", department: "Biochemistry", details: "Key marker for glomerular filtration rate (Kidney Health)." },
  { id: "b34", name: "Serum Uric Acid", price: 350, category: "Blood", department: "Biochemistry", details: "Assesses risks of Gout and high protein metabolism." },
  { id: "b35", name: "TSH (Ultra Sensitive)", price: 500, category: "Blood", department: "Serology", details: "Highly accurate screen for thyroid dysfunction." },
  { id: "b36", name: "Troponin T (Quantitative)", price: 1800, category: "Blood", department: "Biochemistry", details: "Specific biomarker for identifying cardiac muscle damage." },
  { id: "b37", name: "CPK-MB (Isoenzyme)", price: 750, category: "Blood", department: "Biochemistry", details: "Traditional enzyme marker for heart injury." },
  { id: "b38", name: "D-Dimer (Quantitative)", price: 1500, category: "Blood", department: "Biochemistry", details: "Detects active blood clotting/thrombosis risk." },
  { id: "b39", name: "Double Marker Screen", price: 2500, category: "Blood", department: "Serology", details: "First trimester screening for prenatal health." },
  { id: "b40", name: "Vitamin B12 (Active Holotranscobalamin)", price: 1800, category: "Blood", department: "Serology", details: "Measures the biologically active form of Vitamin B12." },
  { id: "b41", name: "Homocysteine (Serum) - Cardiac Risk", price: 1500, category: "Blood", department: "Biochemistry", details: "Marker for heart disease risk and vitamin deficiency." },
  { id: "b42", name: "Fasting Insulin (CLIA)", price: 900, category: "Blood", department: "Endocrinology", details: "Evaluates insulin resistance and metabolic health." },
  { id: "b43", name: "Serum Ferritin", price: 850, category: "Blood", department: "Hematology", details: "Measures iron stores for anemia or iron overload evaluation." },
  { id: "b44", name: "Vitamin D (25-OH Total)", price: 999, category: "Blood", department: "Biochemistry", details: "Essential for bone health and immune system support." },
  { id: "b45", name: "Total IgE (Allergy Screen)", price: 1100, category: "Blood", department: "Immunology", details: "General indicator of allergic response or parasitic infection." },
  { id: "b46", name: "Serum Phosphorus", price: 350, category: "Blood", department: "Biochemistry", details: "Vital for energy production and bone mineralization." },
  { id: "b47", name: "Serum Calcium (Total)", price: 300, category: "Blood", department: "Biochemistry", details: "Key mineral for nerve function, muscle contraction, and bone health." },
  { id: "b48", name: "RA Factor (Quantitative)", price: 750, category: "Blood", department: "Immunology", details: "Diagnostic marker for Rheumatoid Arthritis." },
  { id: "b49", name: "S. Electrolytes (Na/K/Cl)", price: 650, category: "Blood", department: "Biochemistry", details: "Measures Sodium, Potassium and Chloride for pH balance." },
  { id: "b50", name: "Prothrombin Time (PT/INR)", price: 450, category: "Blood", department: "Hematology", details: "Monitors blood clotting time for patients on blood thinners." },
  { id: "b51", name: "Amylase & Lipase Duo", price: 1200, category: "Blood", department: "Biochemistry", details: "Screening for pancreatic function and inflammation." },
  { id: "b52", name: "Serum Ammonia Level", price: 1500, category: "Blood", department: "Biochemistry", details: "Used to detect liver disease and hepatic encephalopathy." },
  { id: "b53", name: "Antistreptolysin O (ASO)", price: 500, category: "Blood", department: "Immunology", details: "Detects recent strep infection causing heart or kidney issues." },
  { id: "b54", name: "Microalbumin (Urine)", price: 550, category: "Blood", department: "Biochemistry", details: "Early screening for diabetic kidney disease risk." },
  { id: "on9", name: "Aarvik Full Body Premier Female", price: 5499, originalPrice: 12000, category: "Wellness", department: "Women Care", details: "Platinum screen including Mammography, Pap Smear & Full Body Profile." },
  { id: "b55", name: "Lipid Profile (Extended with Apo-A & Apo-B)", price: 1700, category: "Blood", department: "Biochemistry", details: "Advanced cholesterol mapping including Apolipoproteins for cardiovascular risk profiling." },
  { id: "b56", name: "Renal Panel (Advanced Premium)", price: 1500, category: "Blood", department: "Biochemistry", details: "Comprehensive kidney profile with GFR, Electrolytes, Creatinine & Cystatin-C." },
  { id: "b57", name: "Coagulation Profile (PT/INR, APTT, Fibrinogen)", price: 1900, category: "Blood", department: "Hematology", details: "Complete screen mapping both intrinsic and extrinsic blood clotting pathways." },
  { id: "b58", name: "Liver Function Test (Special Premium)", price: 1600, category: "Blood", department: "Biochemistry", details: "Extended LFT with GGT, 5'-Nucleotidase, Serum Albumin, and total proteins." },
  { id: "b59", name: "HbA1c + Average Blood Glucose Panel", price: 750, category: "Blood", department: "Biochemistry", details: "Correlates instant blood glucose with 3-month average HbA1c." },
  { id: "b60", name: "Vitamin Panel Premium (Vit D, Vit B12, Vit B6)", price: 2400, category: "Blood", department: "Serology", details: "Full neurological and metabolic vitamin checklist, including active B12." },
  { id: "b61", name: "Serum Iron-Binding Capacity & Zinc Duo", price: 1200, category: "Blood", department: "Biochemistry", details: "Evaluates key microelements for immune function and cellular health." },
  { id: "b62", name: "Food Allergy Panel (15+ Common Panels)", price: 4200, category: "Blood", department: "Immunology", details: "Comprehensive screening for specific IgE antibodies against major food allergens." },
  { id: "b63", name: "Serum Immunoglobulins Profile (IgA, IgG, IgM)", price: 2200, category: "Blood", department: "Immunology", details: "Quantitative assessment of primary defensive antibodies in stream." },
];

function DiagnosticFaqHub() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const faqs = [
    {
      id: 1,
      category: "prep",
      question: "Is fasting mandatory for all blood tests?",
      answer: "No, fasting is only required for specific metabolic tests like Glucose (Fasting), Lipid Profile (Cholesterol), and Insulin assays. Fasting requires having no food or drinks (except pure water) for 10-12 hours before sample collection. For routine CBC, Thyroid, Kidney, and Liver tests, you can eat normally."
    },
    {
      id: 2,
      category: "reports",
      question: "How and when will I get my diagnostic reports?",
      answer: "Most routine reports (Blood Count, Blood sugar, Liver / Kidney function / Hormones) are analyzed and delivered within 8 hours of collection. Special microbiology, culture, or biopsy assays take 24-48 hours. Reports are delivered instantly via secure, password-protected PDF on your registered WhatsApp and registered Email address."
    },
    {
      id: 3,
      category: "prep",
      question: "How should I prepare for a health checkup profile?",
      answer: "For premium full body packages, we recommend a 10-12 hour overnight fast. Ensure you take any scheduled heart or blood pressure medications but hold diabetes medications if fasting to prevent hypoglycemic episodes. Avoid alcohol, caffeine, and heavy workouts 24 hours prior to the test."
    },
    {
      id: 4,
      category: "general",
      question: "Are your laboratory test results NABL accredited & ISO compliant?",
      answer: "Yes, Aarvik Health Lab works in absolute compliance with fully NABL accredited diagnostic partners. Our testing assays utilize automatic analytical analyzers that follow severe internal quality controls, yielding absolute precision and 99.9% error-free medical feedback."
    },
    {
      id: 5,
      category: "general",
      question: "How does free home sample collection work?",
      answer: "Upon booking confirmation, a certified, senior phlebotomist is dispatched to your provided location in Kondapur / Hyderabad. Samples are extracted in sterile single-use vacuum tubes and securely carried in special temperature-controlled cold boxes to prevent cellular degradation."
    }
  ];

  const categories = [
    { id: "all", name: "All Questions" },
    { id: "prep", name: "Preparations" },
    { id: "reports", name: "Reports & Timing" },
    { id: "general", name: "Safety & Quality" },
  ];

  const filteredFaqs = faqs.filter(faq => activeCategory === "all" || faq.category === activeCategory);

  return (
    <div className="grid lg:grid-cols-12 gap-10 items-start">
      {/* Left side: Lab Centre Info Card */}
      <div className="lg:col-span-5 space-y-6">
        <div className="relative bg-white rounded-[2rem] p-7 border border-slate-150 shadow-md">
          <div className="absolute top-0 right-0 h-32 w-32 bg-teal-50/50 rounded-full blur-[40px]" />
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-100 text-[10px] font-black uppercase tracking-wider">
              <MapPin size={10} className="text-vivid-teal" />
              Physical Lab Centre
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Kondapur Head Office</h3>
              <p className="text-xs font-bold text-slate-500 leading-relaxed font-sans text-left">
                Plot 12, Kondapur Main Road, Opp. Botanical Garden Road, Kondapur, Hyderabad - 500084, Telangana.
              </p>
            </div>

            <hr className="border-slate-100" />

            {/* Timings */}
            <div className="flex gap-4 items-start">
              <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-dark-lavender">
                <Clock size={16} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Operating Hours</p>
                <p className="text-xs font-black text-slate-800 mt-0.5">Monday to Sunday</p>
                <p className="text-xs font-bold text-slate-500">6:00 AM – 10:00 PM (All Days)</p>
              </div>
            </div>

            {/* Direct Contacts */}
            <div className="space-y-2 pt-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Direct Contacts</p>
              <div className="grid grid-cols-2 gap-2">
                <a 
                  href="tel:8328139956"
                  className="px-3 py-2.5 rounded-xl border border-blue-100 hover:border-vivid-teal bg-white flex items-center gap-2 hover:bg-slate-50 transition-all"
                >
                  <Phone size={12} className="text-blue-900" />
                  <span className="text-[9.5px] font-black text-slate-800 font-mono">+91 8328139956</span>
                </a>
                <a 
                  href="https://wa.me/918328139956"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2.5 rounded-xl border border-emerald-100 hover:border-[#25D366] bg-white flex items-center gap-2 hover:bg-slate-50 transition-all"
                >
                  <MessageCircle size={12} fill="currentColor" className="text-[#25D366]" />
                  <span className="text-[9.5px] font-black text-slate-800 font-mono">WhatsApp Chat</span>
                </a>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Accredited Partners Badge */}
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/60 flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-800">
                <ShieldCheck size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-wider text-emerald-800 leading-none">Diagnostic Safety</p>
                <p className="text-[9.5px] font-bold text-slate-500 mt-1 leading-tight">ISO 9001:2015 Standards • 100% NABL Certified Pathology Process</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quality Assurances Box */}
        <div className="bg-slate-50 border border-slate-200/50 rounded-[2.2rem] p-6 space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-450 text-left">Core Lab Assurances</h4>
          <div className="space-y-3">
            {[
              "Highly scrutinized dry chemistry analytical instruments",
              "Vacuum container security barcodes for error-free tagging",
              "Bi-directional computerised barcode analyzers (LIS synced)",
              "Strict internal quality control checklists & NABL calibration"
            ].map((text, idx) => (
              <div key={idx} className="flex gap-2.5 items-start">
                <div className="h-4 w-4 shrink-0 rounded-full bg-vivid-teal/10 flex items-center justify-center text-vivid-teal mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-vivid-teal" />
                </div>
                <p className="text-[11px] font-bold text-slate-600 leading-tight text-left">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side: Interactive Collapsible Accordions FAQ */}
      <div className="lg:col-span-7 space-y-6 text-left">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-vivid-teal uppercase tracking-[0.2em]">Patient Support Hub</p>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Diagnostics FAQ Portal</h3>
          <p className="text-xs font-bold text-slate-500 max-w-xl leading-relaxed">
            Frequently asked guidelines for preparing, fasting, scheduling, and getting your pathology test reports seamlessly.
          </p>
        </div>

        {/* Category switcher */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setActiveFaq(null);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                activeCategory === cat.id 
                  ? "bg-dark-lavender text-white shadow" 
                  : "bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200/50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div className="space-y-3 pt-1">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isExpanded = activeFaq === faq.id;
              return (
                <div 
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-300 bg-white overflow-hidden ${
                    isExpanded 
                      ? "border-vivid-teal ring-1 ring-vivid-teal/30 shadow-md" 
                      : "border-slate-150 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <button
                    onClick={() => setActiveFaq(isExpanded ? null : faq.id)}
                    className="w-full text-left p-4 sm:p-5 flex justify-between items-center gap-4 hover:bg-slate-50/30 transition-colors"
                  >
                    <div className="flex gap-3 items-center">
                      <div className={`h-6 w-6 shrink-0 rounded-lg flex items-center justify-center text-[10px] font-black ${
                        isExpanded ? "bg-vivid-teal text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                        Q{idx + 1}
                      </div>
                      <span className="text-xs sm:text-[13.5px] font-black text-slate-900 tracking-tight leading-snug">
                        {faq.question}
                      </span>
                    </div>
                    <div className={`text-slate-400 transition-transform duration-300 ${
                      isExpanded ? "rotate-180 text-vivid-teal" : ""
                    }`}>
                      <ChevronDown size={14} />
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      transition={{ duration: 0.25, cubicBezier: [0.16, 1, 0.3, 1] }}
                      className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-5 text-xs sm:text-[12.5px] font-bold text-slate-600 leading-relaxed font-sans text-left border-l-4 border-l-vivid-teal"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs font-bold text-slate-500 font-sans">No questions found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddressPicker({ onConfirm }: { onConfirm: (details: any) => void }) {
  const [area, setArea] = useState("");
  const [homeNo, setHomeNo] = useState("");
  const [block, setBlock] = useState("");
  const [floor, setFloor] = useState("");
  const [pincode, setPincode] = useState("");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block px-1">Area / Landmark</label>
          <input 
            value={area}
            required
            onChange={(e) => setArea(e.target.value)}
            className="w-full rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-[10px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900/10 placeholder:text-slate-300"
            placeholder="e.g. Near Whitefields, Kondapur"
          />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block px-1">Plot / Door No</label>
          <input value={homeNo} required onChange={e => setHomeNo(e.target.value)} placeholder="e.g. 402" className="w-full rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-[10px] font-bold text-slate-900 focus:outline-none" />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block px-1">Block / Building</label>
          <input value={block} onChange={e => setBlock(e.target.value)} placeholder="B-Block" className="w-full rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-[10px] font-bold text-slate-900 focus:outline-none" />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block px-1">Floor No</label>
          <input value={floor} onChange={e => setFloor(e.target.value)} placeholder="3rd Floor" className="w-full rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-[10px] font-bold text-slate-900 focus:outline-none" />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block px-1">Pincode</label>
          <input value={pincode} required maxLength={6} onChange={e => setPincode(e.target.value)} placeholder="500084" className="w-full rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-[10px] font-bold text-slate-900 focus:outline-none" />
        </div>
      </div>

      <button 
        disabled={!area || !homeNo || !pincode}
        onClick={() => onConfirm({ 
          homeNo, block, floor, area, pincode, formatted: `${homeNo}, ${block}, ${floor}, ${area}, ${pincode}`, lat: 0, lng: 0 
        })}
        className="w-full rounded-2xl bg-red-700 py-4 text-xs font-black text-white hover:bg-red-800 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-xl uppercase tracking-widest active:scale-95"
      >
        Confirm Collection Slot
      </button>
    </div>
  );
}

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<"Hyderabad" | "Zaheerabad">("Hyderabad");
  const [currentPage, setCurrentPage] = useState<"home" | "all-tests" | "blood-tests" | "radiology" | "wellness" | "about">("home");
  const [cart, setCart] = useState<Test[]>([]);
  const [search, setSearch] = useState("");
  const [showQuickResults, setShowQuickResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const wellnessSliderRef = useRef<HTMLDivElement>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"summary" | "payment" | "processing" | "success">("summary");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cash" | null>(null);
  const [upiMobileNumber, setUpiMobileNumber] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginStep, setLoginStep] = useState<"details" | "address" | "otp">("details");
  const [tempUser, setTempUser] = useState<{
    name: string, 
    phone: string, 
    age?: string,
    gender?: string,
    address?: {
      homeNo: string,
      block: string,
      floor: string,
      area: string,
      pincode: string,
      formatted: string,
      lat: number,
      lng: number
    }
  } | null>(null);
  const [user, setUser] = useState<{
    name: string, 
    phone: string, 
    age?: string,
    gender?: string,
    address?: {
      homeNo: string,
      block: string,
      floor: string,
      area: string,
      pincode: string,
      formatted: string,
      lat: number,
      lng: number
    }
  } | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("07:00 AM - 08:00 AM");
  const [orderReference, setOrderReference] = useState("");
  const [notifications, setNotifications] = useState<{id: string, text: string, type: 'patient' | 'admin'}[]>([]);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [previewTest, setPreviewTest] = useState<Test | null>(null);
  const [testPageIndex, setTestPageIndex] = useState(0);
  const [copiedIndicator, setCopiedIndicator] = useState(false);
  const [activeMsgTemplate, setActiveMsgTemplate] = useState(0);
  const [businessVpa, setBusinessVpa] = useState<string>("mahipalzah-3@oksbi");
  const [businessPhone, setBusinessPhone] = useState<string>("8328139956");
  const [autoOpenWhatsapp, setAutoOpenWhatsapp] = useState<boolean>(true);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState<boolean>(true);
  const [autoRedirectCountdown, setAutoRedirectCountdown] = useState<number>(5);
  const [countdownActive, setCountdownActive] = useState<boolean>(true);
  const testsPerPage = 24;

  const scrollToServices = () => {
    setTimeout(() => {
      const target = document.getElementById('services');
      if (target) {
        const yOffset = -135;
        const y = target.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 120);
  };

  const scrollTo1499Package = () => {
    setCurrentPage("wellness");
    setSearch("");
    setShowQuickResults(false);
    setTimeout(() => {
      const target = document.getElementById('package-1499');
      if (target) {
        const yOffset = -150;
        const y = target.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        
        // Highlight pulsing decoration
        target.classList.add("ring-8", "ring-orange-500/30", "scale-[1.01]");
        setTimeout(() => {
          target.classList.remove("ring-8", "ring-orange-500/30", "scale-[1.01]");
        }, 2000);
      }
    }, 250);
  };

  const focusSearchInput = () => {
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 200);
  };

  useEffect(() => {
    setTestPageIndex(0);
  }, [search, currentPage]);

  useEffect(() => {
    if (user?.phone && !upiMobileNumber) {
      setUpiMobileNumber(user.phone);
    }
  }, [user, upiMobileNumber]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowQuickResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (paymentStep === 'success' && completedOrder && autoOpenWhatsapp && countdownActive) {
      if (autoRedirectCountdown > 0) {
        timer = setTimeout(() => {
          setAutoRedirectCountdown(prev => prev - 1);
        }, 1000);
      } else {
        const patientPhone = completedOrder?.patient?.phone || '8328139956';
        const tests = (completedOrder?.items || []).map((t: any) => t.name).join(", ");
        const whatsappMsg = `*AARVIK HEALTH LABS - BOOKING CONFIRMED* ✅\n\n*INVOICE DETAILS*\n🔖 Order Ref: #${completedOrder?.id}\n📅 Date: ${completedOrder?.date}\n\n*PATIENT INFO*\n👤 Name: ${completedOrder?.patient?.name}\n📊 Age/Gender: ${completedOrder?.patient?.age}Y / ${completedOrder?.patient?.gender}\n📞 Phone: +91 ${patientPhone}\n\n*BOOKING SUMMARY*\n🔬 Investigations: ${tests}\n📅 Time Slot: ${completedOrder?.slot}\n📍 Address: ${completedOrder?.patient?.address?.formatted || completedOrder?.patient?.address}\n\n*BILLING*\n💰 Bill Amount: ₹${completedOrder?.total?.toFixed(0)}\n💳 Method: ${completedOrder?.paymentMethod}\n\nOur phlebotomist will contact you shortly for sample collection.\n\n_Stay Healthy with Aarvik Health Labs!_`;
        
        const whatsappUrl = `https://wa.me/91${patientPhone}?text=${encodeURIComponent(whatsappMsg)}`;
        window.open(whatsappUrl, '_blank');
        setCountdownActive(false);
      }
    } else if (paymentStep !== 'success') {
      setAutoRedirectCountdown(5);
      setCountdownActive(true);
    }
    return () => clearTimeout(timer);
  }, [paymentStep, completedOrder, autoOpenWhatsapp, autoRedirectCountdown, countdownActive]);

  const filteredTests = useMemo(() => {
    let baseTests = TESTS;
    
    // If NOT searching, we filter by the current page's category
    if (!search) {
      if (currentPage === "blood-tests") baseTests = TESTS.filter(t => 
        t.category === "Blood" || 
        ['pathology', 'hematology', 'biochemistry', 'serology', 'microbiology', 'immunology', 'endocrinology', 'clinical', 'ferritin', 'molecular'].some(d => t.department.toLowerCase().includes(d))
      );
      if (currentPage === "radiology") baseTests = TESTS.filter(t => t.category === "Radiology");
      if (currentPage === "wellness") baseTests = TESTS.filter(t => t.category === "Wellness");
    }

    return baseTests.filter(test => {
      const s = search.toLowerCase();
      return test.name.toLowerCase().includes(s) || 
             test.category.toLowerCase().includes(s) ||
             test.department.toLowerCase().includes(s) ||
             test.details.toLowerCase().includes(s);
    });
  }, [search, currentPage]);

  const addToCart = (test: Test) => {
    if (!cart.find(t => t.id === test.id)) {
      setCart([...cart, test]);
      // Add feedback notification
      const feedbackMsg = { 
        id: `feedback-${Date.now()}`, 
        text: `${test.name} added to booking list.`, 
        type: 'patient' as const 
      };
      setNotifications(prev => [...prev, feedbackMsg]);
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== feedbackMsg.id));
      }, 3000);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(t => t.id !== id));
  };

  const subtotal = cart.reduce((acc, t) => acc + t.price, 0);
  const totalOriginal = cart.reduce((acc, t) => acc + (t.originalPrice || t.price), 0);
  const serviceKitCharges = cart.length > 0 ? 100 : 0;
  const discountAmount = 0;
  const totalDue = subtotal + serviceKitCharges;

  const handleCloseCart = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      setPaymentStep("summary");
      setPaymentMethod("cash");
    }, 300);
  };

  const handleProceedToPayment = () => {
    setPaymentStep("payment");
  };

  const handleFinalizeBooking = () => {
    setPaymentStep("processing");
    
    // Final logic
    setTimeout(() => {
      const orderId = orderReference || `AARVI-${Math.floor(Math.random()*100000)}`;
      const newOrder = {
        id: orderId,
        date: new Date().toLocaleString(),
        items: [...cart],
        total: totalDue,
        totalOriginal,
        discountAmount,
        status: 'Confirmed',
        paymentMethod: paymentMethod?.toUpperCase() + ' (PAID)',
        slot: selectedSlot,
        patient: {
          name: user?.name || 'Guest',
          phone: user?.phone || '8328139956',
          age: user?.age,
          gender: user?.gender,
          address: user?.address?.formatted || 'Provided'
        }
      };
      
      setOrders(prev => [newOrder, ...prev]);
      setCompletedOrder(newOrder);
      setOrderReference(orderId);
      setPaymentStep("success");
      setCart([]);
      
      const testList = cart.map(t => t.name).join(", ");
      
      setNotifications(prev => [
        { 
          id: Date.now().toString(), 
          text: `Payment Linked! Booking #${orderId} confirmed for ${user?.name}. We will visit for sample collection at: ${user?.address?.formatted}.`, 
          type: 'patient' 
        },
        ...prev
      ].slice(0, 5));
    }, 2000);
  };

  const handleConfirmPayment = (targetMethod?: "upi" | "card" | "cash") => {
    const activeMethod = targetMethod || paymentMethod || 'cash';
    if (targetMethod) {
      setPaymentMethod(targetMethod);
    }
    setPaymentStep("processing");
    
    // Simulate API calls and notifications - ultra-fast for UPI (only 300ms for high performance)
    const delay = activeMethod === "upi" ? 300 : 2000;
    
    setTimeout(() => {
      const orderId = orderReference || `AARVI-${Math.floor(Math.random()*100000)}`;
      const newOrder = {
        id: orderId,
        date: new Date().toLocaleString(),
        items: [...cart],
        total: totalDue,
        totalOriginal,
        discountAmount,
        status: 'Confirmed',
        paymentMethod: activeMethod === 'cash' ? 'CASH ON COLLECTION' : (activeMethod === 'upi' ? 'UPI / SCAN INSTANT' : 'CARD TRANSACTION'),
        slot: selectedSlot,
        patient: {
          name: user?.name || 'Guest',
          phone: user?.phone || '8328139956',
          age: user?.age,
          gender: user?.gender,
          address: user?.address?.formatted || 'Provided'
        }
      };
      
      setOrders(prev => [newOrder, ...prev]);
      setCompletedOrder(newOrder);
      setOrderReference(orderId);
      setPaymentStep("success");
      
      const testList = cart.map(t => t.name).join(", ");

      // Notify Patient
      const patientMsg = { 
        id: Date.now().toString(), 
        text: `Booking Confirmed! Order #${orderId} for ${testList}. Method: ${activeMethod?.toUpperCase()} (₹${totalDue.toFixed(0)}). Phlebotomist scheduled for ${selectedSlot}.`, 
        type: 'patient' as const 
      };
      
      // Notify Admin
      const adminMsg = { 
        id: (Date.now() + 1).toString(), 
        text: `NEW BOOKING #${orderId}: ${user?.name} (${user?.age}Y/${user?.gender}). Tests: ${testList}. Total: ₹${totalDue.toFixed(0)}. Billing Type: ${activeMethod?.toUpperCase()}. WhatsApp triggered.`, 
        type: 'admin' as const 
      };
      
      const whatsappMsg = {
        id: (Date.now() + 2).toString(),
        text: `WhatsApp Confirmation sent to ${user?.phone || '8328139956'}.`,
        type: 'patient' as const
      };
      
      setNotifications([patientMsg, adminMsg, whatsappMsg]);
      setCart([]);
    }, delay);
  };

  const handleDetailsSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const phoneNum = formData.get('phone') as string;
    setTempUser({
      name: formData.get('name') as string,
      phone: phoneNum,
      age: formData.get('age') as string,
      gender: formData.get('gender') as string,
    });
    setOtp("1234");
    setLoginStep("otp");
    setNotifications(prev => [
      { id: Date.now().toString(), text: `OTP: 1234 has been directly sent to +91 ${phoneNum}.`, type: 'patient' },
      ...prev
    ].slice(0, 5));
  };

  const handleOtpSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (otp === "1234") {
      setLoginStep("address");
      setOtp("");
    } else {
      setNotifications(prev => [{ id: 'otp-err', text: 'Invalid OTP. Use 1234.', type: 'patient' }, ...prev]);
    }
  };

  const handleAddressSubmit = (addressDetails: any) => {
    if (tempUser) {
      const finalUser = {
        ...tempUser,
        address: addressDetails
      };
      setUser(finalUser);
      setIsLoginOpen(false);
      setLoginStep("details");
      setTempUser(null);
      
      setNotifications(prev => [
        { id: Date.now().toString(), text: `Profile Verified! Welcome ${finalUser.name}.`, type: 'patient' },
        ...prev
      ].slice(0, 5));
    }
  };

  const downloadReceipt = (orderObj?: any) => {
    const doc = new jsPDF();
    const order = orderObj || completedOrder || (orders[0] || null);
    
    if (!order) {
      alert("Order not found.");
      return;
    }
    
    const orderId = order.id || `AARVI-${Math.floor(Math.random()*100000)}`;
    const regNo = `REG-${Math.floor(Math.random()*1000000)}`;
    
    // Header styling
    doc.setFillColor(15, 23, 42); 
    doc.rect(0, 0, 210, 48, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("Aarvik Health Labs", 20, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(30, 58, 138); // blue-900
    doc.text("HEALTH LABS", 20, 28);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("ISO 9001:2015 CERTIFIED • NABL ACCREDITED PARTNER LABS", 20, 36);
    doc.text("PLOT 12, KONDAPUR MAIN ROAD, HYDERABAD - 500084", 20, 41);
    
    doc.text("Support: +91 8328139956", 190, 22, { align: 'right' });
    doc.text("Email: care@aarvihealth.com", 190, 27, { align: 'right' });
    doc.text("Web: www.aarvihealth.com", 190, 32, { align: 'right' });
    
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("TAX INVOICE / BOOKING CONFIRMATION", 20, 65);
    
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 75, 190, 75);
    
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("INVOICE NO:", 20, 85);
    doc.text("REGISTRATION NO:", 70, 85);
    doc.text("DATE & TIME:", 120, 85);
    
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(orderId, 20, 90);
    doc.text(regNo, 70, 90);
    doc.text(order.date || new Date().toLocaleString(), 120, 90);
    
    doc.setFillColor(248, 250, 252);
    doc.rect(20, 100, 170, 40, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("BILLING TO:", 25, 110);
    doc.text("COLLECTION SLOT:", 110, 110);
    
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    const pName = order.patient?.name || user?.name || "GUEST PATIENT";
    doc.text(pName.toUpperCase(), 25, 116);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Age/Gender: ${order.patient?.age || user?.age}Y / ${order.patient?.gender || user?.gender}`, 25, 121);
    doc.text(`Phone: ${order.patient?.phone || user?.phone}`, 25, 126);
    const wrappedAddr = doc.splitTextToSize(`Address: ${order.patient?.address || user?.address?.formatted || 'Provided at collection'}`, 70);
    doc.text(wrappedAddr, 25, 131);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(234, 88, 12);
    doc.text(order.slot || selectedSlot, 110, 116);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "normal");
    doc.text("Status: Phlebotomist Assigned", 110, 121);
    
    let currentY = 155;
    doc.setFillColor(15, 23, 42);
    doc.rect(20, currentY, 170, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("S.NO", 23, currentY + 6.5);
    doc.text("TEST NAME", 35, currentY + 6.5);
    doc.text("MRP", 145, currentY + 6.5, { align: 'right' });
    doc.text("OFFER PRICE", 185, currentY + 6.5, { align: 'right' });
    
    currentY += 15;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8);
    
    const items = order.items || cart;
    items.forEach((item: any, index: number) => {
        doc.text(`${index + 1}`, 23, currentY);
        doc.text(item.name, 35, currentY);
        doc.text(`INR ${item.originalPrice || (item.price * 2.0).toFixed(0)}`, 145, currentY, { align: 'right' });
        doc.text(`INR ${item.price || 0}`, 185, currentY, { align: 'right' });
        currentY += 8;
    });
    
    currentY += 5;
    doc.setDrawColor(226, 232, 240);
    doc.line(110, currentY, 190, currentY);
    currentY += 8;
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const itemsSubtotal = items.reduce((acc: number, item: any) => acc + (item.price || 0), 0);
    doc.text("Investigations Subtotal:", 110, currentY);
    doc.text(`INR ${itemsSubtotal.toFixed(0)}`, 185, currentY, { align: 'right' });
    
    currentY += 5;
    const sCharges = items.length > 0 ? 100 : 0;
    doc.text("Service Kit Charges:", 110, currentY);
    doc.text(`INR ${sCharges.toFixed(0)}`, 185, currentY, { align: 'right' });
    
    currentY += 5;
    doc.line(110, currentY, 190, currentY);
    currentY += 8;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL DUE:", 110, currentY);
    const total = order.total || (itemsSubtotal + sCharges);
    doc.text(`INR ${total.toFixed(0)}`, 185, currentY, { align: 'right' });
    
    currentY += 20;
    doc.setFontSize(9);
    doc.text("PAYMENT: PAY AT HOME", 20, currentY);
    doc.setFontSize(8);
    doc.text(`In Words: Rupees ${amountToWords(total)} ONLY`, 20, currentY + 5);
    
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 275, 190, 275);
    doc.text("Aarvik Health Labs - Computer Generated Receipt", 20, 282);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 190, 282, { align: 'right' });
    
    doc.save(`AARVIK_Receipt_${orderId}.pdf`);
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all shadow-md border-t-4 border-dark-lavender">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-dark-lavender via-electrical-purple to-warm-coral"></div>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 h-14">
          <div className="flex items-center gap-4 sm:gap-6">
            <button 
              onClick={() => setCurrentPage("home")}
              className="hover:opacity-95 transition-opacity flex items-center gap-2.5 group relative shrink-0"
            >
              <Logo style={{ width: "52px", height: "42px" }} className="h-9 w-auto relative z-10 text-slate-900 duration-300 group-hover:scale-105 transition-transform" />
              <div style={{ width: "100px", height: "45px" }} className="flex flex-col text-left leading-none">
                <span style={{ width: "11px", height: "29px" }} className="text-xl font-black tracking-tight uppercase text-slate-900 group-hover:text-[#ff4d80] transition-colors">
                  Aarvik
                </span>
                <span className="text-[7.5px] font-black tracking-[0.34em] text-[#ff4d80] uppercase mt-0.5">
                  Health Labs
                </span>
              </div>
            </button>

            {/* Interactive Location Picker */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#ecfdf5]/80 border border-emerald-200/60 hover:border-emerald-500 hover:bg-[#ecfdf5] transition-all relative group shrink-0">
              <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-500 text-white shrink-0 shadow-sm">
                <MapPin size={11} className="animate-bounce" style={{ animationDuration: '3s' }} />
              </div>
              <div className="flex flex-col text-left pl-1">
                <span className="text-[6px] font-black uppercase text-emerald-850 tracking-wider leading-none">Branch</span>
                <div className="relative flex items-center mt-0.5">
                  <select 
                    value={selectedLocation} 
                    onChange={(e) => {
                      const value = e.target.value as "Hyderabad" | "Zaheerabad";
                      setSelectedLocation(value);
                      setNotifications(prev => [{ id: Date.now().toString(), text: `Branch shifted to ${value}. Initializing nearest phlebotomist network.`, type: "patient" }, ...prev]);
                    }}
                    className="bg-transparent text-[9.5px] font-black uppercase tracking-wider text-emerald-950 focus:outline-none cursor-pointer pr-3.5 appearance-none relative z-10 font-sans leading-none"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                  >
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Zaheerabad">Zaheerabad</option>
                  </select>
                  <ChevronDown size={8} className="text-emerald-700 absolute right-0 pointer-events-none group-hover:text-emerald-900 transition-colors" />
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3 border-l border-slate-200 pl-4">
              {[
                { name: "all-tests", label: "All Tests", icon: Search },
                { name: "Blood-Tests", label: "Blood Tests", icon: Droplets },
                { name: "Radiology", label: "Radiology", icon: Scan },
                { name: "Wellness", label: "Packages", icon: HeartPulse }
              ].map((page) => {
                const isActive = currentPage === page.name.toLowerCase();
                const Icon = page.icon;
                return (
                  <button
                    key={page.name}
                    onClick={() => {
                      setCurrentPage(page.name.toLowerCase() as any);
                      focusSearchInput();
                    }}
                    className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10.5px] font-black uppercase tracking-wider transition-all duration-300 relative border select-none cursor-pointer ${
                      isActive 
                        ? "bg-dark-lavender text-white border-dark-lavender shadow-md shadow-dark-lavender/30 scale-[1.02]" 
                        : "text-slate-600 border-transparent hover:text-dark-lavender hover:bg-slate-100/70"
                    }`}
                  >
                    <Icon size={12} className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-vivid-teal" : "text-slate-400 group-hover:text-dark-lavender"}`} />
                    <span>{page.label}</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-vivid-teal shadow shadow-vivid-teal/50" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => {
                setCurrentPage("integration");
                scrollToServices();
              }}
              className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all duration-300 border select-none cursor-pointer ${
                currentPage === "integration"
                  ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/30 scale-[1.02]"
                  : "text-slate-600 bg-amber-50/20 border-amber-200/50 hover:text-amber-700 hover:bg-amber-50"
              }`}
            >
              <Zap size={11} className={currentPage === "integration" ? "text-white animate-pulse" : "text-amber-500"} />
              <span>Gateway Config</span>
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsOrdersOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ecfdf5]/70 border border-emerald-200/60 hover:border-emerald-500 hover:bg-[#ecfdf5] transition-all text-left group cursor-pointer shadow-sm shadow-emerald-100/50"
                >
                  <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10.5px] font-black shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col pr-1 leading-none select-none">
                    <span className="text-[6px] font-black uppercase tracking-widest text-emerald-850">Verified Member</span>
                    <span className="text-[9.5px] font-black text-slate-900 tracking-tight capitalize">{user.name.split(" ")[0].toLowerCase()}</span>
                  </div>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-950 text-white border border-slate-950 hover:bg-vivid-teal hover:border-vivid-teal shadow-md hover:shadow-lg hover:shadow-vivid-teal/15 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <LogIn size={11} className="text-vivid-teal transition-transform duration-300 group-hover:translate-x-0.5" />
                <span>Login Account</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Global Search Bar - Premium Floating Design */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/85 pt-1.5 pb-1 sticky top-14 z-40 transition-all shadow-sm">
        {currentPage === "home" ? (
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-1">
            <div className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 shadow-md overflow-hidden relative" ref={searchRef}>
              <div className="flex flex-col lg:flex-row gap-2.5 items-start lg:items-center">
                {/* Right Content Area */}
                <div className="flex-1 w-full z-10">
                  <div className="flex flex-col lg:flex-row gap-3 mb-1.5">
                    <div 
                      onClick={() => {
                        setSearch("Home Collection");
                        setShowQuickResults(true);
                      }}
                      className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg shadow border border-slate-150 group hover:border-vivid-teal/40 cursor-pointer self-start lg:self-auto"
                    >
                      <div className="relative">
                        <div className="absolute -inset-1 bg-vivid-teal/15 rounded-lg blur group-hover:opacity-100 opacity-60 transition-opacity" />
                        <div className="h-6 w-6 rounded bg-dark-lavender relative overflow-hidden flex items-center justify-center">
                           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
                           <Home size={10} className="text-white relative z-10" strokeWidth={2.5} />
                        </div>
                      </div>
                      <div className="flex flex-col text-left whitespace-nowrap">
                        <span className="text-[6px] font-black text-vivid-teal uppercase tracking-wider leading-none">Care Plus</span>
                        <span className="text-[9px] font-black text-slate-900 leading-none tracking-tight">Home Sample</span>
                      </div>
                    </div>

                    <div className="flex-1 max-w-2xl relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 group-focus-within:text-blue-500 transition-colors animate-pulse" size={13} strokeWidth={2.5} />
                       <input 
                        ref={searchInputRef}
                        type="text" 
                        placeholder="Search for test packages..."
                        className="w-full rounded-lg border-2 border-blue-200 bg-blue-50/10 hover:border-blue-350 focus:border-blue-500 py-1.5 pl-9 pr-8 text-[11px] font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/15 transition-all shadow-sm placeholder:text-blue-500 placeholder:font-bold italic"
                        value={search}
                        onFocus={() => setShowQuickResults(true)}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSearch(val);
                          setShowQuickResults(true);
                          if (val === "1499" || val.includes("1499")) {
                            scrollTo1499Package();
                          } else if (val.length > 0) {
                            if (currentPage === "home" || currentPage === "about") {
                              setCurrentPage("blood-tests");
                            }
                          }
                        }}
                      />
                      {search && (
                        <button 
                          onClick={() => {
                            setSearch("");
                            setShowQuickResults(false);
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Quick Action Banners - Left Aligned Layout with Mobile Scroll */}
                  <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar snap-x max-w-xl">
                    <motion.div 
                      whileHover={{ y: -1 }}
                      onClick={() => {
                        setCurrentPage("blood-tests");
                        scrollToServices();
                      }}
                      className="min-w-[150px] group cursor-pointer relative overflow-hidden rounded-lg bg-gradient-to-br from-red-600 to-rose-700 p-1.5 shadow border border-white/5 snap-center"
                    >
                      <div className="absolute top-0 right-0 p-0.5 opacity-5 group-hover:scale-105 transition-transform">
                        <TestTube size={30} strokeWidth={1} />
                      </div>
                      <div className="relative z-10 flex items-center gap-1.5">
                        <div className="h-6 w-6 rounded bg-white/25 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                          <TestTube size={11} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-0.5 mb-0.5">
                            <span className="h-0.5 w-0.5 rounded-full bg-white animate-pulse" />
                            <span className="text-[5px] font-black text-white/70 uppercase tracking-widest">Live Access</span>
                          </div>
                          <motion.h3 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-[9.5px] font-black text-white uppercase tracking-tight"
                          >
                            Book Blood Test
                          </motion.h3>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      whileHover={{ y: -1 }}
                      onClick={() => {
                        setCurrentPage("wellness");
                        scrollToServices();
                      }}
                      className="min-w-[150px] group cursor-pointer relative overflow-hidden rounded-lg bg-gradient-to-br from-dark-lavender to-electrical-purple p-1.5 shadow border border-white/5 snap-center"
                    >
                      <div className="absolute top-0 right-0 p-0.5 opacity-5 group-hover:scale-105 transition-transform">
                        <ShieldCheck size={30} strokeWidth={1} />
                      </div>
                      <div className="relative z-10 flex items-center gap-1.5">
                        <div className="h-6 w-6 rounded bg-white/25 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                          <Activity size={11} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-0.5 mb-0.5">
                            <span className="h-0.5 w-0.5 rounded-full bg-white animate-pulse" />
                            <span className="text-[5px] font-black text-white/70 uppercase tracking-widest font-sans">Screening</span>
                          </div>
                          <motion.h3 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-[9.5px] font-black text-white uppercase tracking-tight"
                          >
                            Health Packages
                          </motion.h3>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      whileHover={{ y: -1 }}
                      onClick={() => {
                        setCurrentPage("radiology");
                        scrollToServices();
                      }}
                      className="min-w-[150px] group cursor-pointer relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 p-1.5 shadow border border-white/5 snap-center"
                    >
                      <div className="absolute top-0 right-0 p-0.5 opacity-5 group-hover:scale-105 transition-transform">
                        <Scan size={30} strokeWidth={1} />
                      </div>
                      <div className="relative z-10 flex items-center gap-1.5">
                        <div className="h-6 w-6 rounded bg-white/25 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                          <Scan size={11} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-0.5 mb-0.5">
                            <span className="h-0.5 w-0.5 rounded-full bg-white animate-pulse" />
                            <span className="text-[5px] font-black text-white/70 uppercase tracking-widest font-sans">Diagnostics</span>
                          </div>
                          <motion.h3 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-[9.5px] font-black text-white uppercase tracking-tight"
                          >
                            Radiology Scans
                          </motion.h3>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      whileHover={{ y: -1 }}
                      onClick={() => {
                        setCurrentPage("about");
                        scrollToServices();
                      }}
                      className="min-w-[150px] group cursor-pointer relative overflow-hidden rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 p-1.5 shadow border border-white/5 snap-center"
                    >
                      <div className="absolute top-0 right-0 p-0.5 opacity-5 group-hover:scale-105 transition-transform">
                        <Stethoscope size={30} strokeWidth={1} />
                      </div>
                      <div className="relative z-10 flex items-center gap-1.5">
                        <div className="h-6 w-6 rounded bg-white/25 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                          <Stethoscope size={11} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-0.5 mb-0.5">
                            <span className="h-0.5 w-0.5 rounded-full bg-white animate-pulse text-emerald-300" />
                            <span className="text-[5px] font-black text-white/70 uppercase tracking-widest font-sans">Diagnostics FAQ</span>
                          </div>
                          <motion.h3 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-[9.5px] font-black text-white uppercase tracking-tight"
                          >
                            Lab FAQs & Info
                          </motion.h3>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Quick Search Results Dropdown */}
              <AnimatePresence>
                {showQuickResults && search.length > 1 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-2 right-2 top-full mt-2 max-h-[400px] overflow-y-auto rounded-2xl bg-white shadow-xl border border-slate-150 z-50 p-3"
                  >
                    <div className="flex items-center justify-between mb-3 px-1">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-450 font-sans">Quick Results ({filteredTests.length})</p>
                      <button onClick={() => setShowQuickResults(false)} className="text-slate-450 hover:text-slate-600 transition-colors">
                        <X size={12} />
                      </button>
                    </div>
                    
                    {filteredTests.length > 0 ? (
                      <div className="space-y-2">
                        {filteredTests.slice(0, 16).map((test) => (
                          <div 
                            key={test.id}
                            onClick={() => {
                              setSearch(test.name);
                              setShowQuickResults(false);
                              setPreviewTest(test);
                              scrollToServices();
                            }}
                            className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-2xl hover:bg-slate-50 hover:shadow-md border border-slate-100 transition-all text-left group cursor-pointer gap-3 bg-white"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className={`p-2 rounded-xl shrink-0 ${
                                test.category === "Blood" 
                                  ? "bg-rose-50 text-rose-500 border border-rose-100" 
                                  : test.category === "Radiology"
                                  ? "bg-blue-50 text-blue-500 border border-blue-105"
                                  : "bg-amber-50 text-amber-500 border border-amber-100"
                              }`}>
                                <Activity size={14} className="animate-pulse" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-extrabold text-slate-900 group-hover:text-dark-lavender transition-all leading-snug">
                                  {test.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <span className={`text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                    test.category === "Blood"
                                      ? "bg-rose-100 text-rose-800"
                                      : "bg-orange-100 text-orange-600"
                                  }`}>
                                    {test.category === "Blood" ? "Blood Test" : test.category === "Radiology" ? "Imaging/Scan" : "Wellness Care"}
                                  </span>
                                  <span className="text-[8px] font-bold text-slate-400 truncate max-w-[200px] uppercase tracking-wider">
                                    {test.details}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                              <div className="text-left sm:text-right">
                                <p className="text-[9px] text-red-500 font-bold line-through">₹{test.originalPrice || (test.price * 2.0).toFixed(0)}</p>
                                <p className="text-sm font-black text-slate-900">₹{test.price.toFixed(0)}</p>
                              </div>
                              {cart.find(t => t.id === test.id) ? (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromCart(test.id);
                                  }}
                                  className="bg-emerald-50 text-emerald-600 border border-[#25D366]/20 hover:bg-emerald-100 transition-all text-[8px] font-black uppercase px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm shrink-0 whitespace-nowrap cursor-pointer active:scale-95"
                                >
                                  <CheckCircle2 size={10} strokeWidth={3} className="text-emerald-500 animate-bounce" /> Added
                                </button>
                              ) : (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(test);
                                    setShowQuickResults(false);
                                  }}
                                  className="bg-gradient-to-r from-dark-lavender to-electrical-purple text-white px-3 py-1.5 rounded-xl hover:bg-slate-950 transition-all shadow-sm flex items-center gap-1 cursor-pointer hover:scale-105 shrink-0 whitespace-nowrap active:scale-95 text-[8.5px] font-black uppercase tracking-wider"
                                >
                                  <Plus size={10} strokeWidth={3} />
                                  <span>Add to Cart</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <Search size={22} className="text-slate-205 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">
                          No products found.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-4 h-12">
            {/* A sweet clean left title of where we are */}
            <div className="flex items-center gap-1.5 text-slate-800 shrink-0">
              <span className="h-2 w-2 rounded-full bg-vivid-teal animate-pulse shrink-0" />
              <h2 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] font-sans truncate max-w-[150px] sm:max-w-none">
                {currentPage === "all-tests" && "All Diagnostics & Tests"}
                {currentPage === "blood-tests" && "All Blood Tests"}
                {currentPage === "radiology" && "Radiology & Scans"}
                {currentPage === "wellness" && "Wellness Packages"}
                {currentPage === "about" && "Lab Info & Patient FAQs"}
              </h2>
            </div>
 
            {/* Simple Compact Search Box */}
            <div className="relative max-w-[420px] sm:max-w-md w-full group" ref={searchRef}>
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-blue-400 group-focus-within:text-blue-500 transition-colors" size={11} />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search for test packages..."
                className="w-full rounded-lg border border-blue-200 bg-blue-50/60 hover:bg-blue-50/90 hover:border-blue-300 focus:border-blue-500 focus:bg-white text-slate-900 focus:text-slate-900 placeholder:text-blue-500/80 focus:placeholder:text-blue-600 text-[10px] font-bold py-1 px-8 pr-7 outline-none transition-all shadow-sm placeholder:font-bold italic"
                value={search}
                onFocus={() => setShowQuickResults(true)}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearch(val);
                  setShowQuickResults(true);
                  if (val === "1499" || val.includes("1499")) {
                    scrollTo1499Package();
                  }
                }}
              />
              {search && (
                <button 
                  onClick={() => {
                    setSearch("");
                    setShowQuickResults(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={11} />
                </button>
              )}

              {/* Quick Search Results Dropdown inside the compact search wrapper */}
              <AnimatePresence>
                {showQuickResults && search.length > 1 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 top-full mt-2 w-[280px] sm:w-[500px] max-h-[350px] overflow-y-auto rounded-2xl bg-white shadow-xl border border-slate-150 z-50 p-3"
                  >
                    <div className="flex items-center justify-between mb-3 px-1">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 font-sans">Quick Results ({filteredTests.length})</p>
                      <button onClick={() => setShowQuickResults(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={12} />
                      </button>
                    </div>
                    
                    {filteredTests.length > 0 ? (
                      <div className="space-y-1.5">
                        {filteredTests.slice(0, 10).map((test) => (
                          <div 
                            key={test.id}
                            onClick={() => {
                              setSearch(test.name);
                              setShowQuickResults(false);
                              setPreviewTest(test);
                              scrollToServices();
                            }}
                            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 hover:shadow-sm border border-slate-100 transition-all text-left group cursor-pointer gap-2 bg-white"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className={`p-1.5 rounded-lg shrink-0 ${
                                test.category === "Blood" 
                                  ? "bg-rose-50 text-rose-500 border border-rose-100" 
                                  : test.category === "Radiology"
                                  ? "bg-blue-50 text-blue-500 border border-blue-100"
                                  : "bg-amber-50 text-amber-500 border border-amber-100"
                              }`}>
                                <Activity size={12} className="animate-pulse" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-extrabold text-slate-900 group-hover:text-dark-lavender transition-all leading-snug truncate">
                                  {test.name}
                                </p>
                                <p className="text-[8px] font-bold text-slate-400 truncate uppercase mt-0.5">
                                  {test.details}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 shrink-0">
                              <div className="text-right">
                                <p className="text-[10px] font-black text-slate-900">₹{test.price.toFixed(0)}</p>
                              </div>
                              {cart.find(t => t.id === test.id) ? (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromCart(test.id);
                                  }}
                                  className="bg-emerald-50 text-emerald-600 border border-[#25D366]/20 text-[8px] font-black uppercase px-2 py-1 rounded-lg flex items-center gap-0.5"
                                >
                                  <CheckCircle2 size={9} className="text-emerald-500 animate-bounce" /> Added
                                </button>
                              ) : (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(test);
                                    setShowQuickResults(false);
                                  }}
                                  className="bg-gradient-to-r from-dark-lavender to-electrical-purple text-white px-2 py-1 rounded-lg hover:bg-slate-950 text-[8px] font-black uppercase tracking-wider"
                                >
                                  <Plus size={8} strokeWidth={3} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center">
                        <Search size={18} className="text-slate-200 mx-auto mb-1.5" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          No products found.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      <main>
        {currentPage === "home" && (
          <section style={{ backgroundColor: '#fee7e7' }} className="relative overflow-hidden text-slate-950 py-8 md:py-10 px-4 sm:px-6 lg:px-8 border-b border-[#fecdd3]/40">
            {/* Ambient visual mesh - soft warm glow overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/30 via-transparent to-transparent opacity-85" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

            <div className="max-w-7xl mx-auto relative z-10 flex flex-col xl:flex-row items-center justify-between gap-6">
              {/* Left Column: Core Value Proposition */}
              <div className="flex-1 text-left max-w-2xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-slate-950/10 text-slate-900 rounded-full border border-slate-950/20 text-[8px] font-black uppercase tracking-widest mb-3">
                  <ShieldCheck size={10} className="text-slate-900" /> NABL Accredited Partner Lab
                </div>
                <h1 className="text-2xl md:text-4xl font-black font-display uppercase tracking-tight italic leading-none mb-3">
                  AARVIK <span className="text-[#a80053]">HEALTH LABS</span> <br />
                  <span className="text-slate-900 text-lg md:text-2xl">60 MINUTES DIAGNOSTIC SERVICES</span>
                </h1>
                <p className="text-[11px] md:text-xs text-slate-900 font-bold uppercase leading-relaxed tracking-wider mb-4">
                  Experience premium, zero-error pathology & wellness screenings. Our expert phlebotomist reaches your location in Kondapur in 60 minutes. Digital reports delivered in under 8 hours.
                </p>

                {/* Instant Action Stats */}
                <div className="grid grid-cols-3 gap-3 border-t border-slate-950/15 pt-3.5 mb-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-black text-slate-950 font-display italic">60 MINS</h3>
                    <p className="text-[7px] font-black text-slate-800 uppercase tracking-widest leading-none mt-1">Home Collection</p>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black text-slate-950 font-display italic">8 HOURS</h3>
                    <p className="text-[7px] font-black text-slate-800 uppercase tracking-widest leading-none mt-1">Reports TAT 8 Hrs</p>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black text-slate-950 font-display italic">300k+</h3>
                    <p className="text-[7px] font-black text-slate-800 uppercase tracking-widest leading-none mt-1">Patients Served</p>
                  </div>
                </div>

                {/* Main Instant CTA Buttons */}
                <div className="flex flex-wrap gap-2.5">
                  <button 
                    onClick={() => {
                      setCurrentPage("blood-tests");
                      scrollToServices();
                    }}
                    className="px-5 py-2.5 bg-[#14b6a2] hover:bg-[#119e8c] text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingCart size={11} /> Book Online Test
                  </button>
                  <a 
                    href="https://wa.me/918328139956?text=Hi%2C%20I%20want%20to%20book%20a%20health%2520test%20or%2520package."
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-1.5"
                  >
                    <MessageCircle fill="currentColor" size={11} /> Book via WhatsApp
                  </a>
                </div>
              </div>

              {/* Right Column: Prominent Indian Home Sample Collection Image */}
              <div className="w-full xl:w-[480px] bg-blue-950/45 rounded-[2.5rem] p-2.5 border-2 border-blue-500/25 shadow-[0_20px_50px_rgba(59,130,246,0.15)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10 opacity-70" />
                <div className="absolute top-3 right-3 z-20 px-3 py-1 bg-blue-600 text-white rounded-full text-[8px] font-black uppercase tracking-widest shadow-md">
                  🏡 Premium Home Service
                </div>
                <div className="w-full h-[320px] xl:h-[380px] rounded-[2rem] overflow-hidden">
                  <img 
                    src="/src/assets/images/indian_home_blood_sample_collection_1779701625135.png" 
                    alt="Aarvik Diagnostics Home Sample Collection - Indian Style" 
                    className="w-full h-full object-cover rounded-[2rem] transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Float glassmorphic card showcasing professional service */}
                <div className="absolute bottom-5 left-5 right-5 z-20 bg-slate-950/85 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-lg text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[7px] font-black text-blue-400 uppercase tracking-[0.2em] block mb-0.5">certified phlebotomist</span>
                      <h4 className="text-xs font-black text-white uppercase italic tracking-wider">Sterile Blood Collection</h4>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-black tracking-widest uppercase">
                      <Home size={10} /> Active
                    </div>
                  </div>
                  <p className="text-[9.5px] text-slate-400 font-bold leading-normal mt-2 border-t border-white/5 pt-2">
                    Our certified healthcare representative will visit your home in complete protective medical gear & secure cold-storage containers.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Horizontal 3-Step Live Booking Journey banner */}
        {currentPage === "home" && (
          <section className="bg-slate-900 border-b border-slate-800 py-6 text-white px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left shrink-0">
                <span className="text-[8px] font-black text-[#14b6a2] uppercase tracking-[0.25em]">instant bookings</span>
                <h3 className="text-lg font-black uppercase italic tracking-tight font-display text-white">How Booking Works</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {[
                  { step: "01", icon: ShoppingCart, title: "Select Test or Package", desc: "Select blood tests, imaging or full wellness profiles online or by phone." },
                  { step: "02", icon: Home, title: "60-Min Home Sample Collection", desc: "Our certified specialist phlebotomist visits with sterile cold-chain storage." },
                  { step: "03", icon: CheckCircle2, title: "Encrypted WhatsApp Report", desc: "Get highly scrutinized smart reports directly on your registered WhatsApp." },
                ].map((step, idx) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={idx} className="flex gap-3.5 p-3 rounded-2xl bg-slate-950/40 border border-slate-800 text-left hover:bg-slate-950/60 transition-all">
                      <div className="h-9 w-9 shrink-0 rounded-xl bg-teal-900/40 border border-teal-500/25 flex items-center justify-center text-[#14b6a2] text-xs font-black">
                        {step.step}
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black text-white uppercase tracking-wider">{step.title}</h4>
                        <p className="text-[9px] text-slate-400 font-bold leading-normal mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Aarvik Grand Opening Greetings & Promotion Section */}
        {currentPage === "home" && (
          <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200/60 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-8">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 text-rose-600 rounded-full border border-rose-100 text-[9px] font-black uppercase tracking-widest shadow-sm">
                  🎊 Grand Launch Celebrations
                </span>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight italic text-slate-900 mt-2 font-display leading-tight">
                  AARVIK <span className="text-[#ff4d80]">HEALTH LABS</span> INAUGURAL CELEBRATION
                </h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1.5 max-w-2xl mx-auto">
                  To celebrate our grand launch, use and share these premium, high-converting invitation templates representing our state-of-the-art services & exclusive opening discounts!
                </p>
              </div>

              {/* Grid Layout: Left: Inaugural Highlights, Right: Greetings Interactive Station */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Left: Beautiful Golden Inaugural Banner Card */}
                <div className="lg:col-span-4 rounded-3xl bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-900 p-6 md:p-8 flex flex-col justify-between border-2 border-amber-500/30 shadow-[0_20px_40px_rgba(245,158,11,0.08)] relative overflow-hidden group">
                  <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-amber-500/20 blur-2xl group-hover:bg-amber-500/30 duration-700 transition-all pointer-events-none" />
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600"></div>

                  <div className="relative text-left">
                    <span className="text-[8px] font-black tracking-[0.2em] text-amber-400 uppercase bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded-md">GRAND OPENING BUZZ</span>
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tight font-display mt-4 leading-none">AARVIK INAUGURAL</h3>
                    <h4 className="text-2xl font-black text-amber-400 italic font-display uppercase leading-tight">SPECIAL OFFERS</h4>
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-2.5">
                      We are setting pioneering benchmarks with high-throughput laboratory automation & sterile doorstep collection. Enjoy premium health profiles at launch-friendly pricing.
                    </p>

                    <ul className="mt-6 space-y-3">
                      {[
                        { title: "FLAT 50% LAUNCH DISCOUNT", desc: "Applicable online across all advanced health profiles & single blood tests." },
                        { title: "FREE HOME VISIT COLLECTION", desc: "No minimum booking amount limit within Kondapur-Hyderabad & Zaheerabad." },
                        { title: "FREE DIABETIC & LIPID SCORECARDS", desc: "Free comprehensive physician-interpreted scoring checklist with report." }
                      ].map((offer, i) => (
                        <li key={i} className="flex gap-2.5 items-start">
                          <div className="h-5 w-5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-[10px] shrink-0 font-bold">
                            ✓
                          </div>
                          <div>
                            <h5 className="text-[9px] font-black text-slate-100 uppercase tracking-wide leading-none">{offer.title}</h5>
                            <p className="text-[8.5px] text-slate-400 font-medium leading-normal mt-0.5">{offer.desc}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-slate-800 pt-5 mt-6 text-left relative z-15">
                    <span className="text-[7.5px] text-slate-500 font-black uppercase tracking-widest block">GRAND LAUNCH HOTLINE</span>
                    <a 
                      href="tel:+918328139956" 
                      className="text-lg font-black text-white hover:text-amber-400 transition-colors tracking-tight flex items-center gap-1.5 mt-0.5"
                    >
                      📞 +91 8328139956
                    </a>
                  </div>
                </div>

                {/* Right: Beautiful Greeting Message Station */}
                <div className="lg:col-span-8 rounded-3xl bg-white border border-slate-200 shadow-md p-5 flex flex-col justify-between">
                  <div>
                    {/* Navigation Tabs */}
                    <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-100">
                      {[
                        { title: "🌟 VVIP VIP Greeting", badge: "EXCLUSIVE" },
                        { title: "💖 తెలుగు + Eng Festive", badge: "POPULAR" },
                        { title: "🛡️ Comprehensive Saver", badge: "BUZZ" }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setActiveMsgTemplate(idx);
                            setCopiedIndicator(false);
                          }}
                          className={`px-3.5 py-2.5 rounded-2xl flex items-center gap-2 select-none cursor-pointer transition-all duration-300 border text-left flex-1 min-w-[140px] ${
                            activeMsgTemplate === idx
                              ? "bg-slate-950 text-white border-slate-950 shadow-md scale-[1.01]"
                              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                          }`}
                        >
                          <div className={`h-2 w-2 rounded-full ${activeMsgTemplate === idx ? "bg-[#ff4d80] animate-pulse" : "bg-slate-400"}`} />
                          <div className="flex flex-col leading-none">
                            <span className="text-[10px] font-black uppercase tracking-wide">{item.title}</span>
                            <span className={`text-[6.5px] font-black uppercase tracking-widest mt-0.5 ${activeMsgTemplate === idx ? "text-[#ff4d80]" : "text-slate-400"}`}>
                              {item.badge}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Preview / Copy Terminal Panel */}
                    <div className="mt-4 relative bg-slate-950 rounded-2xl p-4 md:p-5 border border-slate-800 text-left">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-3 select-none">
                        <span className="text-[7.5px] font-black uppercase tracking-[0.25em] text-[#ff4d80] animate-pulse">● LIVE WHATSAPP GREETING PREVIEW</span>
                        <div className="flex gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                          <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        </div>
                      </div>

                      <div className="max-h-[220px] overflow-y-auto pr-1 text-slate-300 font-mono text-[9.5px] leading-relaxed whitespace-pre-wrap selection:bg-[#ff4d80]/30 scrollbar-thin scrollbar-thumb-slate-800">
                        {activeMsgTemplate === 0 && (
                          <>
                            {"✨ "}<strong>*AARVIK HEALTH LABS - GRAND OPENING INVITATION*</strong>{" ✨\n"}
                            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{"\n"}
                            Dear Patron,{"\n\n"}
                            We are proud to announce the Grand Launch of <strong>*Aarvik Health Labs*</strong> – your state-of-the-art diagnostic partner in Hyderabad (Kondapur) & Zaheerabad! 🏥🏆{"\n\n"}
                            Experience the future of medical pathology with zero-error clinical precision:{"\n"}
                            💉 <strong>*FREE Senior Phlebotomist visit to your doorsteps in 60 Minutes!*</strong>{"\n"}
                            🏆 <strong>*FLAT 50% SPECIAL DISCOUNTS across ALL Blood Tests & Full Body Wellness Packages!*</strong>{"\n"}
                            🔬 Certified NABL-Accredited Labs | Fast 8-Hour Digital Reports on WhatsApp.{"\n\n"}
                            📝 <strong>*To Book Your Grand Opening Health Screening:*</strong>{"\n"}
                            👉 Message us right here on WhatsApp!{"\n"}
                            📞 Call us instantly: +91 8328139956{"\n"}
                            🌐 Book online: https://aarvikhealthlabs.com{"\n\n"}
                            <em>_Aarvik Health Labs – Science. Health. Future. Since 2026_</em>{"\n"}
                            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                          </>
                        )}
                        {activeMsgTemplate === 1 && (
                          <>
                            {"✨ "}<strong>*ఆర్విక్ హెల్త్ లాబ్స్ - GRAND OPENING SPECIAL OFFER!*</strong>{" ✨\n"}
                            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{"\n"}
                            మీ ఆరోగ్యం, మా బాధ్యత! 🤝 Aarvik Health Labs ఇప్పుడు మీ కొండాపూర్ & జహీరాబాద్ లలలో ప్రారంభించబడింది.{"\n\n"}
                            హై-ఎండ్ రోబోటిక్ ల్యాబ్స్ మరియు నిపుణులైన డాక్టర్ల పర్యవేక్షణలో ఖచ్చితమైన బ్లడ్ టెస్ట్ రిపోర్ట్స్ కేవలం 8 గంటల్లోనే మీ వాట్సాప్ లో అందుతాయి.{"\n\n"}
                            🎁 <strong>*గ్రాండ్ ఓపెనింగ్ ప్రత్యేక ఆఫర్లు:*</strong>{"\n"}
                            🔥 అన్ని రకాల రక్త పరీక్షలపై (All Blood Tests & Packages) <strong>*FLAT 50% OFF!*</strong>{"\n"}
                            🏡 <strong>*ఫీజు లేకుండా ఉచిత హోమ్ శాంపిల్ కలెక్షన్!*</strong> (మా సీనియర్ స్టాఫ్ 60 నిమిషాల్లో మీ ఇంటికి వస్తారు){"\n\n"}
                            📅 <strong>*బుకింగ్ కొరకు ఇప్పుడే సంప్రదించండి:*</strong>{"\n"}
                            📞 ఫోన్ ద్వారా: +91 8328139956{"\n"}
                            💬 వాట్సాప్ ద్వారా: wa.me/918328139956{"\n"}
                            🌐 ఆన్లైన్ లో: https://aarvikhealthlabs.com{"\n\n"}
                            <em>_Aarvik Health Labs - Accurate diagnostics at your doorsteps._</em>{"\n"}
                            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                          </>
                        )}
                        {activeMsgTemplate === 2 && (
                          <>
                            🔬 <strong>*AARVIK DIAGNOSTICS - COMPLETE HEALTH & WELLNESS LAUNCH*</strong> 🔬{"\n"}
                            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{"\n"}
                            Protect your loved ones with Aarvik's premium wellness screenings. Our expert home pathology is now live for Hyderabad & Zaheerabad!{"\n\n"}
                            🎉 <strong>*Grand Opening Super-Saver Offers:*</strong>{"\n"}
                            🌟 <strong>*All Vital Tests (Liver, Kidney, Thyroid, Diabetes, Cholesterol, Complete Blood Picture) - ALL integrated in single customizable packages at 50% Launch Price!*</strong>{"\n"}
                            📦 FREE Cold-Chain transport & safety-sealed blood extraction.{"\n\n"}
                            👩‍⚕️ Our senior, certified phlebotomists ensure safe, hygienic, single-prick pediatric and geriatric care.{"\n\n"}
                            📲 <strong>*Instant Support & Slot Booking:*</strong>{"\n"}
                            👉 Send your test names on WhatsApp for instant quote!{"\n"}
                            📞 Hot Line: +91 8328139956{"\n"}
                            💚 wa.me/918328139956{"\n\n"}
                            <em>_Stay ahead of illness, invest in wellness._</em>{"\n"}
                            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        let textToCopy = "";
                        if (activeMsgTemplate === 0) {
                          textToCopy = "✨ *AARVIK HEALTH LABS - GRAND OPENING INVITATION* ✨\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nDear Patron, \n\nWe are proud to announce the Grand Launch of *Aarvik Health Labs* – your state-of-the-art diagnostic partner in Hyderabad (Kondapur) & Zaheerabad! 🏥🏆\n\nExperience the future of medical pathology with zero-error clinical precision:\n💉 *FREE Senior Phlebotomist visit to your doorsteps in 60 Minutes!*\n🏆 *FLAT 50% SPECIAL DISCOUNTS across ALL Blood Tests & Full Body Wellness Packages!*\n🔬 Certified NABL-Accredited Labs | Fast 8-Hour Digital Reports on WhatsApp.\n\n📝 *To Book Your Grand Opening Health Screening:*\n👉 Message us right here on WhatsApp!\n📞 Call us instantly: +91 8328139956\n🌐 Book online: https://aarvikhealthlabs.com\n\n_Aarvik Health Labs – Science. Health. Future. Since 2026_\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
                        } else if (activeMsgTemplate === 1) {
                          textToCopy = "✨ *ఆర్విక్ హెల్త్ లాబ్స్ - GRAND OPENING SPECIAL OFFER!* ✨\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nమీ ఆరోగ్యం, మా బాధ్యత! 🤝 Aarvik Health Labs ఇప్పుడు మీ కొండాపూర్ & జహీరాబాద్ లలలో ప్రారంభించబడింది.\n\nహై-ఎండ్ రోబోటిక్ ల్యాబ్స్ మరియు నిపుణులైన డాక్టర్ల పర్యవేక్షణలో ఖచ్చితమైన బ్లడ్ టెస్ట్ రిపోర్ట్స్ కేవలం 8 గంటల్లోనే మీ వాట్సాప్ లో అందుతాయి.\n\n🎁 *గ్రాండ్ ఓపెనింగ్ ప్రత్యేక ఆఫర్లు:*\n🔥 అన్ని రకాల రక్త పరీక్షలపై (All Blood Tests & Packages) *FLAT 50% OFF!*\n🏡 *ఫీజు లేకుండా ఉచిత హోమ్ శాంపిల్ కలెక్షన్!* (మా సీనియర్ స్టాఫ్ 60 నిమిషాల్లో మీ ఇంటికి వస్తారు)\n\n📅 *బుకింగ్ కొరకు ఇప్పుడే సంప్రదించండి:*\n📞 ఫోన్ ద్వారా: +91 8328139956\n💬 వాట్సాప్ ద్వారా: wa.me/918328139956\n🌐 ఆన్లైన్ లో: https://aarvikhealthlabs.com\n\n_Aarvik Health Labs - Accurate diagnostics at your doorsteps._\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
                        } else {
                          textToCopy = "🔬 *AARVIK DIAGNOSTICS - COMPLETE HEALTH & WELLNESS LAUNCH* 🔬\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nProtect your loved ones with Aarvik's premium wellness screenings. Our expert home pathology is now live for Hyderabad & Zaheerabad!\n\n🎉 *Grand Opening Super-Saver Offers:*\n🌟 *All Vital Tests (Liver, Kidney, Thyroid, Diabetes, Cholesterol, Complete Blood Picture) - ALL integrated in single customizable packages at 50% Launch Price!*\n📦 FREE Cold-Chain transport & safety-sealed blood extraction.\n\n👩‍⚕️ Our senior, certified phlebotomists ensure safe, hygienic, single-prick pediatric and geriatric care.\n\n📲 *Instant Support & Slot Booking:*\n👉 Send your test names on WhatsApp for instant quote!\n📞 Hot Line: +91 8328139956\n💚 wa.me/918328139956\n\n_Stay ahead of illness, invest in wellness._\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
                        }
                        navigator.clipboard.writeText(textToCopy);
                        setCopiedIndicator(true);
                        setTimeout(() => setCopiedIndicator(false), 2500);
                        setNotifications(prev => [{ id: Date.now().toString(), text: "Inaugural greeting template copied to dashboard clipboard success! Ready to paste and broadcast.", type: "patient" }, ...prev]);
                      }}
                      className="flex-1 py-3.5 rounded-2xl border border-slate-300 hover:border-slate-800 text-slate-900 font-extrabold text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2 select-none cursor-pointer"
                    >
                      {copiedIndicator ? (
                        <>
                          Copied! <CheckCircle2 size={13} className="text-[#ff4d80]" />
                        </>
                      ) : (
                        <>
                          Copy Selected Greetings <Copy size={13} />
                        </>
                      )}
                    </button>

                    <a
                      href={`https://wa.me/918328139956?text=${encodeURIComponent(
                        activeMsgTemplate === 0 
                          ? "✨ *AARVIK HEALTH LABS - GRAND OPENING INVITATION* ✨\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nDear Patron, \n\nWe are proud to announce the Grand Launch of *Aarvik Health Labs* – your state-of-the-art diagnostic partner in Hyderabad (Kondapur) & Zaheerabad! 🏥🏆\n\nExperience the future of medical pathology with zero-error clinical precision:\n💉 *FREE Senior Phlebotomist visit to your doorsteps in 60 Minutes!*\n🏆 *FLAT 50% SPECIAL DISCOUNTS across ALL Blood Tests & Full Body Wellness Packages!*\n🔬 Certified NABL-Accredited Labs | Fast 8-Hour Digital Reports on WhatsApp.\n\n📝 *To Book Your Grand Opening Health Screening:*\n👉 Message us right here on WhatsApp!\n📞 Call us instantly: +91 8328139956\n🌐 Book online: https://aarvikhealthlabs.com\n\n_Aarvik Health Labs – Science. Health. Future. Since 2026_\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                          : activeMsgTemplate === 1
                          ? "✨ *ఆర్విక్ హెల్త్ లాబ్స్ - GRAND OPENING SPECIAL OFFER!* ✨\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nమీ ఆరోగ్యం, మా బాధ్యత! 🤝 Aarvik Health Labs ఇప్పుడు మీ కొండాపూర్ & జహీరాబాద్ లలలో ప్రారంభించబడింది.\n\nహై-ఎండ్ రోబోటిక్ ల్యాబ్స్ మరియు నిపుణులైన డాక్టర్ల పర్యవేక్షణలో ఖచ్చితమైన బ్లడ్ టెస్ట్ రిపోర్ట్స్ కేవలం 8 గంటల్లోనే మీ వాట్సాప్ లో అందుతాయి.\n\n🎁 *గ్రాండ్ ఓపెనింగ్ ప్రత్యేక ఆఫర్లు:*\n🔥 అన్ని రకాల రక్త పరీక్షలపై (All Blood Tests & Packages) *FLAT 50% OFF!*\n🏡 *ఫీజు లేకుండా ఉచిత హోమ్ శాంపిల్ కలెక్షన్!* (మా సీనియర్ స్టాఫ్ 60 నిమిషాల్లో మీ ఇంటికి వస్తారు)\n\n📅 *బుకింగ్ కొరకు ఇప్పుడే సంప్రదించండి:*\n📞 ఫోన్ ద్వారా: +91 8328139956\n💬 వాట్సాప్ ద్వారా: wa.me/918328139956\n🌐 ఆన్లైన్ లో: https://aarvikhealthlabs.com\n\n_Aarvik Health Labs - Accurate diagnostics at your doorsteps._\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                          : "🔬 *AARVIK DIAGNOSTICS - COMPLETE HEALTH & WELLNESS LAUNCH* 🔬\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nProtect your loved ones with Aarvik's premium wellness screenings. Our expert home pathology is now live for Hyderabad & Zaheerabad!\n\n🎉 *Grand Opening Super-Saver Offers:*\n🌟 *All Vital Tests (Liver, Kidney, Thyroid, Diabetes, Cholesterol, Complete Blood Picture) - ALL integrated in single customizable packages at 50% Launch Price!*\n📦 FREE Cold-Chain transport & safety-sealed blood extraction.\n\n👩‍⚕️ Our senior, certified phlebotomists ensure safe, hygienic, single-prick pediatric and geriatric care.\n\n📲 *Instant Support & Slot Booking:*\n👉 Send your test names on WhatsApp for instant quote!\n📞 Hot Line: +91 8328139956\n💚 wa.me/918328139956\n\n_Stay ahead of illness, invest in wellness._\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold text-[11px] uppercase tracking-widest hover:shadow-lg hover:brightness-105 transition-all text-center flex items-center justify-center gap-2"
                    >
                      <MessageCircle fill="currentColor" size={13} />
                      Send via WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Services / Tests Grid Section */}
        {(currentPage === "home" || currentPage === "all-tests" || currentPage === "blood-tests" || currentPage === "radiology" || currentPage === "wellness") && (
          <section id="services" className="bg-white pt-3 pb-8 border-t border-slate-100">
            <div className="max-w-7xl px-4 md:px-6 mx-auto">
              <div className="flex flex-col items-start justify-start text-left gap-3 mb-3">
                
                {currentPage === "radiology" && (
                  <div className="w-full bg-gradient-to-r from-blue-50 via-indigo-50/40 to-blue-50 border border-blue-200/80 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-blue-100/40 blur-2xl pointer-events-none" />
                    <div className="flex gap-4 items-start text-left">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                        <Scan size={20} className="animate-pulse" />
                      </div>
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[8.5px] font-black uppercase tracking-wider mb-2 border border-blue-200">
                          📍 Center Visit Required
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase italic tracking-tight font-display">
                          RADIOLOGY TEST VISIT TO CENTER IN PARTNER LABS
                        </h3>
                        <p className="text-[11px] text-slate-500 font-bold uppercase leading-relaxed tracking-wider mt-1.5 max-w-2xl">
                          Please note: Home collection is not applicable for X-Rays, Ultrasounds, Dopplers, and Echo Scans. Appointments are pre-booked online with Aarvik Health Labs, and scans are performed professionally at our certified, state-of-the-art accredited partner labs.
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 w-full md:w-auto text-left md:text-right border-t md:border-t-0 pt-4 md:pt-0 border-blue-100">
                      <span className="text-[7.5px] text-slate-400 font-extrabold uppercase tracking-widest block font-sans">INSTANT SUPPORT SHIELD</span>
                      <a 
                        href="https://wa.me/918328139956?text=Hi%20Aarvik%20Health%20Labs%2C%20I%20want%20to%20know%20more%20about%20Radiology%20Center%20Visit%20and%20avail%20special%20discount%20offers."
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 mt-1 px-4 py-2 bg-slate-950 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-md cursor-pointer select-none"
                      >
                        <MessageCircle fill="currentColor" size={11} /> Help & Slot Booking
                      </a>
                    </div>
                  </div>
                )}

              {/* Quick Jump Shortcuts for Wellness Packages */}
              {currentPage === "wellness" && !search && (
                <div className="w-full flex flex-col items-start gap-2 bg-gradient-to-r from-orange-50 via-rose-50/20 to-orange-50/40 border border-orange-200/50 rounded-2xl p-4.5 mb-6 text-left shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Quick Package Shortcut & Search Tag</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <button
                      onClick={() => scrollTo1499Package()}
                      className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer border-none"
                    >
                      ⭐ Fit India Full Body (₹1499)
                    </button>
                    <button
                      onClick={() => {
                        const target = document.getElementById("package-w2");
                        if (target) {
                          const yOffset = -150;
                          const y = target.getBoundingClientRect().top + window.scrollY + yOffset;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                          target.classList.add("ring-8", "ring-orange-500/20");
                          setTimeout(() => target.classList.remove("ring-8", "ring-orange-500/20"), 1500);
                        }
                      }}
                      className="px-3 py-1.5 bg-white text-slate-800 border border-slate-200 hover:border-slate-350 rounded-xl text-[10px] font-black uppercase tracking-wider active:scale-95 transition-all shadow-sm cursor-pointer"
                    >
                      ⚡ Fasting Metabolic (₹999)
                    </button>
                    <button
                      onClick={() => {
                        const target = document.getElementById("package-w10");
                        if (target) {
                          const yOffset = -150;
                          const y = target.getBoundingClientRect().top + window.scrollY + yOffset;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                          target.classList.add("ring-8", "ring-orange-500/20");
                          setTimeout(() => target.classList.remove("ring-8", "ring-orange-500/20"), 1500);
                        }
                      }}
                      className="px-3 py-1.5 bg-white text-slate-800 border border-slate-200 hover:border-slate-350 rounded-xl text-[10px] font-black uppercase tracking-wider active:scale-95 transition-all shadow-sm cursor-pointer"
                    >
                      🩸 Diabetes Care (₹1299)
                    </button>
                    <button
                      onClick={() => {
                        const target = document.getElementById("package-w4");
                        if (target) {
                          const yOffset = -150;
                          const y = target.getBoundingClientRect().top + window.scrollY + yOffset;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                          target.classList.add("ring-8", "ring-orange-500/20");
                          setTimeout(() => target.classList.remove("ring-8", "ring-orange-500/20"), 1500);
                        }
                      }}
                      className="px-3 py-1.5 bg-white text-slate-800 border border-slate-200 hover:border-slate-350 rounded-xl text-[10px] font-black uppercase tracking-wider active:scale-95 transition-all shadow-sm cursor-pointer"
                    >
                      🏢 Platinum Full Body (₹2999)
                    </button>
                  </div>
                </div>
              )}

              {/* Special Custom Layout for Wellness Category (With prominent 1499 slot & horizontal sliding other options) */}
              {currentPage === "wellness" && !search ? (
                <div className="w-full">
                  {/* FEATURED: Aarvik Fit India Full Body Checkup (₹1499 Package) */}
                  <div id="package-1499" className="transition-all duration-500 rounded-3xl p-1 bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 shadow-xl mb-8 -mx-1 sm:mx-0">
                    <div className="rounded-[22px] p-6 text-left relative overflow-hidden text-white" style={{ backgroundColor: '#00b496' }}>
                      {/* Ambient glows */}
                      <div className="absolute top-0 right-0 h-40 w-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                      <div className="absolute bottom-0 left-0 h-40 w-40 bg-white/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none" />
                      
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 relative z-10 w-full animate-pulse">
                        <span className="bg-orange-600 text-white text-[9px] font-black uppercase tracking-[0.2em] px-3.5 py-1 rounded-full shadow">
                          👑 BEST SELLER — CHOSEN BY 80% OF KONDAPUR HOMES
                        </span>
                        <div className="flex items-center gap-1.5 text-[9px] text-white font-black uppercase tracking-widest bg-white/15 px-3 py-1 rounded-full border border-white/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-ping" /> Free Home Sample Pickup
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
                        <div className="lg:col-span-8 text-left">
                          <h3 className="text-xl sm:text-2xl font-black text-white leading-snug tracking-tight uppercase italic flex flex-wrap items-center gap-2">
                            <span>Aarvik Fit India Full Body Checkup</span>
                            <span className="inline-flex items-center px-3 py-1 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 border border-orange-450 shadow-[3px_3px_0px_rgba(0,0,0,0.3)] text-[10.5px] not-italic text-white font-black tracking-widest uppercase">
                              🔥 82 TESTS
                            </span>
                          </h3>
                          <div className="mt-3 flex flex-wrap gap-2 md:gap-2.5 max-w-3xl">
                            {[
                              { label: "Liver", num: "11 Tests", bg: "bg-amber-400 text-slate-900 border-amber-500", shadow: "shadow-[2px_2px_0px_#1e293b]" },
                              { label: "Kidney", num: "8 Tests", bg: "bg-rose-400 text-white border-rose-500", shadow: "shadow-[2px_2px_0px_#1e293b]" },
                              { label: "Lipids", num: "8 Tests", bg: "bg-indigo-500 text-white border-indigo-600", shadow: "shadow-[2px_2px_0px_#1e293b]" },
                              { label: "Thyroid", num: "3 Tests", bg: "bg-cyan-400 text-slate-950 border-cyan-500", shadow: "shadow-[2px_2px_0px_#1e293b]" },
                              { label: "Blood Glucose", num: "1 Test", bg: "bg-emerald-400 text-slate-950 border-emerald-500", shadow: "shadow-[2px_2px_0px_#1e293b]" },
                              { label: "Complete Urine", num: "10 Tests", bg: "bg-purple-500 text-white border-purple-600", shadow: "shadow-[2px_2px_0px_#1e293b]" },
                              { label: "Hemogram Check", num: "28 Tests", bg: "bg-pink-500 text-white border-pink-600", shadow: "shadow-[2px_2px_0px_#1e293b]" },
                              { label: "Vitamin D3", num: "1 Test", bg: "bg-yellow-400 text-slate-950 border-yellow-500", shadow: "shadow-[2px_2px_0px_#1e293b]" },
                              { label: "Vitamin B12", num: "1 Test", bg: "bg-blue-400 text-white border-blue-500", shadow: "shadow-[2px_2px_0px_#1e293b]" },
                              { label: "Iron Studies", num: "10 Tests", bg: "bg-orange-400 text-slate-950 border-orange-500", shadow: "shadow-[2px_2px_0px_#1e293b]" },
                            ].map((item, idx) => (
                              <div 
                                key={idx} 
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border-2 border-slate-900 font-black text-[10.5px] uppercase tracking-wider ${item.bg} ${item.shadow} hover:translate-y-[-1px] transition-transform`}
                              >
                                <span>{item.label}</span>
                                <span className="bg-black/15 text-current px-1.5 py-0.5 rounded-md font-extrabold text-[9px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] ml-1">
                                  {item.num}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Quick details block */}
                          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3 bg-white/10 p-4 rounded-2xl border border-white/15">
                            <div className="flex flex-col">
                              <span className="text-[8px] font-black text-teal-150 uppercase tracking-widest">Reports TAT</span>
                              <span className="text-[10.5px] font-extrabold text-white uppercase mt-0.5">Within 8 Hours</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[8px] font-black text-teal-150 uppercase tracking-widest">Fasting Needed</span>
                              <span className="text-[10.5px] font-extrabold text-white uppercase mt-1.5">10-12 Hrs Fasting</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[8px] font-black text-teal-150 uppercase tracking-widest">Total parameters</span>
                              <span className="text-[10.5px] font-extrabold text-white uppercase mt-0.5">82 Checked</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[8px] font-black text-teal-150 uppercase tracking-widest">Certifications</span>
                              <span className="text-[10.5px] font-extrabold text-amber-300 uppercase mt-0.5">NABL Accredited</span>
                            </div>
                          </div>
                        </div>

                        <div className="lg:col-span-4 flex flex-col justify-between bg-white/10 p-5 rounded-2xl border border-white/15 min-h-[160px]">
                          <div>
                            <span className="text-[9px] font-black text-teal-100 uppercase tracking-widest block text-left mb-1">ACCESSIBLE LAB LABELS</span>
                            <div className="flex items-baseline gap-1.5 text-left flex-wrap">
                              <span className="text-3xl font-black text-white tracking-tight leading-none">₹1499</span>
                              <span className="text-xs font-black text-teal-100/60 line-through">₹5600</span>
                              <span className="text-[9px] text-green-600 font-black bg-white px-1.5 py-0.5 rounded border border-white uppercase tracking-widest shadow-sm">73% OFF</span>
                            </div>
                            <p className="text-[8px] text-teal-50 font-extrabold uppercase tracking-wider mt-1.5 text-left">No hidden extra charges. Zero collection fee.</p>
                          </div>

                          <div className="flex items-center gap-2 mt-4">
                            {cart.find(t => t.id === "w_complete") ? (
                              <button
                                onClick={() => removeFromCart("w_complete")}
                                className="flex-1 bg-white text-emerald-700 font-black text-xs uppercase tracking-wider py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow cursor-pointer border-none"
                              >
                                <CheckCircle2 size={13} strokeWidth={3} /> Added to Cart
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  const compTest = TESTS.find(t => t.id === "w_complete");
                                  if (compTest) addToCart(compTest);
                                }}
                                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow cursor-pointer border-none"
                              >
                                <Plus size={13} strokeWidth={3} /> Add To Bookings
                              </button>
                            )}
                            <button
                              onClick={() => {
                                const compTest = TESTS.find(t => t.id === "w_complete");
                                if (compTest) setPreviewTest(compTest);
                              }}
                              className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl cursor-pointer border-none"
                              title="Explore Details"
                            >
                              <Activity size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Heading header for supplementary specialist packages */}
                  <div className="w-full text-left mt-8 mb-4 border-t border-slate-100 pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-2">
                        <div className="h-5 w-1.5 rounded-full bg-orange-500 mt-1 shrink-0" />
                        <div>
                          <h3 className="text-lg md:text-xl font-black text-slate-900 uppercase italic font-display tracking-tight leading-tight text-left">
                            ✨ INDIVIDUAL SPECIALIST HEALTH PACKAGES
                          </h3>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">
                            Tailored metabolic, vitamin, bone, and key organs wellness panels
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clean Responsive Grid without scrolling */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4.5 pb-8 pt-2 w-full px-1">
                    {TESTS.filter(test => test.category === "Wellness" && test.id !== "w_complete").map((test) => {
                      const tDetails = getTestDetails(test);
                      return (
                        <div 
                          key={test.id}
                          id={`package-${test.id}`}
                          className="w-full flex flex-col justify-between rounded-2xl border border-dark-lavender/10 ring-1 ring-dark-lavender/5 bg-white p-4.5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                        >
                          <div>
                            {/* Tags row */}
                            <div className="flex items-center justify-between gap-2 mb-2 w-full">
                              <span className="text-[8.5px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border bg-orange-50/70 text-orange-600 border-orange-100 animate-pulse">
                                Wellness Care
                              </span>
                              <span className="bg-amber-500/15 text-amber-700 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-amber-500/10">
                                Special package
                              </span>
                            </div>

                            {/* Name */}
                            <h3 className="text-sm font-extrabold text-slate-900 hover:text-dark-lavender transition-colors leading-snug tracking-tight text-left min-h-[2.6rem] line-clamp-2">
                              {test.name}
                            </h3>

                            {/* Short details */}
                            <p className="mt-1 text-[9.5px] text-slate-400 font-bold uppercase tracking-wider text-left line-clamp-2">
                              {test.details}
                            </p>

                            <div className="mt-3.5 space-y-1.5 border-t border-slate-50 pt-3">
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold text-left">
                                <Clock size={12} className="text-[#14b6a2] shrink-0" />
                                <span>{tDetails.tat}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold text-left">
                                <Activity size={12} className="text-amber-500 shrink-0" />
                                <span>{tDetails.fasting.includes("mandatory") ? "Fasting Required" : "No fasting required"}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold text-left">
                                <TestTube size={12} className="text-blue-500 shrink-0 text-left" />
                                <span>Includes {tDetails.parameters.length} parameters</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 w-full">
                            <div className="flex flex-col text-left">
                              <div className="flex items-center gap-1.5 leading-none mb-1">
                                <span className="text-[10px] font-black text-rose-500/80 line-through">₹{(test.originalPrice || (test.price * 2.0)).toFixed(0)}</span>
                                <span className="text-[8px] text-green-600 font-black bg-green-50 px-1 py-0.5 rounded border border-green-100">
                                  {Math.round((((test.originalPrice || (test.price * 2.0)) - test.price) / (test.originalPrice || (test.price * 2.0))) * 100)}%
                                </span>
                              </div>
                              <span className="text-lg font-black text-slate-900 tracking-tight leading-none">
                                ₹{test.price.toFixed(0)}
                              </span>
                            </div>

                            <div className="flex flex-col items-end gap-1 shrink-0">
                              {cart.find(t => t.id === test.id) ? (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromCart(test.id);
                                  }}
                                  className="bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition-all text-[9.5px] font-extrabold uppercase px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm cursor-pointer whitespace-nowrap active:scale-95"
                                >
                                  <CheckCircle2 size={11} strokeWidth={3} className="text-emerald-500" /> Added
                                </button>
                              ) : (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(test);
                                  }}
                                  className="px-4 py-1.5 text-[9.5px] font-extrabold uppercase hover:shadow transition-all active:scale-[0.98] border rounded-xl flex items-center gap-1 shadow-sm cursor-pointer whitespace-nowrap bg-gradient-to-r from-dark-lavender to-electrical-purple border-transparent text-white"
                                >
                                  <Plus size={11} strokeWidth={3} /> Add
                                </button>
                              )}
                              <button 
                                onClick={() => setPreviewTest(test)} 
                                className="text-[8px] font-black text-slate-450 uppercase tracking-widest hover:text-[#14b6a2] transition-colors mt-0.5"
                              >
                                Explore Details →
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Standard Grid View for Blood/Radiology lists, search states, and all other layouts */
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-1">
                  <AnimatePresence mode="popLayout">
                    {filteredTests.slice(0, (testPageIndex + 1) * testsPerPage).map((test) => {
                      const tDetails = getTestDetails(test);
                      return (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          key={test.id}
                          className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-4.5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${
                            test.category === "Wellness" 
                              ? "border-dark-lavender/10 ring-1 ring-dark-lavender/5" 
                              : "border-slate-100 hover:border-slate-200"
                          }`}
                        >
                          <div>
                            {/* Item Category Tag Header */}
                            <div className="flex items-center justify-between gap-2 mb-2 w-full">
                              <span className={`text-[8.5px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                                test.category === "Blood" 
                                  ? "bg-rose-50/70 text-rose-600 border-rose-100" 
                                  : "bg-orange-50/70 text-orange-600 border-orange-100"
                              }`}>
                                {test.category === "Blood" ? "Blood Test" : test.category === "Radiology" ? "Imaging/Scan" : "Wellness Care"}
                              </span>
                              {test.category === "Wellness" && (
                                <span className="bg-amber-500/10 text-amber-600 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-amber-500/20">
                                  Best Value
                                </span>
                              )}
                              {test.category === "Radiology" && (
                                <span className="bg-blue-500/10 text-blue-600 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-blue-500/25">
                                  🏢 Labs Visit
                                </span>
                              )}
                            </div>

                            {/* Bold, Highly Visible Test Name */}
                            <h3 className="text-sm md:text-[15px] font-extrabold text-slate-900 group-hover:text-dark-lavender transition-colors leading-snug tracking-tight text-left select-none min-h-[2.6rem] line-clamp-2">
                              {test.name}
                            </h3>

                            {/* Short Parameter Summary Subline */}
                            <p className="mt-1 text-[9.5px] text-slate-400 font-bold uppercase tracking-wider text-left line-clamp-1">
                              {test.details}
                            </p>

                            {/* Medical Parameters Details Highlights Grid - Like Orange Health */}
                            <div className="mt-3.5 space-y-2 border-t border-slate-50 pt-3">
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold text-left">
                                <Clock size={12} className="text-[#14b6a2] shrink-0" />
                                <span>{tDetails.tat}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold text-left">
                                <Activity size={12} className="text-amber-500 shrink-0" />
                                <span>{tDetails.fasting.includes("mandatory") ? "Strict fasting required" : "No fasting required"}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold text-left">
                                {test.category === "Radiology" ? (
                                  <MapPin size={12} className="text-indigo-500 shrink-0" />
                                ) : (
                                  <TestTube size={12} className="text-blue-500 shrink-0 text-left" />
                                )}
                                <span>
                                  {test.category === "Radiology" 
                                    ? "Visit Center in Partner Labs" 
                                    : `Includes ${tDetails.parameters.length} parameters checked`}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Row - Precise Price & ADD Action layout */}
                          <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3 w-full">
                            <div className="flex flex-col text-left">
                              <div className="flex items-center gap-1.5 leading-none mb-1">
                                <span className="text-[10px] font-black text-rose-500/80 line-through">₹{(test.originalPrice || (test.price * 2.0)).toFixed(0)}</span>
                                <span className="text-[8px] text-green-600 font-black bg-green-50 px-1 py-0.5 rounded border border-green-100">
                                  {Math.round((((test.originalPrice || (test.price * 2.0)) - test.price) / (test.originalPrice || (test.price * 2.0))) * 100)}% OFF
                                </span>
                              </div>
                              <span className="text-lg font-black text-slate-900 tracking-tight leading-none">
                                ₹{test.price.toFixed(0)}
                              </span>
                            </div>

                            <div className="flex flex-col items-end gap-1 shrink-0">
                              {cart.find(t => t.id === test.id) ? (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromCart(test.id);
                                  }}
                                  className="bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition-all text-[9.5px] font-extrabold uppercase px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm cursor-pointer whitespace-nowrap active:scale-95"
                                >
                                  <CheckCircle2 size={11} strokeWidth={3} className="text-emerald-500" /> Added
                                </button>
                              ) : (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(test);
                                  }}
                                  className="px-4 py-1.5 text-[9.5px] font-extrabold uppercase hover:shadow transition-all active:scale-[0.98] border rounded-xl flex items-center gap-1 shadow-sm cursor-pointer whitespace-nowrap bg-gradient-to-r from-dark-lavender to-electrical-purple border-transparent text-white"
                                >
                                  <Plus size={11} strokeWidth={3} /> Add
                                </button>
                              )}

                              {/* Details Trigger Links */}
                              <button 
                                onClick={() => setPreviewTest(test)} 
                                className="text-[8px] font-black text-slate-450 uppercase tracking-widest hover:text-[#14b6a2] transition-colors mt-0.5"
                              >
                                Explore Details →
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}

              {/* Load More Button */}
              {!search && currentPage !== "wellness" && filteredTests.length > (testPageIndex + 1) * testsPerPage && (
                <div className="mt-10 flex items-center justify-center">
                  <button 
                    onClick={() => {
                      setTestPageIndex(prev => prev + 1);
                    }}
                    className="flex items-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-dark-lavender to-electrical-purple text-[#ffffff] font-black text-xs uppercase tracking-widest hover:shadow-lg hover:brightness-105 transition-all active:scale-[0.98] shadow-md border-transparent cursor-pointer"
                  >
                    Load More Tests <Plus size={14} strokeWidth={3.5} className="animate-pulse" />
                  </button>
                </div>
              )}
                {filteredTests.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center w-full">
                    <p className="text-lg font-bold text-slate-400 uppercase tracking-widest">No tests found in this category.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {currentPage === "about" && (
          <section className="bg-white py-14 sm:py-20 min-h-[60vh]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <DiagnosticFaqHub />
            </div>
          </section>
        )}

        {currentPage === "integration" && (
          <BusinessIntegrationHub 
            businessVpa={businessVpa}
            setBusinessVpa={setBusinessVpa}
            businessPhone={businessPhone}
            setBusinessPhone={setBusinessPhone}
            autoOpenWhatsapp={autoOpenWhatsapp}
            setAutoOpenWhatsapp={setAutoOpenWhatsapp}
            smsAlertsEnabled={smsAlertsEnabled}
            setSmsAlertsEnabled={setSmsAlertsEnabled}
          />
        )}



        {/* Why Choose Us */}
        <section className="bg-slate-900 py-16 text-white overflow-hidden relative border-t border-slate-800">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-900/5 blur-[120px]" />
          <div className="mx-auto max-w-7xl px-4 relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-black tracking-tighter leading-[0.95] font-display italic uppercase mb-8">
                  Elite Systems. <br />
                  <span className="text-red-700">Zero Margin</span> <br />
                  Of Error.
                </h2>
                <div className="space-y-6">
                  {[
                    { icon: Home, title: "Elite Home Logistics", desc: "Expert sample extraction within 45 minutes of request. Seamless cold-chain transport.", color: "text-blue-900", bg: "bg-blue-900/10" },
                    { icon: ShieldCheck, title: "ISO 9001:2015 Accredited", desc: "Global accreditation for precision analytics and robotic processing standards.", color: "text-red-700", bg: "bg-red-700/10" },
                    { icon: Stethoscope, title: "Senior Phlebotomists", desc: "Specialized geriatric and pediatric sample handling by certified professionals.", color: "text-blue-900", bg: "bg-blue-900/10" },
                    { icon: Clock, title: "Quantum TAT Delivery", desc: "Real-time digital insights delivered via encrypted channels in record windows.", color: "text-red-700", bg: "bg-red-700/10" },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl backdrop-blur-xl border border-white/5 transition-all group-hover:scale-105 group-hover:bg-slate-800 group-hover:border-red-700/30 ${item.bg}`}>
                        <item.icon size={22} className={`${item.color}`} />
                      </div>
                      <div className="pt-1 text-left">
                        <h4 className="text-base font-black uppercase italic tracking-tight font-display text-white group-hover:text-red-700 transition-colors">{item.title}</h4>
                        <p className="mt-1.5 text-slate-500 leading-relaxed font-bold uppercase text-[10px] tracking-widest">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-1 flex justify-center">
                <div className="relative w-full max-w-sm rounded-[2.5rem] p-3 bg-blue-950/45 border-2 border-blue-500/25 shadow-[0_25px_60px_rgba(59,130,246,0.15)] overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent z-10 opacity-80" />
                  <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 bg-blue-600/90 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-md">
                    🧑‍⚕️ Experienced Team
                  </div>
                  <div className="w-full h-[400px] rounded-[2rem] overflow-hidden">
                    <img 
                      src="/src/assets/images/home_blood_collection_1779889846056.png" 
                      alt="Sterile Vacuum Blood Collection Tubes — Aarvik Health Labs" 
                      className="w-full h-full object-cover rounded-[2rem] transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  {/* Overlay glassmorphic banner for home sample collection */}
                  <div className="absolute bottom-6 left-6 right-6 z-20 bg-slate-950/90 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-lg text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[7.5px] font-black text-[#ff4d80] uppercase tracking-[0.2em] block mb-0.5">certified healthcare expert</span>
                        <h4 className="text-xs font-black text-white uppercase italic tracking-wider">Indian Phlebotomy Network</h4>
                      </div>
                      <div className="flex items-center gap-1 bg-blue-500/15 border border-blue-500/20 text-blue-400 rounded-lg px-2 py-1 text-[8px] font-black uppercase tracking-wider">
                        ★ 4.9 Rating
                      </div>
                    </div>
                    <p className="text-[9.5px] text-slate-400 font-bold leading-normal mt-2.5 border-t border-white/5 pt-2.5">
                      Our certified, compassionate medical professionals follow strict hygiene, wearing sanitized gear and carrying sterile cold-chain containers to your doorstep.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-20 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Trust Accolades Banner Bar - Elite Diagnostics Model */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 mb-16 border-b border-slate-100">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                <ShieldCheck size={22} strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-800 leading-none">NABL Compliant</h5>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Accredited Partner Lab</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-xl bg-[#14b6a2]/5 border border-[#14b6a2]/10 flex items-center justify-center text-[#14b6a2] shrink-0">
                <CheckCircle2 size={22} strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-800 leading-none">100% Secure Pick</h5>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sterile Single-Use Draws</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                <Clock size={22} strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-800 leading-none">6 Hour Results</h5>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Encrypted PDF TAT</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-xl bg-purple-500/5 border border-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                <Activity size={22} strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-800 leading-none">Free Doctor Advice</h5>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">On Major Parameters</p>
              </div>
            </div>
          </div>
          <div className="grid gap-16 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3">
                <Logo className="h-10 w-auto relative z-10 text-slate-900" />
                <div className="flex flex-col text-left leading-none">
                  <span className="text-2xl font-black tracking-tight uppercase text-slate-900">
                    Aarvik
                  </span>
                  <span className="text-[8.5px] font-black tracking-[0.34em] text-[#ff4d80] uppercase mt-0.5">
                    Health Labs
                  </span>
                </div>
              </div>
              <p className="mt-6 text-slate-500 leading-relaxed max-w-xs">
                Dedicated to precise diagnostic solutions. Serving the heart of Kondapur with compassion and technology.
              </p>
            </div>
            
            <div className="lg:col-span-1">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Quick Links</h4>
              <ul className="mt-6 space-y-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <li className="hover:text-vivid-teal cursor-pointer transition-colors" onClick={() => setCurrentPage('blood-tests')}>Investigations</li>
                <li className="hover:text-vivid-teal cursor-pointer transition-colors" onClick={() => setCurrentPage('wellness')}>Health Packages</li>
                <li className="hover:text-vivid-teal cursor-pointer transition-colors" onClick={() => setIsOrdersOpen(true)}>Booking History</li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-[2.5rem] bg-slate-50 p-10 border border-slate-100">
                <h4 className="text-xl font-black text-slate-900 italic font-display uppercase tracking-tighter mb-8">Reach Us</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-black text-vivid-teal uppercase tracking-[0.2em] mb-2">Location</p>
                      <p className="text-slate-900 font-bold text-sm leading-relaxed">
                        Plot 52, Main Road, Kondapur, <br />
                        Hyderabad, Telangana <br />
                        500084
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-vivid-teal uppercase tracking-[0.2em] mb-3">Call & WhatsApp Support</p>
                      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 pt-1">
                        <a 
                          href="tel:8328139956" 
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-blue-50/80 border border-blue-100 hover:bg-blue-100/50 text-dark-lavender transition-all group shrink-0"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-900 text-white group-hover:scale-110 transition-transform shadow-md">
                            <Phone size={14} />
                          </div>
                          <div className="text-left">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider leading-none">Call Support</p>
                            <p className="text-sm font-black text-slate-900 mt-1 font-mono">+91 8328139956</p>
                          </div>
                        </a>
                        <a 
                          href="https://wa.me/918328139956" 
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-50/80 border border-emerald-100 hover:bg-emerald-100/50 text-emerald-800 transition-all group shrink-0"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#25D366] text-white group-hover:scale-110 transition-transform shadow-md">
                            <MessageCircle fill="currentColor" size={14} />
                          </div>
                          <div className="text-left">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider leading-none">WhatsApp Chat</p>
                            <p className="text-sm font-black text-slate-900 mt-1 font-mono">+91 8328139956</p>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-black text-vivid-teal uppercase tracking-[0.2em] mb-2">Center Hours</p>
                      <p className="text-slate-900 font-bold text-sm">07:00 AM - 09:00 PM</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Open All Days</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-vivid-teal uppercase tracking-[0.2em] mb-2">Home Visit Hours</p>
                      <p className="text-slate-900 font-bold text-sm">06:00 AM - 06:00 PM</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Doorstep Collection</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 p-6 sm:p-8 bg-gradient-to-r from-[#f0fdf4] via-emerald-50/40 to-[#f0fdf4] border border-emerald-100/80 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-500 transition-all uppercase tracking-widest shadow-sm">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-vivid-teal animate-pulse" />
              <p className="text-slate-700 font-extrabold font-mono">© 2024 Aarvik Health Labs.</p>
              <span className="text-slate-300 font-normal">| All Rights Reserved</span>
            </div>
            <div className="flex items-center gap-6 sm:gap-8 text-[11px] font-black">
              <span 
                onClick={() => {
                  setNotifications(prev => [{ id: Date.now().toString(), text: "Terms & Conditions of Aarvik Health Labs loaded. 100% compliant partner guidelines apply.", type: "patient" }, ...prev]);
                }} 
                className="hover:text-vivid-teal cursor-pointer transition-colors duration-300 border-b-2 border-transparent hover:border-vivid-teal pb-0.5"
              >
                Terms & Conditions
              </span>
              <span 
                onClick={() => {
                  setNotifications(prev => [{ id: (Date.now() + 1).toString(), text: "Privacy Policy updated. Your confidential medical details are NABL secured and encrypted.", type: "patient" }, ...prev]);
                }} 
                className="hover:text-vivid-teal cursor-pointer transition-colors duration-300 border-b-2 border-transparent hover:border-vivid-teal pb-0.5"
              >
                Privacy Policy
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className={`fixed inset-0 z-[100] flex transition-all duration-500 overflow-hidden ${
            paymentStep === 'summary' ? 'justify-end' : 'items-center justify-center p-4 sm:p-8'
          }`}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseCart}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div 
              layout
              initial={paymentStep === 'summary' ? { x: "100%" } : { opacity: 0, scale: 0.9, y: 20 }}
              animate={{ x: 0, opacity: 1, scale: 1, y: 0 }}
              exit={paymentStep === 'summary' ? { x: "100%" } : { opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`relative flex flex-col overflow-hidden transition-all duration-500 ${
                paymentStep === 'summary' 
                  ? 'h-full w-full max-w-6xl bg-[#f1f3f6] shadow-2xl overflow-y-auto' 
                  : 'h-auto w-full max-w-md bg-blue-900 rounded-[2rem] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.4)] border border-white/20 items-center justify-center p-3'
              }`}
            >
              <div className={`flex items-center justify-between border-b sticky top-0 z-50 ${
                paymentStep === 'summary' ? 'bg-blue-900 text-white p-4' : 'border-white/10 bg-blue-950/30 p-3'
              }`}>
                <div>
                  <h2 className={`text-xs font-black uppercase italic ${paymentStep === 'summary' ? 'text-white' : 'text-white'}`}>
                    {paymentStep === 'summary' && 'Secure Checkout'}
                    {(paymentStep === 'processing' || paymentStep === 'success') && 'Order Status'}
                  </h2>
                </div>
                <button 
                  onClick={handleCloseCart}
                  className={`rounded-full p-2 transition-colors ${
                    paymentStep === 'summary' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className={`flex-1 overflow-y-auto ${paymentStep === 'summary' ? 'p-4 md:p-6' : 'p-3'}`}>
                {paymentStep === 'summary' && cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 text-center max-w-md mx-auto">
                    <div className="relative mb-8">
                       <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-50" />
                       <TestTube size={80} className="text-blue-200 relative z-10" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">No Test Selected.</h3>
                    <p className="text-sm font-bold text-slate-400 mt-3 uppercase tracking-widest leading-loose">
                       Please select a test <br />to proceed with your booking.
                    </p>
                    <button 
                      onClick={() => { setIsCartOpen(false); if(currentPage === 'home') setCurrentPage('blood-tests'); }}
                      className="mt-10 w-full bg-blue-900 text-white py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-100 hover:bg-black hover:-translate-y-1 transition-all active:scale-95"
                    >
                      Browse All Tests
                    </button>
                  </div>
                ) : paymentStep === 'summary' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl mx-auto items-stretch pb-6">
                    {/* Left Column - Form Details & Metadata */}
                    <div className="space-y-3 flex flex-col justify-between">
                      {/* Patient & Collection Details Horizontal Box */}
                      {!user ? (
                        <div className="w-full bg-white rounded-xl border border-dashed border-slate-200 p-6 text-center shadow-sm">
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">Patient Identification Required</p>
                          <button onClick={() => setIsLoginOpen(true)} className="w-full max-w-xs bg-red-700 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-red-100 hover:scale-105 transition-all">
                            Set Patient Identity
                          </button>
                        </div>
                      ) : (
                        <div className="w-full bg-white rounded-xl border border-slate-100 p-3 shadow-sm flex items-center justify-between text-xs transition-all">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-900">
                               <MapPin size={14} />
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-slate-900 uppercase italic leading-none">Patient Profile</p>
                               <p className="font-extrabold text-slate-600 mt-0.5 text-[11px] uppercase italic">{user.name} ({user.age}Y • {user.gender})</p>
                            </div>
                          </div>
                          <div className="text-right">
                             <div className="flex items-center gap-1 justify-end">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Collection Address</span>
                                <button onClick={() => { setIsLoginOpen(true); setLoginStep('address'); }} className="text-[8px] font-black text-red-700 uppercase underline ml-1">Change</button>
                             </div>
                             {user.address ? (
                               <p className="text-[10px] font-bold text-slate-500 truncate max-w-[180px] mt-0.5">{user.address.formatted}</p>
                             ) : (
                               <button onClick={() => { setIsLoginOpen(true); setLoginStep('address'); }} className="text-[9px] font-black text-red-700 uppercase underline mt-0.5">• Add New Address •</button>
                             )}
                          </div>
                        </div>
                      )}

                      {/* Collection Schedule - Standardized Dropdown Input in Single Line */}
                      <div className={`bg-white rounded-xl border border-slate-100 p-3 shadow-sm transition-all flex items-center justify-between gap-4 ${!user?.address ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-900">
                             <Clock size={12} />
                          </div>
                          <div>
                            <h3 className="text-[10px] font-black uppercase tracking-tight text-slate-900">Time Window</h3>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 select-none shrink-0">
                          {/* Today vs Tomorrow Select */}
                          <div className="flex bg-slate-100 p-0.5 rounded-lg shrink-0">
                            {['Today', 'Tomorrow'].map((day) => (
                              <button
                                key={day}
                                type="button"
                                onClick={() => setSelectedSlot(prev => {
                                  const baseHour = prev.includes(" (Tomorrow)") ? prev.replace(" (Tomorrow)", "") : prev;
                                  return day === 'Tomorrow' ? `${baseHour} (Tomorrow)` : baseHour;
                                })}
                                className={`px-2 py-0.5 text-[8px] font-black uppercase rounded transition-all ${
                                  (selectedSlot.includes(" (Tomorrow)") && day === "Tomorrow") || (!selectedSlot.includes(" (Tomorrow)") && day === "Today")
                                    ? "bg-blue-900 text-white shadow-sm"
                                    : "text-slate-400 hover:text-slate-600"
                                }`}
                              >
                                {day}
                              </button>
                            ))}
                          </div>

                          <select 
                            value={selectedSlot.replace(" (Tomorrow)", "")} 
                            onChange={(e) => {
                              const isTomorrowVal = selectedSlot.includes(" (Tomorrow)");
                              setSelectedSlot(isTomorrowVal ? `${e.target.value} (Tomorrow)` : e.target.value);
                            }}
                            className="bg-slate-50 border border-slate-200 text-[9px] font-black uppercase rounded p-1.5 outline-none focus:border-vivid-teal cursor-pointer"
                          >
                            {[
                              { hour: "06:00 AM - 07:00 AM", label: "06-07 AM (Early)" },
                              { hour: "07:00 AM - 08:00 AM", label: "07-08 AM (Fasting)" },
                              { hour: "08:00 AM - 09:00 AM", label: "08-09 AM (Fasting)" },
                              { hour: "09:00 AM - 10:00 AM", label: "09-10 AM (Morning)" },
                              { hour: "10:00 AM - 11:00 AM", label: "10-11 AM (Morning)" },
                              { hour: "11:00 AM - 12:00 PM", label: "11-12 PM (Standard)" },
                              { hour: "12:00 PM - 01:00 PM", label: "12-01 PM (Noon)" },
                              { hour: "01:00 PM - 02:00 PM", label: "01-02 PM (Noon)" },
                              { hour: "02:00 PM - 03:00 PM", label: "02-03 PM (Afternoon)" },
                              { hour: "03:00 PM - 04:00 PM", label: "03-04 PM (Afternoon)" },
                              { hour: "04:00 PM - 05:00 PM", label: "04-05 PM (Evening)" },
                              { hour: "05:00 PM - 06:00 PM", label: "05-06 PM (Evening)" },
                              { hour: "06:00 PM - 07:00 PM", label: "06-07 PM (Late Evening)" },
                              { hour: "07:00 PM - 08:00 PM", label: "07-08 PM (Night)" },
                              { hour: "08:00 PM - 09:00 PM", label: "08-09 PM (Night)" }
                            ].map(slotItem => (
                              <option key={slotItem.hour} value={slotItem.hour}>{slotItem.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Selected Investigations Summary Box */}
                      <div className={`bg-white rounded-xl border border-slate-100 p-3 shadow-sm transition-all flex flex-col ${!user?.address ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                        <div className="flex items-center justify-between border-b border-slate-50 pb-2 mb-2">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-900">
                               <Beaker size={12} />
                            </div>
                            <span className="text-[10px] font-black uppercase text-slate-900 tracking-wide">Investigations ({cart.length})</span>
                          </div>
                          <button onClick={() => setIsCartOpen(false)} className="text-[8px] font-black text-red-700 uppercase hover:underline">+ Add More</button>
                        </div>
                        <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-50">
                          {cart.map(item => (
                            <div key={item.id} className="pt-1.5 first:pt-0 flex items-center justify-between text-[10px]">
                              <span className="font-extrabold text-slate-800 uppercase italic truncate max-w-[180px]">{item.name}</span>
                              <div className="flex items-center gap-3">
                                <span className="font-black text-slate-900">₹{item.price.toFixed(0)}</span>
                                <button onClick={() => removeFromCart(item.id)} className="text-[8px] font-black text-red-700 hover:text-red-900 uppercase">Delete</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Statement of Charges, Payment & Booking */}
                    <div className="space-y-3 flex flex-col justify-between">
                      {/* Statement of Charges Box */}
                      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3.5 space-y-2 text-xs">
                        <div className="flex justify-between items-center text-[10px]">
                           <span className="font-black text-slate-400 uppercase tracking-widest italic">Investigations Subtotal</span>
                           <span className="font-display text-slate-900 font-black">₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                           <span className="font-black text-slate-400 uppercase tracking-widest italic">Service Kit Charges</span>
                           <span className="text-orange-600 font-display font-black">+ ₹{serviceKitCharges}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] border-b border-slate-50 pb-2">
                           <span className="font-black text-slate-400 uppercase tracking-widest italic">Concierge Collection</span>
                           <span className="text-vivid-teal font-black text-[7.5px] uppercase tracking-wider bg-vivid-teal/5 px-1.5 py-0.5 rounded border border-vivid-teal/10">Free</span>
                        </div>
                        <div className="pt-0.5 flex justify-between items-center">
                           <span className="text-[10px] font-black text-dark-lavender uppercase tracking-widest italic">Net Commitment</span>
                           <span className="text-lg font-black text-dark-lavender font-display italic tracking-tighter">₹{totalDue.toFixed(0)}</span>
                        </div>
                      </div>

                      {/* Unified Single-Line Payment Selector & Final Booking */}
                      <div className={`bg-slate-900 rounded-xl p-3 border border-slate-800 shadow-md space-y-3 ${!user?.address ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                         {/* Compact Payment Method Selector & Finish Booking BUTTON in SINGLE ROW/LINE */}
                         <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
                           {/* Horizontal Payment Toggle Selector */}
                           <div className="flex items-center bg-white/5 p-1 rounded-lg border border-white/10 shrink-0 select-none">
                             {[
                               { id: 'cash', label: 'Cash', icon: Wallet },
                               { id: 'upi', label: 'UPI QR', icon: Smartphone },
                               { id: 'card', label: 'Card', icon: CreditCard }
                             ].map(pay => {
                               const PayIcon = pay.icon;
                               const isSelected = paymentMethod === pay.id;
                               return (
                                 <button
                                   key={pay.id}
                                   type="button"
                                   onClick={() => {
                                     setPaymentMethod(pay.id as any);
                                     if (pay.id === 'upi') {
                                       if (user && user.address && cart.length > 0) {
                                         handleConfirmPayment('upi');
                                       } else {
                                         setNotifications(prev => [{
                                           id: Date.now().toString(),
                                           text: "Please add Patient Details / address first to book via UPI.",
                                           type: "patient"
                                         }, ...prev]);
                                       }
                                     }
                                   }}
                                   className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-tight transition-all ${
                                     isSelected 
                                       ? "bg-vivid-teal text-white shadow-sm shadow-vivid-teal/20" 
                                       : "text-white/60 hover:text-white"
                                   }`}
                                 >
                                   <PayIcon size={10} />
                                   <span>{pay.label}</span>
                                 </button>
                               );
                             })}
                           </div>

                           {/* Confirm checkout booking button, taking remainder of the single line space */}
                           <button 
                             disabled={!user || !user.address || cart.length === 0}
                             onClick={handleConfirmPayment}
                             className={`flex-1 w-full shrink-0 cursor-pointer py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow active:scale-95 text-center flex items-center justify-center gap-1 leading-none ${
                               user && user.address && cart.length > 0
                                 ? "bg-red-700 text-white hover:bg-red-800 shadow-red-700/20" 
                                 : "bg-white/5 text-white/30 cursor-not-allowed border border-white/10"
                             }`}
                           >
                             Confirm Booking (₹{totalDue.toFixed(0)})
                           </button>
                         </div>

                         {/* Mini dynamic payment form render inline beneath checkout bar */}
                         {paymentMethod === 'upi' && (
                           <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg space-y-3 text-white">
                             {/* Headers */}
                             <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                               <div className="space-y-0.5">
                                 <h4 className="text-[9.5px]/none font-black uppercase text-vivid-teal tracking-wider flex items-center gap-1">
                                   <Smartphone size={10} className="text-vivid-teal animate-bounce" /> UPI INSTANT CHANNELS
                                 </h4>
                                 <p className="text-[7.5px] font-bold text-slate-400 uppercase leading-none">Choose Mobile App or Scan QR</p>
                                </div>
                                <span className="text-[7px] font-mono font-bold text-vivid-teal bg-vivid-teal/10 px-1 py-0.5 rounded border border-vivid-teal/15 leading-none">AUTO DETECTION</span>
                              </div>

                              {/* Patient dynamic PhonePe/GPay Number Entry */}
                              <div className="bg-white/5 p-2 rounded-lg border border-white/5 space-y-1">
                                <label className="text-[7.5px] font-black uppercase text-slate-300 block">PhonePe / GPay Mobile Number</label>
                                <div className="flex gap-1.5">
                                  <div className="relative flex-1">
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 font-bold leading-none">+91</span>
                                    <input
                                      type="tel"
                                      maxLength={10}
                                      value={upiMobileNumber || user?.phone || ""}
                                      onChange={(e) => setUpiMobileNumber(e.target.value.replace(/\D/g, ''))}
                                      placeholder={user?.phone || "8328139956"}
                                      className="w-full pl-8 pr-2 py-1 bg-black/40 border border-white/10 rounded text-[9px] text-white focus:border-vivid-teal outline-none font-bold placeholder-slate-500"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const num = upiMobileNumber || user?.phone || "8328139956";
                                      if (num.length < 10) {
                                        setNotifications(prev => [{
                                          id: Date.now().toString(),
                                          text: "⚠️ Please enter a valid 10-digit PhonePe / GPay mobile number.",
                                          type: "patient"
                                        }, ...prev]);
                                        return;
                                      }
                                      setNotifications(prev => [{
                                        id: Date.now().toString(),
                                        text: `⚡ payment notification requested on linked +91 ${num} in PhonePe/GPay apps. Please authorize!`,
                                        type: "patient"
                                      }, ...prev]);
                                    }}
                                    className="px-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[8px] font-black uppercase rounded transition-all border-none cursor-pointer"
                                  >
                                    Verify App
                                  </button>
                                </div>
                              </div>

                              {/* Interactive Choice Grid */}
                              <div className="grid grid-cols-2 gap-2 mt-1">
                                {/* Option A: PhonePe App Link */}
                                <a
                                  href={`upi://pay?pa=${businessVpa}&pn=Aarvik%20Health%20Labs&am=${totalDue.toFixed(0)}&cu=INR`}
                                  onClick={() => {
                                    setNotifications(prev => [{
                                      id: Date.now().toString(),
                                      text: `Opening PhonePe to pay ₹${totalDue.toFixed(0)}. If on desktop, scan the QR code instead!`,
                                      type: "patient"
                                    }, ...prev]);
                                  }}
                                  className="flex items-center justify-between gap-1.5 p-1.5 rounded-lg bg-[#5f259f]/20 hover:bg-[#5f259f]/30 border border-[#5f259f]/40 transition-all active:scale-[0.98] text-left group cursor-pointer no-underline"
                                >
                                 <div className="flex items-center gap-1.5">
                                   <div className="h-5 w-5 rounded bg-[#5f259f] flex items-center justify-center text-white text-[8px] font-black italic shadow-inner shrink-0 leading-none">
                                     Pe
                                   </div>
                                   <div className="leading-tight">
                                     <p className="text-[8px] font-black text-white group-hover:text-amber-300 transition-colors uppercase italic leading-none">PHONEPE</p>
                                     <p className="text-[6.5px] text-purple-300 font-bold uppercase leading-none">PAY DIRECT</p>
                                   </div>
                                 </div>
                                 <ArrowRight size={8} className="text-purple-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
                                </a>

                               {/* Option B: Google Pay Link */}
                               <a
                                 href={`upi://pay?pa=${businessVpa}&pn=Aarvik%20Health%20Labs&am=${totalDue.toFixed(0)}&cu=INR`}
                                 onClick={() => {
                                   setNotifications(prev => [{
                                     id: Date.now().toString(),
                                     text: `Opening Google Pay to pay ₹${totalDue.toFixed(0)}. If on desktop, scan the QR code instead!`,
                                     type: "patient"
                                   }, ...prev]);
                                 }}
                                 className="flex items-center justify-between gap-1.5 p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/15 border border-sky-400/30 transition-all active:scale-[0.98] text-left group cursor-pointer no-underline"
                               >
                                 <div className="flex items-center gap-1.5">
                                   <div className="h-5 w-5 rounded bg-white flex items-center justify-center text-[7.5px] font-black shadow-inner overflow-hidden shrink-0 leading-none">
                                     <span className="text-blue-500">G</span>
                                     <span className="text-red-500">P</span>
                                     <span className="text-green-500">a</span>
                                   </div>
                                   <div className="leading-tight">
                                     <p className="text-[8px] font-black text-white group-hover:text-amber-300 transition-colors uppercase italic leading-none">GPAY</p>
                                     <p className="text-[6.5px] text-sky-300 font-bold uppercase leading-none">PAY DIRECT</p>
                                   </div>
                                 </div>
                                 <ArrowRight size={8} className="text-sky-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
                               </a>
                             </div>

                             {/* Scan QR Section - Size Pedda Ravali */}
                             <div className="flex flex-col items-center justify-center bg-white/5 border border-white/10 p-3.5 rounded-xl mt-2.5 space-y-2.5 text-center relative overflow-hidden">
                               <div className="flex flex-col items-center">
                                 <div className="flex items-center gap-1 justify-center">
                                   <QrCode size={13} className="text-amber-400 animate-pulse" />
                                   <p className="text-[9px] font-black text-slate-100 uppercase tracking-widest leading-none">SCAN INSTANT UPI QR</p>
                                 </div>
                                 <p className="text-[7.5px] text-slate-400 font-bold uppercase text-center mt-1">Scan ₹{totalDue.toFixed(0)} with any payment app to complete booking instantly</p>
                               </div>
                               
                               {/* Beautiful High Contrast Big QR Card */}
                               <div className="bg-white p-3 rounded-2xl shrink-0 border-2 border-amber-400 shadow-2xl relative">
                                 <div className="absolute inset-0 border border-dashed border-rose-500 rounded-xl pointer-events-none opacity-40 m-0.5 animate-pulse" />
                                 <img 
                                   src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=${businessVpa}&pn=Aarvik%20Health%20Labs&am=${totalDue.toFixed(0)}&cu=INR`)}`}
                                   alt="UPI QR"
                                   className="w-36 h-36 object-contain"
                                 />
                               </div>
                               
                               <span className="text-[8px] font-mono font-black text-amber-300 bg-black/40 px-3 py-1 rounded-md border border-white/10 uppercase tracking-wide">
                                 VPA: {businessVpa}
                               </span>
                             </div>
                           </div>
                         )}

                         {paymentMethod === 'card' && (
                           <div className="bg-white/5 border border-white/10 p-2 rounded-lg space-y-1">
                             <div className="grid grid-cols-2 gap-1.5">
                                <input type="text" placeholder="CARD NUMBER (4111 2222...)" className="col-span-2 text-[8px] placeholder-white/30 text-white bg-white/5 border border-white/10 p-1 rounded focus:border-vivid-teal outline-none" />
                                <input type="text" placeholder="EXPIRY" className="text-[8px] placeholder-white/30 text-white bg-white/5 border border-white/10 p-1 rounded focus:border-vivid-teal outline-none" />
                                <input type="password" placeholder="CVV" className="text-[8px] placeholder-white/30 text-white bg-white/5 border border-white/10 p-1 rounded focus:border-vivid-teal outline-none" />
                             </div>
                           </div>
                         )}

                         {paymentMethod === 'cash' && (
                           <div className="bg-emerald-900/20 border border-emerald-500/20 p-2 rounded-lg flex items-center gap-2 text-white">
                             <div className="h-4 w-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                               <CheckCircle2 size={10} />
                             </div>
                             <p className="text-[7.5px] font-bold text-slate-300 uppercase leading-snug">
                               <span className="text-emerald-400 font-extrabold">Pay on collection:</span> Balance payable to Phlebotomist via Cash/UPI on visit.
                             </p>
                           </div>
                         )}
                      </div>
                    </div>
                  </div>
                )}

                {paymentStep === 'processing' && (
                  <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="h-10 w-10 border-[4px] border-white/20 border-t-white rounded-full mb-6 shadow-xl"
                    />
                    <h3 className="text-lg font-black text-white uppercase italic tracking-widest">Securing Booking...</h3>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 max-w-[240px]">Synchronizing with 8328139956 <br />Verified Partner Lab Account</p>
                  </div>
                )}

                {paymentStep === 'success' && (
                  <div className="flex flex-col h-full items-center justify-center px-2 py-2">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="h-10 w-10 bg-vivid-teal text-white rounded-full flex items-center justify-center mb-1.5 shadow-md shadow-vivid-teal/20"
                    >
                      <CheckCircle2 size={20} />
                    </motion.div>
                    
                    <h3 className="text-base font-black text-white uppercase italic tracking-tight mb-2">
                       Booking Confirmed!
                    </h3>

                    {autoOpenWhatsapp && (
                      <div className="w-full mb-3 bg-emerald-950/45 border border-emerald-500/30 p-2.5 rounded-lg text-left text-white flex items-center justify-between gap-2 shadow-lg backdrop-blur">
                        <div className="flex items-center gap-2">
                          <div className="h-6.5 w-6.5 rounded bg-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
                            <MessageCircle size={12} fill="currentColor" className="animate-bounce" />
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="text-[8.5px]/none font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                              Direct Dispatch Active
                            </h4>
                            <p className="text-[7.5px] font-bold text-slate-300 uppercase leading-none">
                              {autoRedirectCountdown > 0 
                                ? `Broadcasting Mobile Msg in ${autoRedirectCountdown}s...` 
                                : "Broadcasting link opened successfully! ✅"
                              }
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-1.5 shrink-0 select-none">
                          {autoRedirectCountdown > 0 ? (
                            <button
                              type="button"
                              onClick={() => setCountdownActive(false)}
                              className="px-2 py-1 border border-white/20 hover:border-white/40 text-[7px] text-slate-300 font-black uppercase rounded cursor-pointer leading-none"
                            >
                              Pause (ఆపండి)
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setAutoRedirectCountdown(5);
                                setCountdownActive(true);
                              }}
                              className="px-2 py-1 bg-[#25D366] hover:bg-[#128C7E] text-[7px] text-white font-black uppercase rounded cursor-pointer leading-none border-none font-bold"
                            >
                              Resend (మళ్ళీ)
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="w-full bg-white rounded-lg p-3 border border-slate-100 relative overflow-hidden shadow-lg text-dark-lavender">
                      <div className="absolute top-0 right-0 h-24 w-24 bg-slate-50/50 rounded-full blur-[40px]" />
                      
                      <div className="relative z-10 space-y-2">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                          <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Patient Booking Record</p>
                            <p className="text-xs font-black text-vivid-teal font-mono">#{orderReference || 'AARVI-832813'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[8px] font-black text-slate-400 uppercase">Status</p>
                            <span className="px-2.5 py-0.5 rounded-full bg-vivid-teal/10 text-vivid-teal text-[8px] font-black uppercase">Confirmed</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-y-2 border-b border-slate-100 pb-2">
                           <div>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Patient Profile</p>
                              <p className="text-[10px] font-black text-slate-900 uppercase leading-none">{completedOrder?.patient?.name}</p>
                              <p className="text-[9px] font-bold text-slate-500 mt-1">{completedOrder?.patient?.age}Y / {completedOrder?.patient?.gender}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Contact No</p>
                              <p className="text-[10px] font-black text-slate-900 leading-none">+91 {completedOrder?.patient?.phone}</p>
                           </div>
                           <div>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Collection Time</p>
                              <p className="text-[10px] font-black text-slate-900 uppercase leading-none">{completedOrder?.slot}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Billing Type</p>
                              <p className="text-[10px] font-black text-slate-900 uppercase leading-none">
                                {completedOrder?.paymentMethod === 'UPI / SCAN INSTANT' ? 'UPI (Scanner)' : 'Pay on collection'}
                              </p>
                           </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Investigations Covered</p>
                          <div className="space-y-1 max-h-16 overflow-y-auto pr-1">
                            {(completedOrder?.items || []).map((test: any) => (
                              <div key={test.id} className="flex justify-between items-center bg-slate-50/50 px-2 py-1 rounded-md border border-slate-100">
                                <span className="text-[9px] font-black text-slate-700 uppercase tracking-wide truncate max-w-[180px]">{test.name}</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[8px] font-mono font-bold text-red-600 line-through opacity-60">₹{test.originalPrice || (test.price * 2.0).toFixed(0)}</span>
                                  <span className="text-[9px] font-mono font-black text-slate-900 font-bold">₹{test.price.toFixed(0)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order breakdown summary */}
                        <div className="text-[8.5px] font-extrabold text-slate-500 uppercase space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                           <div className="flex justify-between">
                             <span>Investigations Subtotal</span>
                             <span className="font-mono text-slate-900">₹{(completedOrder?.items || []).reduce((acc: number, t: any) => acc + t.price, 0).toFixed(0)}</span>
                           </div>
                           <div className="flex justify-between text-orange-600">
                             <span>Service Kit Charges</span>
                             <span className="font-mono">+ ₹100</span>
                           </div>
                        </div>

                        <div className="bg-warm-coral/5 p-2 rounded-lg border border-warm-coral/10 flex justify-between items-center mt-1">
                           <div>
                             <p className="text-[8px] font-black text-warm-coral uppercase tracking-widest">Total Amount Due</p>
                             <p className="text-[7.5px] font-bold text-slate-400">
                               {completedOrder?.paymentMethod === 'UPI / SCAN INSTANT' ? 'Authorized via Instant UPI QR' : 'Payable in Cash / UPI on pickup'}
                             </p>
                           </div>
                           <p className="text-xl font-black text-warm-coral font-mono tracking-tighter col-span-1">₹{completedOrder?.total?.toFixed(0)}</p>
                        </div>

                        {completedOrder?.paymentMethod === 'UPI / SCAN INSTANT' && (
                          <div className="mt-1.5 space-y-2">
                            {/* Direct App Launchers */}
                            <div className="grid grid-cols-2 gap-1.5">
                              <a
                                href={`upi://pay?pa=${businessVpa}&pn=Aarvik%20Health%20Labs&am=${completedOrder?.total?.toFixed(0)}&cu=INR`}
                                onClick={() => {
                                  setNotifications(prev => [{
                                    id: Date.now().toString(),
                                    text: `Opening PhonePe to pay ₹${completedOrder?.total?.toFixed(0)}`,
                                    type: "patient"
                                  }, ...prev]);
                                }}
                                className="flex items-center gap-1.5 p-1.5 hover:shadow-sm rounded-lg bg-[#5f259f]/10 border border-[#5f259f]/20 text-[#5f259f] text-[7.5px] font-black uppercase tracking-tight text-center justify-center transition-all leading-none focus:outline-none cursor-pointer no-underline shrink-0"
                              >
                                <span className="bg-[#5f259f] text-white px-1.5 py-0.5 rounded text-[8px] font-black italic">Pe</span>
                                Pay with PhonePe
                              </a>

                              <a
                                href={`upi://pay?pa=${businessVpa}&pn=Aarvik%20Health%20Labs&am=${completedOrder?.total?.toFixed(0)}&cu=INR`}
                                onClick={() => {
                                  setNotifications(prev => [{
                                    id: Date.now().toString(),
                                    text: `Opening Google Pay to pay ₹${completedOrder?.total?.toFixed(0)}`,
                                    type: "patient"
                                  }, ...prev]);
                                }}
                                className="flex items-center gap-1.5 p-1.5 hover:shadow-sm rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-800 text-[7.5px] font-black uppercase tracking-tight text-center justify-center transition-all leading-none focus:outline-none cursor-pointer no-underline shrink-0"
                              >
                                <span className="bg-white border border-slate-200 px-1 py-0.5 rounded text-[8px] font-black tracking-tight leading-none leading-none">
                                  <span className="text-blue-500">G</span><span className="text-red-500">P</span>
                                </span>
                                Pay with GPay
                              </a>
                            </div>

                            {/* Fallback QR Scanner - Size Pedda Ravali */}
                            <div className="bg-emerald-50/80 border-2 border-emerald-200 p-3.5 rounded-2xl flex flex-col items-center justify-center text-emerald-950 text-center space-y-2 mt-2">
                              <div className="space-y-1">
                                <h4 className="text-[9.5px] font-black uppercase text-emerald-700 tracking-wider flex items-center justify-center gap-1.5 leading-none">
                                  <QrCode size={11} className="text-emerald-700 animate-pulse" /> SCAN TO CONFIRM TRANSACTION
                                </h4>
                                <p className="text-[7.5px] font-bold text-slate-500 uppercase leading-normal">Use major payment apps to complete verification</p>
                              </div>
                              
                              <div className="relative p-3 bg-white rounded-2xl border-2 border-emerald-300 shadow-xl my-1">
                                <div className="absolute inset-0 border border-dashed border-emerald-500 rounded-xl pointer-events-none opacity-40 m-0.5 animate-pulse" />
                                <img 
                                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=${businessVpa}&pn=Aarvik%20Health%20Labs&am=${completedOrder?.total?.toFixed(0)}&cu=INR`)}`}
                                  alt="UPI Scanner"
                                  className="w-32 h-32 object-contain"
                                />
                              </div>

                              <span className="text-[8px] font-mono font-black text-emerald-900 bg-white px-3 py-1 rounded border border-emerald-200">
                                VPA: {businessVpa}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-col gap-2 w-full">
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => downloadReceipt()}
                          className="py-2.5 rounded-lg bg-white text-dark-lavender flex gap-1.5 items-center justify-center font-black text-[9px] uppercase tracking-wider hover:bg-slate-100 transition-all shadow-sm active:scale-95 border border-slate-200"
                        >
                           <Download size={14} />
                           Download Invoice
                        </button>
                        <a 
                          href={`https://wa.me/91${completedOrder?.patient?.phone || '8328139956'}?text=${encodeURIComponent(`*AARVIK HEALTH LABS - BOOKING CONFIRMED* ✅\n\n*INVOICE DETAILS*\n🔖 Order Ref: #${completedOrder?.id}\n📅 Date: ${completedOrder?.date}\n\n*PATIENT INFO*\n👤 Name: ${completedOrder?.patient?.name}\n📊 Age/Gender: ${completedOrder?.patient?.age}Y / ${completedOrder?.patient?.gender}\n📞 Phone: +91 ${completedOrder?.patient?.phone}\n\n*BOOKING SUMMARY*\n🔬 Investigations: ${(completedOrder?.items || []).map((t: any) => t.name).join(", ")}\n📅 Time Slot: ${completedOrder?.slot}\n📍 Address: ${completedOrder?.patient?.address?.formatted || completedOrder?.patient?.address}\n\n*BILLING*\n💰 Bill Amount: ₹${completedOrder?.total?.toFixed(0)}\n💳 Method: ${completedOrder?.method === 'cash' ? 'PAY ON COLLECTION' : 'PAID ONLINE'}\n\nOur phlebotomist will contact you shortly for sample collection.\n\n_Stay Healthy with Aarvik Health Labs!_`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2.5 rounded-lg bg-[#25D366] text-white flex gap-1.5 items-center justify-center font-black text-[9px] uppercase tracking-wider hover:bg-[#128C7E] transition-all shadow-sm active:scale-95 group"
                        >
                          <MessageCircle size={14} fill="currentColor" className="group-hover:rotate-12 transition-transform" />
                          Send WhatsApp Bill
                        </a>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                         <button 
                           onClick={() => {
                             const order = completedOrder || orders[0];
                             const msg = `Aarvik Health Labs: Booking Confirmed! Order Ref: ${order?.id}. Patient: ${order?.patient?.name} (${order?.patient?.age}Y). Slot: ${order?.slot}. Total: Rs.${order?.total?.toFixed(0)}. Our technician will reach out. Thanks!`;
                             window.open(`sms:${order?.patient?.phone || '8328139956'}?body=${encodeURIComponent(msg)}`, '_blank');
                           }}
                           className="py-2 rounded-lg bg-slate-800 text-slate-400 flex gap-1.5 items-center justify-center hover:text-white border border-slate-700/50 transition-all w-full"
                         >
                            <Smartphone size={12} />
                            <p className="text-[8.5px] font-black uppercase tracking-widest">Send SMS</p>
                         </button>
                         <button 
                           onClick={() => {
                             setCart([]);
                             setPaymentStep('summary');
                             handleCloseCart();
                             setCurrentPage('home');
                             window.scrollTo({ top: 0, behavior: 'smooth' });
                           }}
                           className="py-2 rounded-lg bg-blue-900 text-white flex gap-1.5 items-center justify-center hover:bg-black transition-all border border-blue-800 shadow-sm shadow-blue-100"
                         >
                            <ArrowRight size={12} className="rotate-180" />
                            <p className="text-[8.5px] font-black uppercase tracking-widest">Return Home</p>
                         </button>
                       </div>
                    </div>
                  </div>
                )}
              </div>
              
              {(paymentStep !== 'summary' && paymentStep !== 'processing' && paymentStep !== 'success' && cart.length > 0) && (
                  <div className={`p-8 border-t transition-colors duration-500 ${
                  paymentStep === 'summary' ? 'hidden' : 'border-white/10 bg-slate-950/95'
                }`}>
                  {paymentStep !== 'success' && paymentStep !== 'summary' && (
                     <div className="flex items-center gap-3 mb-6 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <Info size={16} className="text-blue-300" />
                        <p className="text-[9px] font-bold text-white uppercase tracking-widest leading-tight">
                           Your tests are scheduled for <span className="text-white font-black">{selectedSlot}</span>
                        </p>
                     </div>
                  )}

                  <button 
                    disabled={paymentStep === 'processing'}
                    onClick={handleConfirmPayment}
                    className={`w-full rounded-[2rem] py-5 text-lg font-black transition-all shadow-xl active:scale-95 uppercase tracking-widest ${
                      paymentStep === 'summary' || paymentMethod 
                        ? (paymentStep === 'summary' ? "bg-vivid-teal text-white hover:bg-black shadow-vivid-teal/20" : "bg-vivid-teal text-white hover:bg-black")
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {paymentStep === 'summary' ? 'Confirm Booking' : 'CONFIRM BOOKING'}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notification Toasts */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className={`p-4 rounded-2xl shadow-2xl border pointer-events-auto flex gap-3 ${
                n.type === 'admin' ? "bg-slate-900 text-white border-slate-700" : "bg-white text-slate-900 border-slate-100"
              }`}
            >
              <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${n.type === 'admin' ? "bg-electrical-purple" : "bg-warm-coral"}`} />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-50">
                    {n.type === 'admin' ? "Admin Alert" : "Patient Msg"}
                  </p>
                  <button onClick={() => clearNotification(n.id)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={12} />
                  </button>
                </div>
                <p className="text-xs font-bold leading-relaxed">{n.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Login Modal */}
      <AnimatePresence>
        {isOrdersOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOrdersOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase italic leading-none">Booking History</h2>
                  <p className="text-[9px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest underline decoration-blue-500/20">All Transactions for {user?.name}</p>
                </div>
                <button onClick={() => setIsOrdersOpen(false)} className="rounded-full bg-slate-200 p-1.5 text-slate-500 hover:text-slate-900 transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 bg-slate-100 rounded-full mx-auto flex items-center justify-center text-slate-300 mb-4">
                      <Activity size={32} />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">No bookings found yet.</p>
                    <button 
                      onClick={() => { setIsOrdersOpen(false); setCurrentPage('blood-tests'); }}
                      className="mt-4 px-6 py-2.5 bg-red-700 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg"
                    >
                      Browse Tests
                    </button>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-blue-200 transition-all group">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                        <div>
                          <p className="text-[10px] font-black text-dark-lavender uppercase tracking-widest mb-0.5">Order Ref: {order.id}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{order.date}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                           <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full ${
                             order.status === 'Paid' ? 'bg-vivid-teal/10 text-vivid-teal' : 'bg-slate-100 text-slate-600'
                           }`}>
                             {order.status}
                           </span>
                           <span className="text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-900 text-white">
                             {order.paymentMethod}
                           </span>
                        </div>
                      </div>

                      <div className="bg-slate-100/50 p-3 rounded-xl mb-4">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Patient & Collection Point</p>
                        <div className="grid grid-cols-2 gap-3">
                           <div>
                             <p className="text-[10px] font-black text-slate-900 uppercase italic truncate">{order.patient?.name}</p>
                             <p className="text-[8.5px] font-bold text-slate-400 mt-0.5">{order.patient?.age}Y • {order.patient?.gender} • {order.patient?.phone}</p>
                           </div>
                           <div className="text-right">
                             <p className="text-[8.5px] font-black text-slate-900 uppercase leading-none truncate">{order.patient?.address}</p>
                             <p className="text-[8.5px] font-bold text-electrical-purple mt-1 uppercase italic tracking-tighter">Verified Slot: {order.slot}</p>
                           </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 mb-4">
                        {order.items.map((item: any) => (
                           <div key={item.id} className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-100">
                             <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-vivid-teal" />
                                <p className="text-[10px] font-black text-slate-700 uppercase">{item.name}</p>
                             </div>
                             <p className="text-[9.5px] font-black text-red-600 font-mono">₹{item.price}</p>
                           </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-dashed border-slate-200">
                        <div className="flex gap-3 items-center">
                          <div>
                            <p className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest">Selected Slot</p>
                            <p className="text-[9px] font-black text-slate-900 uppercase">{order.slot}</p>
                          </div>
                          <button 
                            onClick={() => downloadReceipt(order)}
                            className="bg-vivid-teal/5 text-vivid-teal p-1.5 rounded-lg border border-vivid-teal/10 hover:bg-dark-lavender hover:text-white transition-all flex items-center gap-1.5 text-[8px] font-black"
                          >
                            <Download size={10} /> RECEIPT
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</p>
                          <p className="text-base font-black text-slate-900 font-mono tracking-tighter">₹{order.total.toFixed(0)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="p-6 bg-dark-lavender text-white flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/50">WhatsApp Support (6 AM - 6 PM)</p>
                  <p className="text-[11px] font-black">+91 8328139956</p>
                </div>
                <button 
                  onClick={() => window.open('https://wa.me/918328139956', '_blank')}
                  className="bg-vivid-teal hover:bg-black px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-vivid-teal/20"
                >
                  Contact Support
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isLoginOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.2)] p-10 overflow-hidden border border-white"
            >
              <div className="mb-10 flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
                    {loginStep === 'details' && 'Welcome.'}
                    {loginStep === 'address' && 'Location.'}
                    {loginStep === 'otp' && 'Verify.'}
                  </h2>
                  <p className="text-[10px] font-black text-vivid-teal mt-2 uppercase tracking-[0.2em] opacity-80">
                    {loginStep === 'details' && 'Login to your account'}
                    {loginStep === 'address' && 'Set collection address'}
                    {loginStep === 'otp' && 'Enter verification code'}
                  </p>
                </div>
                <button onClick={() => { setIsLoginOpen(false); setLoginStep('details'); }} className="rounded-2xl bg-slate-50 p-3 text-slate-400 hover:text-slate-900 transition-all hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>

              {loginStep === 'details' ? (
                <form onSubmit={handleDetailsSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1 group-focus-within:text-vivid-teal transition-colors">Patient Name</label>
                      <input 
                        required
                        name="name"
                        type="text" 
                        placeholder="John Doe"
                        className="w-full rounded-2xl bg-slate-50 border-2 border-slate-50 px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-vivid-teal focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-[2] group">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1 group-focus-within:text-vivid-teal transition-colors">Age</label>
                        <input 
                          required
                          name="age"
                          type="number" 
                          min="1"
                          max="120"
                          placeholder="25"
                          className="w-full rounded-2xl bg-slate-50 border-2 border-slate-50 px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-vivid-teal focus:bg-white transition-all shadow-sm"
                        />
                      </div>
                      <div className="flex-[3] group">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1 group-focus-within:text-vivid-teal transition-colors">Gender</label>
                        <select 
                          required
                          name="gender"
                          className="w-full rounded-2xl bg-slate-50 border-2 border-slate-50 px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-vivid-teal focus:bg-white transition-all shadow-sm appearance-none"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1 group-focus-within:text-vivid-teal transition-colors">Mobile Number</label>
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-sm font-black text-slate-300">+91</span>
                        <input 
                          required
                          name="phone"
                          type="tel" 
                          pattern="[0-9]{10}"
                          placeholder="XXXXXXXXXXX"
                          className="w-full rounded-2xl bg-slate-50 border-2 border-slate-50 pl-16 pr-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-vivid-teal focus:bg-white transition-all shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    type="submit"
                    className="group relative w-full rounded-2xl bg-vivid-teal py-5 text-sm font-black text-white shadow-2xl shadow-vivid-teal/20 hover:bg-black transition-all active:scale-[0.98] uppercase tracking-[0.2em]"
                  >
                    CONTINUE
                    <ChevronRight size={18} className="absolute right-6 top-1/2 -translate-y-1/2 opacity-40 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  </button>
                </form>
              ) : loginStep === 'address' ? (
                 <AddressPicker onConfirm={handleAddressSubmit} />
              ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-8">
                   <div className="text-center">
                      <div className="mx-auto h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-900 mb-6">
                        <Lock size={32} />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Code sent to</p>
                      <p className="text-sm font-black text-slate-900 mb-3">+91 {tempUser?.phone}</p>
                      <div className="inline-block bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                        OTP: <span className="text-red-700 font-mono font-black text-xs">1234</span> (AUTO-SENT & PRE-FILLED)
                      </div>
                   </div>
                   
                   <div className="flex justify-center">
                      <input 
                        required
                        autoFocus
                        maxLength={4}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="----"
                        className="w-40 text-center text-5xl font-black tracking-[0.4em] bg-transparent border-b-4 border-vivid-teal focus:outline-none py-3 text-slate-900 placeholder:text-slate-100"
                      />
                   </div>

                   <div className="space-y-4">
                     <button 
                      type="submit"
                      className="w-full rounded-2xl bg-slate-900 py-5 text-sm font-black text-white shadow-2xl shadow-slate-200 hover:bg-black transition-all active:scale-[0.98] uppercase tracking-[0.2em]"
                    >
                      VERIFY OTP
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => setLoginStep('details')}
                      className="w-full text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-red-700 transition-colors"
                    >
                      Edit details
                    </button>
                   </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Test Preview Modal */}
      <AnimatePresence>
        {previewTest && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewTest(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2rem] overflow-y-auto max-h-[90vh] shadow-2xl border border-slate-200"
            >
              {(() => {
                const detailsInfo = getTestDetails(previewTest);
                return (
                  <>
                    <div className="bg-gradient-to-r from-teal-900 to-slate-900 p-6 md:p-8 text-white relative">
                       <button 
                        onClick={() => setPreviewTest(null)}
                        className="absolute right-5 top-5 h-8 w-8 flex items-center justify-center bg-white/10 rounded-full text-white hover:bg-white/25 transition-all shadow-sm"
                       >
                         <X size={16} />
                       </button>
                       <div className="flex items-center gap-4">
                          <div>
                            <div className="flex gap-2 items-center mb-1.5 flex-wrap text-left">
                              <span className="text-[8px] font-black uppercase tracking-[0.25em] text-[#14b6a2] bg-[#14b6a2]/10 px-2 py-0.5 rounded-md border border-[#14b6a2]/20">{previewTest.category}</span>
                              <span className="text-[8px] font-black uppercase tracking-[0.25em] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">{previewTest.department}</span>
                            </div>
                            <h3 className="text-lg md:text-xl font-black uppercase italic font-display leading-tight text-left">{previewTest.name}</h3>
                          </div>
                       </div>
                    </div>
                    
                    <div className="p-6 md:p-8">
                       {/* Core Prep Details Row */}
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3 text-left">
                             <div className="p-2 bg-amber-500/10 rounded-xl text-amber-600">
                               <Clock size={16} />
                             </div>
                             <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">PATIENT PREPARATION GUIDELINES</p>
                                <p className="text-xs font-black text-slate-800 uppercase italic leading-tight">{detailsInfo.fasting}</p>
                             </div>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3 text-left">
                             <div className="p-2 bg-blue-500/10 rounded-xl text-blue-600">
                               <TestTube size={16} />
                             </div>
                             <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">SPECIMEN PREFERRED</p>
                                <p className="text-xs font-black text-slate-800 uppercase italic leading-tight">{detailsInfo.sample}</p>
                             </div>
                          </div>
                       </div>

                       {/* Turnaround Time Announcement */}
                       <div className="p-4 mb-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex items-center gap-3 text-left">
                         <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-600 shrink-0">
                           <ShieldCheck size={16} />
                         </div>
                         <div>
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">GUARANTEED REPORT TIME (TAT)</p>
                           <p className="text-xs font-black text-emerald-800 uppercase leading-tight">{detailsInfo.tat} — Sent via Encrypted WhatsApp & Email</p>
                         </div>
                       </div>

                       {previewTest.category === "Radiology" && (
                         <div className="p-4 mb-6 bg-blue-500/5 rounded-2xl border border-blue-500/15 flex items-start gap-4 text-left">
                           <div className="p-2 bg-blue-500/10 rounded-xl text-blue-600 shrink-0">
                             <MapPin size={16} className="text-blue-600 animate-bounce" />
                           </div>
                           <div>
                             <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest leading-none mb-1">📍 PARTNER LAB VISIT REQUIRED</p>
                             <p className="text-[10.5px] font-black text-slate-700 uppercase leading-relaxed font-sans">
                               RADIOLOGY TEST VISIT TO CENTER IN PARTNER LABS. Home sample collection is not applicable for this category. Our team will arrange a hassle-free appointment slot at the nearest partner facility for you.
                             </p>
                           </div>
                         </div>
                       )}

                       {/* Components Tested List */}
                       <div className="mb-6 text-left">
                          <h4 className="text-xs font-black uppercase tracking-widest text-[#14b6a2] mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                             <Activity size={12} /> Parameters Evaluated ({detailsInfo.parameters.length})
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {detailsInfo.parameters.map((param, pIdx) => (
                              <div key={pIdx} className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100/50 rounded-xl transition-all border border-slate-100 text-left">
                                <CheckCircle2 size={12} className="text-[#14b6a2] shrink-0" />
                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{param}</span>
                              </div>
                            ))}
                          </div>
                       </div>

                       {/* Clinical Significance */}
                       <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
                          <h4 className="text-xs font-black uppercase tracking-widest text-dark-lavender mb-2 flex items-center gap-1.5">
                             <Info size={13} className="text-[#14b6a2]" /> Clinical Importance
                          </h4>
                          <p className="text-slate-600 font-bold leading-relaxed text-[11px] text-justify uppercase tracking-wide">
                             {previewTest.details}. Under NABL quality directions, sample draws are executed by sterile single-use vacuum systems. Chain integrity and sub-4°C transport maintain high analytical fidelity.
                          </p>
                       </div>

                       {/* Billing and CTA */}
                       <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-6">
                          <div className="flex flex-col text-left">
                             <p className="text-[8px] font-black text-red-500 line-through tracking-widest uppercase mb-0.5">MRP: ₹{previewTest.originalPrice || (previewTest.price * 2.0).toFixed(0)}</p>
                             <p className="text-xl font-black text-dark-lavender font-display italic tracking-tighter leading-none">₹{previewTest.price.toFixed(0)}</p>
                             <p className="text-[8px] font-bold text-green-600 uppercase tracking-wider mt-1">Special Online Dynamic Price</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setPreviewTest(null)}
                              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-[9px] font-black uppercase tracking-widest italic transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => {
                                addToCart(previewTest);
                                setPreviewTest(null);
                              }}
                              className="rounded-xl bg-[#14b6a2] hover:bg-[#119e8c] px-5 py-2.5 text-[9px] font-black text-white shadow-lg shadow-teal-500/20 transition-all active:scale-95 uppercase tracking-widest italic cursor-pointer animate-pulse"
                            >
                              Book Test Now
                            </button>
                          </div>
                       </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface BusinessHubProps {
  businessVpa: string;
  setBusinessVpa: (v: string) => void;
  businessPhone: string;
  setBusinessPhone: (v: string) => void;
  autoOpenWhatsapp: boolean;
  setAutoOpenWhatsapp: (v: boolean) => void;
  smsAlertsEnabled: boolean;
  setSmsAlertsEnabled: (v: boolean) => void;
}

function BusinessIntegrationHub({
  businessVpa,
  setBusinessVpa,
  businessPhone,
  setBusinessPhone,
  autoOpenWhatsapp,
  setAutoOpenWhatsapp,
  smsAlertsEnabled,
  setSmsAlertsEnabled
}: BusinessHubProps) {
  const [activeTab, setActiveTab] = useState<"phonepe" | "gpay" | "razorpay">("phonepe");
  const [activeCodeTab, setActiveCodeTab] = useState<"node" | "python" | "curl">("node");
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(label);
    setTimeout(() => setCopySuccess(null), 1500);
  };

  const codeSnippets = {
    node: `// server.ts - Automated Booking Notifications
import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// API Key Config (Store in .env file securely!)
const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY || "your_api_key_here";
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN || "your_meta_token_here";

app.post("/api/bookings/confirm", async (req, res) => {
  const { orderId, patientPhone, patientName, total, slot, tests } = req.body;

  try {
    // 1. Direct 100% Free WhatsApp Webhook / Business API Alert
    const waMessage = \\\`Aarvik Health Labs: Booking Confirmed! Order ID: \\\${orderId}. Patient: \\\${patientName}. Slot: \\\${slot}. Total Amount: Rs.\\\${total}. Our technician will contact you shortly.\\\`;
    await axios.post(\\\`https://graph.facebook.com/v18.0/your-phone-number-id/messages\\\`, {
      messaging_product: "whatsapp",
      to: \\\`91\\\${patientPhone}\\\`,
      type: "text",
      text: { body: waMessage }
    }, {
      headers: { Authorization: \\\`Bearer \\\${WHATSAPP_API_TOKEN}\\\` }
    });

    // 2. Automated SMS Dispatch using Fast2SMS / Twilio
    await axios.post("https://www.fast2sms.com/dev/bulkV2", {
      route: "q",
      message: \\\`Aarvik Health Labs: Booking Confirmed! Ref: \\\${orderId}. Name: \\\${patientName}. Slot: \\\${slot}. Total: Rs.\\\${total}. Terima kasih!\\\`,
      language: "english",
      flash: 0,
      numbers: patientPhone
    }, {
      headers: { authorization: FAST2SMS_API_KEY }
    });

    res.json({ success: true, message: "Direct notifications dispatched to Patient!" });
  } catch (err: any) {
    console.error("Auto message failed:", err.message);
    res.status(500).json({ error: "Failed to dispatch messages directly." });
  }
});`,
    python: `# automated_notifications.py
import requests

def send_direct_notifications(order_id, phone, name, amount, slot):
    # 1. Dispatch Free WhatsApp Notification (Meta Cloud API)
    wa_url = "https://graph.facebook.com/v18.0/your-phone-number-id/messages"
    wa_headers = { "Authorization": f"Bearer YOUR_META_TOKEN" }
    wa_payload = {
        "messaging_product": "whatsapp",
        "to": f"91{phone}",
        "type": "text",
        "text": { "body": f"Aarvik Health Labs: Booking #{order_id} Confirmed! Amount: Rs.{amount}. Slot: {slot}. thanks!" }
    }
    requests.post(wa_url, json=wa_payload, headers=wa_headers)

    # 2. Dispatch Bulk SMS (Fast2SMS Gateway)
    sms_url = "https://www.fast2sms.com/dev/bulkV2"
    sms_payload = {
        "route": "q",
        "message": f"Aarvik Health Labs: Booking Ref {order_id} confirmed for {name}. Slot: {slot}. Total: Rs.{amount}.",
        "language": "english",
        "numbers": phone
    }
    sms_headers = { "authorization": "YOUR_FAST2SMS_KEY" }
    requests.post(sms_url, json=sms_payload, headers=sms_headers)
`,
    curl: `# Trigger Notification Trigger REST request
curl -X POST https://www.fast2sms.com/dev/bulkV2 \\
  -H "authorization: YOUR_FAST2SMS_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "route": "q",
    "message": "Aarvik Health Labs: Booking Confirmed! Our phlebotomist is scheduled.",
    "language": "english",
    "numbers": "8328139956"
  }'`
  };

  return (
    <section className="bg-slate-950 py-12 text-slate-100 min-h-screen relative overflow-hidden">
      {/* Visual background lights */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 md:px-6 relative z-10 space-y-8">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-500 text-[10px] font-black uppercase tracking-widest leading-none">
            <Zap size={10} className="animate-pulse" /> Aarvik Labs Elite Console
          </div>
          <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight font-display text-white">
            👑 Business Gateway & Alerts Hub
          </h2>
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest max-w-2xl mx-auto">
            Configure free business payment gateways and automate direct SMS/WhatsApp notification dispatch to patient devices instantly.
          </p>
        </div>

        {/* Live configuration playground */}
        <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-1 bg-gradient-to-l from-emerald-500/10 to-transparent text-[8px] font-black text-emerald-400 uppercase tracking-widest rounded-bl-xl border-b border-l border-slate-800">
            ● Active Workspaces Play
          </div>

          <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Smartphone size={16} className="text-emerald-400" /> Live Configuration Playground (లైవ్ అప్లికేషన్ కాన్ఫిగరేషన్)
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[8.5px] font-black uppercase tracking-widest text-[#94a3b8] mb-1.5">
                  Merchant UPI VPA (ఆక్టివ్ బిజినెస్ VPA)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={businessVpa}
                    onChange={(e) => setBusinessVpa(e.target.value.trim())}
                    placeholder="mahipalzah-3@oksbi"
                    className="w-full bg-slate-950/80 border border-slate-700/60 p-3 rounded-2xl text-xs font-mono font-bold text-white focus:border-emerald-500 outline-none placeholder-slate-600 transition-colors shadow-inner"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[8px] font-mono font-black text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    Active VPA
                  </span>
                </div>
                <p className="text-[7.5px] font-bold text-slate-500 uppercase leading-relaxed mt-1">
                  Updates all PhonePe/Google Pay/Paytm QR scan targets dynamically across the booking engine instantly.
                </p>
              </div>

              <div>
                <label className="block text-[8.5px] font-black uppercase tracking-widest text-[#94a3b8] mb-1.5">
                  Lab Hotline / Admin Mobile Number (కస్టమర్ కేర్ నంబర్)
                </label>
                <input
                  type="text"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="8328139956"
                  maxLength={10}
                  className="w-full bg-slate-950/80 border border-slate-700/60 p-3 rounded-2xl text-xs font-mono font-bold text-white focus:border-emerald-500 outline-none placeholder-slate-600 transition-colors shadow-inner"
                />
                <p className="text-[7.5px] font-bold text-slate-500 uppercase leading-relaxed mt-1">
                  Direct customer support helpline number. Replaces hotline call triggers instantly.
                </p>
              </div>
            </div>

            <div className="space-y-4 bg-slate-950/40 p-5 rounded-2xl border border-slate-800/80 justify-center flex flex-col">
              <h4 className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 leading-none">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Automation Channels Set
              </h4>

              <div className="space-y-3.5">
                <label className="flex items-center justify-between cursor-pointer select-none group">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-white uppercase group-hover:text-emerald-400 transition-colors">Direct Patients WhatsApp Redirection</p>
                    <p className="text-[7.5px] font-bold text-slate-400 uppercase leading-none">Auto-open patient whatsapp window on checkout success</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoOpenWhatsapp}
                    onChange={(e) => setAutoOpenWhatsapp(e.target.checked)}
                    className="h-4 w-4 rounded bg-slate-900 accent-emerald-500 cursor-pointer"
                  />
                </label>

                <hr className="border-slate-800/50" />

                <label className="flex items-center justify-between cursor-pointer select-none group">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-white uppercase group-hover:text-emerald-400 transition-colors">Direct SMS Alert Queuing</p>
                    <p className="text-[7.5px] font-bold text-slate-400 uppercase leading-none">Allow background patient and phlebotomist SMS alerts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsAlertsEnabled}
                    onChange={(e) => setSmsAlertsEnabled(e.target.checked)}
                    className="h-4 w-4 rounded bg-slate-900 accent-emerald-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 100% Free gateway guides with visuals */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-2 border-b border-slate-800 pb-2.5">
            <h3 className="text-base font-black italic uppercase text-white tracking-tight flex items-center gap-2">
              <CreditCard size={18} className="text-amber-500" /> Free Business Payment Gateways Setup (0% చార్జీలు)
            </h3>
            <span className="text-[8px] font-mono font-black text-amber-500 uppercase tracking-widest leading-none bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              0% MDR • Zero commissions
            </span>
          </div>

          <p className="text-[9.5px] font-bold text-slate-400 uppercase leading-relaxed text-left">
            Third-party payment gateways (like Razorpay standard CC/DC/Netbanking) often charge 2% to 3% transaction rates. For healthcare and small diagnostic labs, <strong className="text-emerald-400">Direct UPI Business APIs</strong> are 100% FREE OF COST. Customers pay directly into your bank account with absolute 0% transaction commissions. Here is how to setup:
          </p>

          <div className="flex gap-2.5 border-b border-slate-800/80 pb-0.5">
            {[
              { id: "phonepe", label: "PhonePe for Business" },
              { id: "gpay", label: "Google Pay for Business" },
              { id: "razorpay", label: "Razorpay (Free UPI Transfer)" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2.5 px-3 text-[10px] font-black uppercase tracking-widest relative cursor-pointer select-none ${
                  activeTab === tab.id ? "text-white font-extrabold" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
                )}
              </button>
            ))}
          </div>

          <motion.div
            layout
            className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800/80 text-left space-y-4"
          >
            {activeTab === "phonepe" && (
              <div className="space-y-3">
                <h4 className="text-xs font-black text-[#5f259f] uppercase tracking-wider flex items-center gap-1.5 leading-none">
                  🌟 PhonePe Business Account Activation Guide (కస్టమర్ పేమెంట్ నేరుగా మీ బ్యాంక్ లోకి!)
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-[10px] font-bold text-slate-300 uppercase leading-relaxed tracking-wide">
                  <li>Download and install the <strong className="text-white">PhonePe Business App</strong> from the Google Play/iOS App Store.</li>
                  <li>Register using your business mobile number (<strong className="text-emerald-400">{businessPhone}</strong>). Verify with instant OTP.</li>
                  <li>Enter your PAN Card and Bank Account details where you want manual/instant settlements.</li>
                  <li>Upon verification, your business gets a <strong className="text-white font-mono">Custom VPA Address</strong> (e.g., <span className="text-amber-300 font-mono italic">aarviklabs@ybl</span> or <span className="text-amber-300 font-mono italic">mahipal@oksbi</span>) and a high-contrast printable QR Core.</li>
                  <li>Copy your new business VPA Address and paste it in the playground above. The entire system adapts immediately!</li>
                </ol>
                <div className="bg-[#5f259f]/10 border border-[#5f259f]/20 p-3 rounded-2xl flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-[#5f259f] flex items-center justify-center text-white text-xs font-black italic">Pe</div>
                  <p className="text-[7.5px] font-bold text-slate-300 uppercase leading-relaxed">
                    <strong className="text-[#a855f7] font-black">BENEFIT:</strong> 100% Free direct merchant payment. 0% Commission (నో చార్జీలు). Payments land immediately in your bank at midnight or instantly.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "gpay" && (
              <div className="space-y-3">
                <h4 className="text-xs font-black text-sky-400 uppercase tracking-wider flex items-center gap-1.5 leading-none">
                  🌟 Google Pay for Business Console Setup (సులభమైన గూగుల్ పే ఆక్టివేషన్)
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-[10px] font-bold text-slate-300 uppercase leading-relaxed tracking-wide">
                  <li>Download the <strong className="text-white">Google Pay for Business App</strong> from the App Store.</li>
                  <li>Sign in with your business Gmail credentials. Ensure the linked mobile number is active.</li>
                  <li>Input your business category (Pathology diagnostics laboratories/Clinic/Services) and provide laboratory bank particulars.</li>
                  <li>You will instantly receive your Google Merchant ID and a custom GPay virtual address VPA (e.g., <span className="text-amber-300 font-mono italic font-bold">mahipalzah-3@oksbi</span>).</li>
                  <li>Update the Merchant VPA in our playground above. Customers can pay directly and verify payments instantly from GPay.</li>
                </ol>
                <div className="bg-sky-500/5 border border-sky-400/20 p-3 rounded-2xl flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center text-[10px] font-black shrink-0">
                    <span className="text-blue-500">G</span><span className="text-red-500">P</span>
                  </div>
                  <p className="text-[7.5px] font-bold text-slate-300 uppercase leading-relaxed">
                    <strong className="text-sky-400 font-black">BENEFIT:</strong> Direct merchant-verified sound notifications, instant 0% fee transaction settles directly in under 10 seconds. Highly trusted by patients in Hyderabad.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "razorpay" && (
              <div className="space-y-3">
                <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 leading-none">
                  🌟 Razorpay UPI-Only Tier Setup (క్రెడిట్ కార్డ్ మరియు నెట్ బ్యాంకింగ్ ఆప్షన్స్ తో)
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-[10px] font-bold text-slate-300 uppercase leading-relaxed tracking-wide">
                  <li>Navigate to <strong className="text-white">razorpay.com</strong> and open a direct Merchant instance.</li>
                  <li>De-select credit cards & debit cards in Settings; enable only <strong className="text-[#10b981]">Direct UPI Transactions</strong>.</li>
                  <li>Configure the payment flow to use direct UPI deeplink transfers. This bypasses the typical 2% Gateway MDR fee entirely!</li>
                  <li>Razorpay will settle your payouts to your designated business bank account directly.</li>
                </ol>
                <div className="bg-emerald-500/5 border border-emerald-400/25 p-3 rounded-2xl flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <p className="text-[7.5px] font-bold text-slate-300 uppercase leading-relaxed">
                    <strong className="text-emerald-400 font-black">PRO TIP:</strong> Direct cash-on-visit combined with 0% free UPI scanning provides a hybrid checkout that completely guarantees zero commissions while keeping laboratory accounting 100% digital!
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* API notification codes */}
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-2.5">
            <h3 className="text-base font-black italic uppercase text-white tracking-tight flex items-center gap-2">
              <Zap size={18} className="text-emerald-400" /> Automated REST API Integration (ఆటోమేటిక్ మెసేజ్ కోడింగ్ గైడ్)
            </h3>
          </div>

          <p className="text-[9.5px] font-bold text-slate-400 uppercase leading-relaxed text-left">
            Since client-side websites cannot send SMS/WhatsApp background alerts directly without third-party integration server pipelines, you must deploy a small backend service. Below are ready-to-run copyable codes using <strong className="text-emerald-400">Fast2SMS (cheapest direct SMS gateway)</strong> and <strong className="text-[#25D366]">Meta WhatsApp Official Cloud API</strong>:
          </p>

          <div className="flex gap-2.5 border-b border-slate-800/80 pb-0.5">
            {[
              { id: "node", label: "Express / Node.js Endpoint" },
              { id: "python", label: "Python Automation Routine" },
              { id: "curl", label: "cURL Test Command" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCodeTab(tab.id as any)}
                className={`pb-2.5 px-3 text-[10px] font-black uppercase tracking-widest relative cursor-pointer select-none ${
                  activeCodeTab === tab.id ? "text-white font-extrabold" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab.label}
                {activeCodeTab === tab.id && (
                  <motion.div layoutId="activeCodeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
                )}
              </button>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden shadow-xl text-left">
            <div className="bg-slate-950 p-2.5 flex justify-between items-center border-b border-slate-850">
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-none">
                File: {activeCodeTab === "node" ? "server.ts" : (activeCodeTab === "python" ? "notify.py" : "test.sh")}
              </span>
              <button
                onClick={() => handleCopy(codeSnippets[activeCodeTab], activeCodeTab)}
                className="inline-flex items-center gap-1 text-[8.5px] font-black text-emerald-400 uppercase tracking-widest hover:text-white transition-colors cursor-pointer leading-none"
              >
                <Copy size={10} />
                {copySuccess === activeCodeTab ? "Copied! (కాపీ చేయబడింది)" : "Copy Code"}
              </button>
            </div>
            <pre className="p-4 text-[9px] font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[340px] select-all bg-black/60">
              <code>{codeSnippets[activeCodeTab]}</code>
            </pre>
          </div>
        </div>

        {/* Footer Support Message */}
        <div className="bg-gradient-to-r from-emerald-950/20 via-neutral-900/10 to-slate-950/20 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 text-left">
          <div className="space-y-1">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5 leading-none">
              Need Direct Integration Deployments?
            </h4>
            <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed max-w-xl">
              We can help you configure your live WhatsApp Business Cloud API or link PhonePe Business webhooks straight to the custom database instance easily. Direct message using the hotline hot link anytime.
            </p>
          </div>
          <button
            onClick={() => window.open(`https://wa.me/91${businessPhone}?text=Hi%20Aarvik%20Health%20Labs%2C%20help%20me%20configure%20live%20WhatsApp%20API%20and%20PhonePe%20Business%20inside%20the%20app!`, '_blank')}
            className="px-5 py-3 rounded-2xl bg-[#25D366] hover:bg-[#128C7E] text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 shadow-lg shadow-[#25D366]/10 active:scale-95 cursor-pointer"
          >
            <MessageCircle size={12} fill="currentColor" /> Chat with Admin Hotline
          </button>
        </div>
      </div>
    </section>
  );
}

const amountToWords = (amount: number): string => {
  if (amount === 0) return "Zero Rupees Only";
  
  const singleDigits = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const doubleDigits = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  
  const convert = (n: number): string => {
    if (n < 10) return singleDigits[n];
    if (n < 20) return doubleDigits[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + singleDigits[n % 10] : "");
    if (n < 1000) return singleDigits[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + convert(n % 100) : "");
    if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + convert(n % 1000) : "");
    if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + convert(n % 100000) : "");
    return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 !== 0 ? " " + convert(n % 10000000) : "");
  };
  
  return convert(Math.floor(amount)) + " Rupees Only";
};

