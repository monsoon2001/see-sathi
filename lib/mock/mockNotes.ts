import type { NoteBlock } from "@/lib/types";

export const mockNotes: Record<string, NoteBlock[]> = {
  "mathematics/sets": [
    {
      id: "intro",
      order: 1,
      type: "heading",
      content: "What is a Set?",
    },
    {
      id: "intro-para",
      order: 2,
      type: "paragraph",
      content:
        "A set is a well-defined collection of distinct objects, considered as an object in its own right. The objects that make up a set are called its elements or members. In the SEE syllabus, sets form the foundation of the first Group C question and are frequently joined with survey-style word problems.",
    },
    {
      id: "definition-set",
      order: 3,
      type: "definition",
      title: "Standard Definitions",
      items: [
        "Set: a well-defined collection of distinct objects.",
        "Universal set (U): the set of all elements under consideration in a problem.",
        "Subset (A ⊆ U): every element of A is also an element of U.",
        "Empty set (∅): a set containing no elements; n(∅) = 0.",
        "Cardinality n(A): the number of elements contained in set A.",
      ],
    },
    {
      id: "formula-2set",
      order: 4,
      type: "formula",
      title: "Two-Set Cardinality Law",
      content: "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)",
      items: [
        "A ∪ B  → all elements in A or B (union)",
        "A ∩ B  → elements common to both (intersection)",
        "If A and B are disjoint, n(A ∩ B) = 0",
      ],
    },
    {
      id: "formula-3set",
      order: 5,
      type: "formula",
      title: "Three-Set Cardinality (Core SEE Group C)",
      content:
        "n(A ∪ B ∪ C) = n(A) + n(B) + n(C) − n(A ∩ B) − n(B ∩ C) − n(C ∩ A) + n(A ∩ B ∩ C)",
      items: [
        "Notice the final + n(A ∩ B ∩ C) term — a misplaced negative sign here is the single most common mark-loser.",
      ],
    },
    {
      id: "content-venn",
      order: 6,
      type: "paragraph",
      content:
        "The SEE board assigns 1.0 mark out of 4.0 exclusively for the neatness of your Venn diagram: a labelled universal rectangle U, proportionally drawn overlapping circles, and legible numeric allocations in every region.",
      caption: "Always draw the outer universal-set rectangle — it scores a dedicated mark.",
    },
    {
      id: "image-venn",
      order: 7,
      type: "image",
      title: "Three-Set Venn Diagram Schema",
      imageUrl: "",
      caption:
        "Labelled 3-set Venn diagram with the universal rectangle U and the triple-intersection region A∩B∩C highlighted.",
    },
    {
      id: "tip-1",
      order: 8,
      type: "tip",
      title: "Topper Memory Trick",
      content:
        "Read n(A ∪ B) as “plus the singles, minus the overlap”. When a survey says “15 like neither”, that number is n(A ∪ B)′, not n(A ∩ B)!",
    },
    {
      id: "warning-1",
      order: 9,
      type: "warning",
      title: "Common Pitfall",
      content:
        "For 3-set problems, students forget to subtract each pairwise intersection once and add back the triple intersection. Always re-check the sign of the n(A ∩ B ∩ C) term.",
    },
    {
      id: "example-1",
      order: 10,
      type: "example",
      title: "Worked Example — 2-Set Survey",
      content:
        "In a survey of 100 students in Pokhara, 65 like tea, 45 like coffee, and 15 like neither. How many like both tea and coffee?",
      items: [
        "n(U) = 100, n(T) = 65, n(C) = 45, n(T ∪ C)′ = 15",
        "Step 1: n(T ∪ C) = n(U) − n(T ∪ C)′ = 100 − 15 = 85",
        "Step 2: n(T ∩ C) = n(T) + n(C) − n(T ∪ C) = 65 + 45 − 85 = 25",
        "Final answer: 25 students like both tea and coffee.",
      ],
    },
    {
      id: "definition-roster",
      order: 11,
      type: "definition",
      title: "Notation Quick Reference",
      items: [
        "∈ → “is an element of”",
        "⊆ → “is a subset of”",
        "∪ → union of sets",
        "∩ → intersection of sets",
        "A′ → complement of A in U",
        "n(A) → cardinality (number of elements) of A",
      ],
    },
    {
      id: "outro",
      order: 12,
      type: "paragraph",
      content:
        "Once you can derive both the two-set and three-set cardinality laws and present a clean Venn diagram, the SEE Group C Set question becomes a guaranteed 4 marks.",
    },
  ],
  "science/electricity": [
    {
      id: "electric-current-intro",
      order: 1,
      type: "heading",
      content: "What is Electric Current?",
    },
    {
      id: "electric-current-para",
      order: 2,
      type: "paragraph",
      content:
        "Electric current is the rate of flow of electric charge through a conductor. In metallic conductors, this charge is carried by free electrons flowing from the negative to the positive terminal. Current is measured in amperes (A) and is conventionally drawn from positive to negative.",
    },
    {
      id: "definition-current",
      order: 3,
      type: "definition",
      title: "Key Physics Definitions",
      items: [
        "Electric current (I): the rate of flow of electric charge, I = Q/t, measured in amperes (A).",
        "Potential difference (V): the work done to move one coulomb of charge between two points, measured in volts (V).",
        "Resistance (R): the opposition a conductor offers to the flow of current, measured in ohms (Ω).",
        "One ampere: the current flowing when one coulomb of charge passes a point in one second.",
      ],
    },
    {
      id: "formula-ohm",
      order: 4,
      type: "formula",
      title: "Ohm's Law",
      content: "V = I × R",
      items: [
        "V = Potential Difference (Volts, V)",
        "I = Electric Current (Amperes, A)",
        "R = Electrical Resistance (Ohms, Ω)",
      ],
    },
    {
      id: "ohm-text",
      order: 5,
      type: "paragraph",
      content:
        "Ohm's law states that the electric current passing through a conductor is directly proportional to the potential difference across its ends, provided that its physical conditions (temperature, length, and area of cross-section) remain constant.",
    },
    {
      id: "definition-resistivity",
      order: 6,
      type: "definition",
      title: "Resistivity & Power",
      items: [
        "Resistance depends on length (R ∝ l), area of cross-section (R ∝ 1/A), and the material's resistivity (ρ).",
        "R = ρ · l/A",
        "Electric power: P = V × I (watts)",
        "Heat produced: H = I²Rt (joules)",
      ],
    },
    {
      id: "example-ohm",
      order: 7,
      type: "example",
      title: "Worked Example — Heater Circuit (SEE 2079, 3 Marks)",
      content: "A heater of 1000 W operates at 220 V. Calculate its resistance and the current drawn.",
      items: [
        "Current (I) = P / V = 1000 / 220 = 4.55 Amperes [1 Mark]",
        "Resistance (R) = V / I = 220 / 4.55 = 48.4 Ω [2 Marks]",
      ],
    },
    {
      id: "tip-ohm",
      order: 8,
      type: "tip",
      title: "Examiner Tip",
      content:
        "Always state the formula BEFORE substituting values. The SEE marking scheme distributes the mark between the formula line and the final value — a bare answer without the formula earns only partial credit.",
    },
    {
      id: "warning-ohm",
      order: 9,
      type: "warning",
      title: "Common Pitfall",
      content:
        "Students frequently swap numerator and denominator: using R = I/V instead of R = V/I. Use the triangle: cover the unknown in V = I × R to reveal what to divide.",
    },
    {
      id: "outro-elec",
      order: 10,
      type: "paragraph",
      content:
        "Together, Ohm's Law, the power relation P = VI, and series/parallel circuit logic cover the numerical questions asked repeatedly across 2074–2081 board papers.",
    },
  ],
};