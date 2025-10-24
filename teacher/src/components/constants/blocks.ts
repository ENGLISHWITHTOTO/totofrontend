import {
  Video,
  FileText,
  Image,
  Mic,
  Download,
  Target,
  MessageSquare,
  Edit,
  Copy,
  RotateCcw,
  Clock,
  Bot,
  Eye,
  AlertCircle,
} from "lucide-react";
import type { Block } from "../../hooks/useAppStore";

export const BLOCK_TYPE_INFO: Record<
  Block["type"],
  { icon: any; label: string; description: string }
> = {
  // Content blocks
  video: {
    icon: Video,
    label: "Video",
    description: "Video content with optional transcript",
  },
  text: {
    icon: FileText,
    label: "Text",
    description: "Formatted text content",
  },
  image: { icon: Image, label: "Image", description: "Images and graphics" },
  audio: { icon: Mic, label: "Audio", description: "Audio recordings" },
  attachment: {
    icon: Download,
    label: "Attachment",
    description: "Downloadable files",
  },

  // Reading & Writing
  mcq_single: {
    icon: Target,
    label: "Multiple Choice - Single Answer",
    description: "One correct answer from options",
  },
  mcq_multiple: {
    icon: Target,
    label: "Multiple Choice - Multiple Answers",
    description: "Two or more correct answers",
  },
  fill_blanks: {
    icon: Edit,
    label: "Fill in the Blanks",
    description: "Complete missing words in text",
  },
  sentence_completion: {
    icon: Edit,
    label: "Sentence Completion",
    description: "Complete sentences with given words",
  },
  matching: {
    icon: Copy,
    label: "Matching",
    description: "Match headings, info, features, endings",
  },
  summary_completion: {
    icon: FileText,
    label: "Summary Completion",
    description: "Complete short summary with missing words",
  },
  table_completion: {
    icon: FileText,
    label: "Table Completion",
    description: "Fill missing information in tables",
  },
  flowchart_completion: {
    icon: RotateCcw,
    label: "Flowchart Completion",
    description: "Complete process flowcharts",
  },
  diagram_labelling: {
    icon: Image,
    label: "Diagram Labelling",
    description: "Label parts of images or diagrams",
  },
  short_answer: {
    icon: MessageSquare,
    label: "Short Answer Questions",
    description: "Brief answers to questions",
  },
  essay_writing: {
    icon: FileText,
    label: "Essay Writing",
    description: "Structured essays with intro, body, conclusion",
  },
  letter_email_writing: {
    icon: FileText,
    label: "Letter/Email Writing",
    description: "Formal and informal correspondence",
  },
  paragraph_reordering: {
    icon: RotateCcw,
    label: "Paragraph Reordering",
    description: "Arrange paragraphs in logical sequence",
  },
  sentence_reordering: {
    icon: RotateCcw,
    label: "Sentence Reordering",
    description: "Rearrange words into correct sentences",
  },
  describe_picture: {
    icon: Image,
    label: "Describe a Picture",
    description: "Written or spoken picture descriptions",
  },
  write_sentence_given_words: {
    icon: Edit,
    label: "Write Sentence Using Given Words",
    description: "Form sentences with provided words",
  },

  // Speaking
  cue_card_speaking: {
    icon: Mic,
    label: "Cue Card Speaking (Timed)",
    description: "Timed speaking with topic points",
  },
  read_aloud: {
    icon: Mic,
    label: "Read Aloud",
    description: "Record pronunciation while reading",
  },
  listen_and_speak: {
    icon: Mic,
    label: "Listen and Speak",
    description: "Respond verbally to audio prompts",
  },
  read_and_speak: {
    icon: Mic,
    label: "Read and Speak",
    description: "Read passage then discuss or summarize",
  },
  speak_about_topic: {
    icon: Mic,
    label: "Speak About a Topic (Long-form)",
    description: "Long-form speaking without preparation",
  },
  audio_recording_response: {
    icon: Mic,
    label: "Audio Recording Response",
    description: "Open-ended audio responses",
  },
  impromptu_speech: {
    icon: Mic,
    label: "Impromptu Speech",
    description: "Instant speech on random topics",
  },
  pronunciation_correction: {
    icon: Mic,
    label: "Pronunciation Correction",
    description: "AI feedback on pronunciation",
  },
  shadowing_practice: {
    icon: Mic,
    label: "Shadowing Practice",
    description: "Repeat immediately after listening",
  },

  // Listening
  listen_and_type: {
    icon: Mic,
    label: "Listen and Type",
    description: "Dictation exercises",
  },
  listen_and_select: {
    icon: Mic,
    label: "Listen and Select",
    description: "Choose correct words from audio",
  },
  read_and_select: {
    icon: Eye,
    label: "Read and Select",
    description: "Select correct or real words/sentences",
  },
  read_and_complete: {
    icon: Edit,
    label: "Read and Complete",
    description: "Complete text based on context",
  },

  // Grammar & Vocabulary
  identify_grammar_error: {
    icon: AlertCircle,
    label: "Identify Grammar Error",
    description: "Find and optionally correct mistakes",
  },
  choose_correct_tense: {
    icon: Clock,
    label: "Choose the Correct Tense",
    description: "Select appropriate verb tense",
  },
  find_synonym: {
    icon: Copy,
    label: "Find the Synonym",
    description: "Choose synonym from options",
  },
  choose_best_title: {
    icon: FileText,
    label: "Choose the Best Title",
    description: "Select most suitable title for text",
  },
  categorization_drag_drop: {
    icon: Copy,
    label: "Categorization (Drag & Drop)",
    description: "Drag items into correct groups",
  },
  insert_sentence_paragraph: {
    icon: Edit,
    label: "Insert Sentence into Paragraph",
    description: "Place sentence in correct paragraph position",
  },
  word_family_practice: {
    icon: MessageSquare,
    label: "Word Family Practice",
    description: "Choose correct word form (noun, verb, etc.)",
  },

  // Advanced & AI
  ai_feedback_writing: {
    icon: Bot,
    label: "AI Feedback Writing Box",
    description: "Free writing with instant AI feedback",
  },
  image_based_prompt: {
    icon: Image,
    label: "Image-Based Prompt",
    description: "Write or speak based on images",
  },
  timed_task_exam: {
    icon: Clock,
    label: "Timed Task (Exam Mode)",
    description: "Any exercise with countdown timer",
  },
};
