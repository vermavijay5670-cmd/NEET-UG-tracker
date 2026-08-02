import type { Subject } from "./types";

export const CHAPTERS: Record<Subject, Record<11 | 12, string[]>> = {
  phy: {
    11: [
      "Units and Measurements",
      "Motion in a Straight Line",
      "Motion in a Plane",
      "Laws of Motion",
      "Work, Energy and Power",
      "System of Particles and Rotational Motion",
      "Gravitation",
      "Mechanical Properties of Solids",
      "Mechanical Properties of Fluids",
      "Thermal Properties of Matter",
      "Thermodynamics",
      "Kinetic Theory",
      "Oscillations",
      "Waves",
    ],
    12: [
      "Electric Charges and Fields",
      "Electrostatic Potential and Capacitance",
      "Current Electricity",
      "Moving Charges and Magnetism",
      "Magnetism and Matter",
      "Electromagnetic Induction",
      "Alternating Current",
      "Electromagnetic Waves",
      "Ray Optics and Optical Instruments",
      "Wave Optics",
      "Dual Nature of Radiation and Matter",
      "Atoms",
      "Nuclei",
      "Semiconductor Electronics",
    ],
  },
  chem: {
    11: [
      "Some Basic Concepts of Chemistry",
      "Structure of Atom",
      "Classification of Elements and Periodicity in Properties",
      "Chemical Bonding and Molecular Structure",
      "Thermodynamics",
      "Equilibrium",
      "Redox Reactions",
      "Organic Chemistry – Basic Principles and Techniques",
      "Hydrocarbons",
    ],
    12: [
      "Solutions",
      "Electrochemistry",
      "Chemical Kinetics",
      "The d- and f-Block Elements",
      "Coordination Compounds",
      "Haloalkanes and Haloarenes",
      "Alcohols, Phenols and Ethers",
      "Aldehydes, Ketones and Carboxylic Acids",
      "Amines",
      "Biomolecules",
    ],
  },
  bio: {
    11: [
      "The Living World",
      "Biological Classification",
      "Plant Kingdom",
      "Animal Kingdom",
      "Morphology of Flowering Plants",
      "Anatomy of Flowering Plants",
      "Structural Organisation in Animals",
      "Cell: The Unit of Life",
      "Biomolecules",
      "Cell Cycle and Cell Division",
      "Photosynthesis in Higher Plants",
      "Respiration in Plants",
      "Plant Growth and Development",
      "Breathing and Exchange of Gases",
      "Body Fluids and Circulation",
      "Excretory Products and their Elimination",
      "Locomotion and Movement",
      "Neural Control and Coordination",
      "Chemical Coordination and Integration",
    ],
    12: [
      "Sexual Reproduction in Flowering Plants",
      "Human Reproduction",
      "Reproductive Health",
      "Principles of Inheritance and Variation",
      "Molecular Basis of Inheritance",
      "Evolution",
      "Human Health and Disease",
      "Microbes in Human Welfare",
      "Biotechnology: Principles and Processes",
      "Biotechnology and its Applications",
      "Organisms and Populations",
      "Ecosystem",
      "Biodiversity and Conservation",
    ],
  },
};

export const SUBJECT_NAME: Record<Subject, string> = {
  phy: "Physics",
  chem: "Chemistry",
  bio: "Biology",
};

// Every card gets exactly one accent — no blended colors inside a card.
export type Accent = "lime" | "purple" | "cyan" | "emerald" | "gold";

export const SUBJECT_ACCENT: Record<Subject, Accent> = {
  phy: "purple",
  chem: "cyan",
  bio: "emerald",
};

export const ACCENT_HEX: Record<Accent, string> = {
  lime: "#C7F12D",
  purple: "#7B4DFF",
  cyan: "#46FFE8",
  emerald: "#41FF72",
  gold: "#FFD64D",
};

// Once each subject's question-practice site is ready, replace `null` with its URL.
// The page automatically switches that subject's card from "Coming soon" to a live link.
export const QUESTION_PRACTICE_LINKS: Record<Subject, string | null> = {
  phy: null,
  chem: null,
  bio: "https://question-practice.lovable.app",
};

// Subtopic breakdowns per chapter — index-aligned with CHAPTERS[subject][cls].
// Only Biology is filled in for now; add phy/chem entries the same way when needed.
export const SUBTOPICS: Partial<Record<Subject, Record<11 | 12, string[][]>>> = {
  bio: {
    11: [
      ["What Is Living?", "Biodiversity", "Taxonomy & Systematics", "Taxonomic Hierarchy", "Taxonomical Aids"],
      ["Kingdom Monera", "Kingdom Protista", "Kingdom Fungi", "Viruses, Viroids & Lichens", "Kingdom Plantae", "Kingdom Animalia"],
      ["Algae", "Bryophytes", "Pteridophytes", "Gymnosperms", "Angiosperms", "Plant Life Cycles & Alternation of Generations"],
      ["Basis of Classification", "Non-Chordate Phyla (up to Phylum)", "Chordate Classes"],
      ["The Root", "The Stem", "The Leaf", "The Inflorescence", "The Flower", "The Fruit", "The Seed", "Semi-Technical Description"],
      ["Tissues", "Tissue Systems", "Anatomy of Dicot Plants", "Anatomy of Monocot Plants", "Secondary Growth"],
      ["Animal Tissues", "Organ & Organ Systems", "Earthworm", "Cockroach", "Frog"],
      ["Cell Theory", "Prokaryotic Cells", "Eukaryotic Cells", "Cell Membrane", "Cell Wall", "Endomembrane System", "Mitochondria", "Plastids", "Ribosomes", "Cytoskeleton, Cilia & Flagella", "Nucleus", "Microbodies"],
      ["Chemical Composition Analysis", "Primary & Secondary Metabolites", "Biomacromolecules", "Proteins", "Nucleic Acids", "Enzymes", "Bonds Linking Monomers"],
      ["Cell Cycle Phases", "M Phase (Mitosis)", "Significance of Mitosis", "Meiosis", "Significance of Meiosis"],
      ["Pigments Involved", "Light Reactions", "Electron Transport", "Cyclic & Non-Cyclic Photophosphorylation", "Chemiosmotic Hypothesis", "Calvin Cycle (Dark Reaction)", "C4 Pathway", "Photorespiration", "Factors Affecting Photosynthesis"],
      ["Glycolysis", "Fermentation", "Aerobic Respiration", "Krebs Cycle", "Electron Transport System & Oxidative Phosphorylation", "Respiratory Balance Sheet", "Amphibolic Pathway", "Respiratory Quotient"],
      ["Growth", "Differentiation, Dedifferentiation & Redifferentiation", "Development", "Plant Growth Regulators", "Photoperiodism", "Vernalisation"],
      ["Respiratory Organs", "Human Respiratory System", "Mechanism of Breathing", "Exchange of Gases", "Transport of Gases", "Regulation of Respiration", "Disorders"],
      ["Blood", "Lymph", "Circulatory Pathways", "Human Circulatory System", "Cardiac Cycle", "ECG", "Double Circulation", "Regulation of Cardiac Activity", "Disorders"],
      ["Human Excretory System", "Urine Formation", "Function of Tubules", "Concentration of Filtrate", "Regulation of Kidney Function", "Micturition", "Role of Other Organs", "Disorders"],
      ["Types of Movement", "Muscle", "Skeletal System", "Joints", "Disorders"],
      ["Neuron & Nerves", "Central Neural System", "Reflex Action", "Sensory & Motor Mechanisms", "Human Brain", "Eye", "Ear"],
      ["Endocrine Glands & Hormones", "Human Endocrine System", "Hormones of Heart, Kidney & GIT", "Mechanism of Hormone Action"],
    ],
    12: [
      ["Flower Structure", "Pre-Fertilisation Events", "Pollination", "Double Fertilisation", "Post-Fertilisation Events", "Apomixis & Polyembryony"],
      ["Male Reproductive System", "Female Reproductive System", "Gametogenesis", "Menstrual Cycle", "Fertilisation & Implantation", "Pregnancy & Embryonic Development", "Parturition & Lactation"],
      ["Reproductive Health Problems", "Population Stabilisation", "Contraception", "MTP", "STDs", "Infertility & ART"],
      ["Mendel's Laws", "Inheritance of One/Two Genes", "Chromosomal Theory", "Linkage & Recombination", "Sex Determination", "Mutation", "Genetic Disorders"],
      ["DNA Structure", "DNA Packaging", "DNA Replication", "Transcription", "Genetic Code", "Translation", "Gene Regulation (Lac Operon)", "Human Genome Project", "DNA Fingerprinting"],
      ["Origin of Life", "Evidences for Evolution", "Adaptive Radiation", "Mechanism of Evolution", "Hardy-Weinberg Principle", "Natural Selection", "Human Evolution"],
      ["Common Diseases", "Immunity", "AIDS", "Cancer", "Drugs & Alcohol Abuse"],
      ["Household Products", "Industrial Products", "Sewage Treatment", "Biogas Production", "Biocontrol Agents", "Biofertilisers"],
      ["Principles of Biotechnology", "Genetic Engineering Tools", "Recombinant DNA Process"],
      ["In Agriculture", "In Medicine", "Transgenic Animals", "Biosafety Issues", "Gene Therapy"],
      ["Organism & Environment", "Populations", "Population Attributes", "Population Growth", "Life History"],
      ["Ecosystem Structure & Function", "Productivity", "Decomposition", "Energy Flow", "Ecological Pyramids", "Nutrient Cycling", "Ecosystem Services"],
      ["Levels of Biodiversity", "Importance of Biodiversity", "Patterns of Biodiversity", "Loss of Biodiversity", "Conservation"],
    ],
  },
};
