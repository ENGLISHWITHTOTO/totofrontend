import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
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
  Zap,
  Clock,
  Bot,
  Settings,
  Eye,
  AlertCircle,
  Plus,
  X,
} from "lucide-react";
import { BLOCK_TYPE_INFO } from "../constants/blocks";
import { Block } from "../../hooks/useAppStore";
import { toast } from "sonner";

interface BlockConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockType: string;
  onSave: (block: Block) => void;
  existingBlock?: Block;
}

export function BlockConfigModal({
  isOpen,
  onClose,
  blockType,
  onSave,
  existingBlock,
}: BlockConfigModalProps) {
  const [formData, setFormData] = useState(() => {
    if (existingBlock) {
      return {
        title: existingBlock.content?.title || "",
        content: existingBlock.content?.content || "",
        url: existingBlock.content?.url || "",
        file: existingBlock.content?.file || "",
        options: existingBlock.content?.options || [""],
        correctAnswer: existingBlock.content?.correctAnswer || "",
        correctAnswers: existingBlock.content?.correctAnswers || [],
        explanation: existingBlock.content?.explanation || "",
        passage: existingBlock.content?.passage || "",
        blanks: existingBlock.content?.blanks || [""],
        matchingPairs: existingBlock.content?.matchingPairs || [
          { left: "", right: "" },
        ],
        categories: existingBlock.content?.categories || [
          { name: "", items: [""] },
        ],
        sentences: existingBlock.content?.sentences || [""],
        words: existingBlock.content?.words || [""],
        rubric: existingBlock.content?.rubric || "",
        sampleAnswer: existingBlock.content?.sampleAnswer || "",
        prompt: existingBlock.content?.prompt || "",
        imageUrl: existingBlock.content?.imageUrl || "",
        audioUrl: existingBlock.content?.audioUrl || "",
        // Config
        timer: existingBlock.config?.timer || 0,
        attempts: existingBlock.config?.attempts || 3,
        showSolution: existingBlock.config?.showSolution || true,
        aiEnabled: existingBlock.config?.aiEnabled || false,
        aiPrompt: existingBlock.config?.aiPrompt || "",
        points: existingBlock.config?.scoring?.points || 10,
        partialCredit: existingBlock.config?.scoring?.partialCredit || false,
        examMode: existingBlock.config?.examMode || false,
        recordingTime:
          existingBlock.config?.speakingConfig?.recordingTime || 60,
        preparationTime:
          existingBlock.config?.speakingConfig?.preparationTime || 30,
        playLimit: existingBlock.config?.listeningConfig?.playLimit || 3,
        autoPlay: existingBlock.config?.listeningConfig?.autoPlay || false,
      };
    }
    return {
      title: "",
      content: "",
      url: "",
      file: "",
      options: [""],
      correctAnswer: "",
      correctAnswers: [],
      explanation: "",
      passage: "",
      blanks: [""],
      matchingPairs: [{ left: "", right: "" }],
      categories: [{ name: "", items: [""] }],
      sentences: [""],
      words: [""],
      rubric: "",
      sampleAnswer: "",
      prompt: "",
      imageUrl: "",
      audioUrl: "",
      timer: 0,
      attempts: 3,
      showSolution: true,
      aiEnabled: false,
      aiPrompt: "",
      points: 10,
      partialCredit: false,
      examMode: false,
      recordingTime: 60,
      preparationTime: 30,
      playLimit: 3,
      autoPlay: false,
    };
  });

  const blockTypeInfo = BLOCK_TYPE_INFO;

  const currentBlockInfo =
    blockTypeInfo[blockType as keyof typeof blockTypeInfo];
  const isContent = ["video", "text", "image", "audio", "attachment"].includes(
    blockType
  );
  const isExercise = !isContent;
  const isSpeakingExercise = [
    "cue_card_speaking",
    "read_aloud",
    "listen_and_speak",
    "read_and_speak",
    "speak_about_topic",
    "audio_recording_response",
    "impromptu_speech",
    "pronunciation_correction",
    "shadowing_practice",
  ].includes(blockType);
  const isListeningExercise = [
    "listen_and_type",
    "listen_and_select",
    "listen_and_speak",
    "shadowing_practice",
  ].includes(blockType);
  const isWritingExercise = [
    "essay_writing",
    "letter_email_writing",
    "describe_picture",
    "ai_feedback_writing",
    "image_based_prompt",
  ].includes(blockType);
  const isMultipleChoice = ["mcq_single", "mcq_multiple"].includes(blockType);
  const isMatchingExercise = ["matching", "categorization_drag_drop"].includes(
    blockType
  );
  const isReorderingExercise = [
    "paragraph_reordering",
    "sentence_reordering",
  ].includes(blockType);
  const isFillBlanksExercise = [
    "fill_blanks",
    "sentence_completion",
    "summary_completion",
    "table_completion",
    "flowchart_completion",
  ].includes(blockType);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setFormData((prev) => ({ ...prev, options: [...prev.options, ""] }));
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 1) {
      const newOptions = formData.options.filter(
        (_: string, i: number) => i !== index
      );
      setFormData((prev) => ({ ...prev, options: newOptions }));
    }
  };

  // Helper functions for dynamic arrays
  const addBlank = () => {
    setFormData((prev) => ({ ...prev, blanks: [...prev.blanks, ""] }));
  };

  const removeBlank = (index: number) => {
    if (formData.blanks.length > 1) {
      const newBlanks = formData.blanks.filter(
        (_: string, i: number) => i !== index
      );
      setFormData((prev) => ({ ...prev, blanks: newBlanks }));
    }
  };

  const handleBlankChange = (index: number, value: string) => {
    const newBlanks = [...formData.blanks];
    newBlanks[index] = value;
    setFormData((prev) => ({ ...prev, blanks: newBlanks }));
  };

  const addMatchingPair = () => {
    setFormData((prev) => ({
      ...prev,
      matchingPairs: [...prev.matchingPairs, { left: "", right: "" }],
    }));
  };

  const removeMatchingPair = (index: number) => {
    if (formData.matchingPairs.length > 1) {
      const newPairs = formData.matchingPairs.filter(
        (_: { left: string; right: string }, i: number) => i !== index
      );
      setFormData((prev) => ({ ...prev, matchingPairs: newPairs }));
    }
  };

  const handleMatchingPairChange = (
    index: number,
    side: "left" | "right",
    value: string
  ) => {
    const newPairs = [...formData.matchingPairs];
    newPairs[index][side] = value;
    setFormData((prev) => ({ ...prev, matchingPairs: newPairs }));
  };

  const addSentence = () => {
    setFormData((prev) => ({ ...prev, sentences: [...prev.sentences, ""] }));
  };

  const removeSentence = (index: number) => {
    if (formData.sentences.length > 1) {
      const newSentences = formData.sentences.filter(
        (_: string, i: number) => i !== index
      );
      setFormData((prev) => ({ ...prev, sentences: newSentences }));
    }
  };

  const handleSentenceChange = (index: number, value: string) => {
    const newSentences = [...formData.sentences];
    newSentences[index] = value;
    setFormData((prev) => ({ ...prev, sentences: newSentences }));
  };

  const addWord = () => {
    setFormData((prev) => ({ ...prev, words: [...prev.words, ""] }));
  };

  const removeWord = (index: number) => {
    if (formData.words.length > 1) {
      const newWords = formData.words.filter(
        (_: string, i: number) => i !== index
      );
      setFormData((prev) => ({ ...prev, words: newWords }));
    }
  };

  const handleWordChange = (index: number, value: string) => {
    const newWords = [...formData.words];
    newWords[index] = value;
    setFormData((prev) => ({ ...prev, words: newWords }));
  };

  const addCategory = () => {
    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories, { name: "", items: [""] }],
    }));
  };

  const removeCategory = (index: number) => {
    if (formData.categories.length > 1) {
      const newCategories = formData.categories.filter(
        (_: { name: string; items: string[] }, i: number) => i !== index
      );
      setFormData((prev) => ({ ...prev, categories: newCategories }));
    }
  };

  const handleCategoryChange = (
    index: number,
    field: "name",
    value: string
  ) => {
    const newCategories = [...formData.categories];
    newCategories[index][field] = value;
    setFormData((prev) => ({ ...prev, categories: newCategories }));
  };

  const addCategoryItem = (categoryIndex: number) => {
    const newCategories = [...formData.categories];
    newCategories[categoryIndex].items.push("");
    setFormData((prev) => ({ ...prev, categories: newCategories }));
  };

  const removeCategoryItem = (categoryIndex: number, itemIndex: number) => {
    const newCategories = [...formData.categories];
    if (newCategories[categoryIndex].items.length > 1) {
      newCategories[categoryIndex].items = newCategories[
        categoryIndex
      ].items.filter((_: string, i: number) => i !== itemIndex);
      setFormData((prev) => ({ ...prev, categories: newCategories }));
    }
  };

  const handleCategoryItemChange = (
    categoryIndex: number,
    itemIndex: number,
    value: string
  ) => {
    const newCategories = [...formData.categories];
    newCategories[categoryIndex].items[itemIndex] = value;
    setFormData((prev) => ({ ...prev, categories: newCategories }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    const block: Block = {
      id: existingBlock?.id || `block-${Date.now()}`,
      type: blockType as any,
      content: {
        title: formData.title,
        // Content blocks
        ...(!isExercise && { content: formData.content }),
        ...(blockType === "video" && { url: formData.url }),
        ...(blockType === "image" && { url: formData.url }),
        ...(blockType === "audio" && { url: formData.url }),
        ...(blockType === "attachment" && { file: formData.file }),

        // Exercise content
        ...(isExercise && {
          ...(formData.content && { content: formData.content }),
          ...(formData.passage && { passage: formData.passage }),
          ...(formData.prompt && { prompt: formData.prompt }),
          ...(formData.imageUrl && { imageUrl: formData.imageUrl }),
          ...(formData.audioUrl && { audioUrl: formData.audioUrl }),

          // Answer configurations
          ...(formData.options.filter(Boolean).length > 0 && {
            options: formData.options.filter(Boolean),
          }),
          ...(formData.correctAnswer && {
            correctAnswer: formData.correctAnswer,
          }),
          ...(formData.correctAnswers.length > 0 && {
            correctAnswers: formData.correctAnswers,
          }),
          ...(formData.blanks.filter(Boolean).length > 0 && {
            blanks: formData.blanks.filter(Boolean),
          }),
          ...(formData.matchingPairs.filter(
            (pair: { left: string; right: string }) => pair.left && pair.right
          ).length > 0 && {
            matchingPairs: formData.matchingPairs.filter(
              (pair: { left: string; right: string }) => pair.left && pair.right
            ),
          }),
          ...(formData.categories.filter((cat: { name: string }) => cat.name)
            .length > 0 && {
            categories: formData.categories.filter(
              (cat: { name: string }) => cat.name
            ),
          }),
          ...(formData.sentences.filter(Boolean).length > 0 && {
            sentences: formData.sentences.filter(Boolean),
          }),
          ...(formData.words.filter(Boolean).length > 0 && {
            words: formData.words.filter(Boolean),
          }),

          // Optional fields
          ...(formData.explanation && { explanation: formData.explanation }),
          ...(formData.rubric && { rubric: formData.rubric }),
          ...(formData.sampleAnswer && { sampleAnswer: formData.sampleAnswer }),
        }),
      },
      config: {
        ...(formData.timer > 0 && { timer: formData.timer }),
        attempts: formData.attempts,
        showSolution: formData.showSolution,
        aiEnabled: formData.aiEnabled,
        examMode: formData.examMode,
        ...(formData.aiEnabled &&
          formData.aiPrompt && { aiPrompt: formData.aiPrompt }),

        // Speaking configuration
        ...(isSpeakingExercise && {
          speakingConfig: {
            recordingTime: formData.recordingTime,
            preparationTime: formData.preparationTime,
          },
        }),

        // Listening configuration
        ...(isListeningExercise && {
          listeningConfig: {
            playLimit: formData.playLimit,
            autoPlay: formData.autoPlay,
          },
        }),

        scoring: {
          points: formData.points,
          partialCredit: formData.partialCredit,
        },
      },
    };

    onSave(block);
    toast.success(
      `${currentBlockInfo.label} ${
        existingBlock ? "updated" : "added"
      } successfully!`
    );
    onClose();
  };

  if (!currentBlockInfo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <currentBlockInfo.icon className="w-5 h-5" />
            Configure {currentBlockInfo.label}
          </DialogTitle>
          <DialogDescription>{currentBlockInfo.description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="content" className="space-y-4">
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              {isExercise && (
                <TabsTrigger value="settings">Exercise Settings</TabsTrigger>
              )}
              <TabsTrigger value="ai">AI & Scoring</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter block title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                />
              </div>

              {isContent && (
                <>
                  {blockType === "text" && (
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        placeholder="Enter your text content..."
                        value={formData.content}
                        onChange={(e) =>
                          handleChange("content", e.target.value)
                        }
                        rows={6}
                      />
                    </div>
                  )}

                  {(blockType === "video" ||
                    blockType === "image" ||
                    blockType === "audio") && (
                    <div className="space-y-2">
                      <Label htmlFor="url">URL</Label>
                      <Input
                        id="url"
                        placeholder={`Enter ${blockType} URL`}
                        value={formData.url}
                        onChange={(e) => handleChange("url", e.target.value)}
                      />
                    </div>
                  )}

                  {blockType === "attachment" && (
                    <div className="space-y-2">
                      <Label htmlFor="file">File</Label>
                      <Input
                        id="file"
                        placeholder="Select file from library"
                        value={formData.file}
                        onChange={(e) => handleChange("file", e.target.value)}
                      />
                    </div>
                  )}
                </>
              )}

              {isExercise && (
                <>
                  {/* Multiple Choice Questions */}
                  {isMultipleChoice && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Question</Label>
                        <Textarea
                          placeholder="Enter your question..."
                          value={formData.content}
                          onChange={(e) =>
                            handleChange("content", e.target.value)
                          }
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Options</Label>
                        {formData.options.map(
                          (option: string, index: number) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                placeholder={`Option ${index + 1}`}
                                value={option}
                                onChange={(e) =>
                                  handleOptionChange(index, e.target.value)
                                }
                              />
                              {formData.options.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeOption(index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          )
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addOption}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Option
                        </Button>
                      </div>

                      {blockType === "mcq_single" ? (
                        <div className="space-y-2">
                          <Label>Correct Answer</Label>
                          <Select
                            value={formData.correctAnswer}
                            onValueChange={(value) =>
                              handleChange("correctAnswer", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select correct answer" />
                            </SelectTrigger>
                            <SelectContent>
                              {formData.options.map(
                                (option: string, index: number) =>
                                  option && (
                                    <SelectItem key={index} value={option}>
                                      {option}
                                    </SelectItem>
                                  )
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label>Correct Answers (select multiple)</Label>
                          <div className="space-y-2">
                            {formData.options.map(
                              (option: string, index: number) =>
                                option && (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-2"
                                  >
                                    <input
                                      type="checkbox"
                                      id={`correct-${index}`}
                                      checked={formData.correctAnswers.includes(
                                        option
                                      )}
                                      onChange={(e) => {
                                        const newCorrectAnswers = e.target
                                          .checked
                                          ? [...formData.correctAnswers, option]
                                          : formData.correctAnswers.filter(
                                              (a: string) => a !== option
                                            );
                                        handleChange(
                                          "correctAnswers",
                                          newCorrectAnswers
                                        );
                                      }}
                                    />
                                    <Label htmlFor={`correct-${index}`}>
                                      {option}
                                    </Label>
                                  </div>
                                )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Fill in the Blanks Types */}
                  {isFillBlanksExercise && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Passage/Text</Label>
                        <Textarea
                          placeholder="Enter passage with [blank] markers where students should fill in..."
                          value={formData.passage}
                          onChange={(e) =>
                            handleChange("passage", e.target.value)
                          }
                          rows={4}
                        />
                        <p className="text-xs text-muted-foreground">
                          Use [blank] to mark where students should fill in
                          answers
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Correct Answers for Blanks</Label>
                        {formData.blanks.map((blank: string, index: number) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder={`Answer for blank ${index + 1}`}
                              value={blank}
                              onChange={(e) =>
                                handleBlankChange(index, e.target.value)
                              }
                            />
                            {formData.blanks.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeBlank(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addBlank}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Blank Answer
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Matching Exercises */}
                  {isMatchingExercise && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Instructions</Label>
                        <Textarea
                          placeholder="Enter instructions for the matching exercise..."
                          value={formData.content}
                          onChange={(e) =>
                            handleChange("content", e.target.value)
                          }
                          rows={2}
                        />
                      </div>

                      {blockType === "matching" ? (
                        <div className="space-y-2">
                          <Label>Matching Pairs</Label>
                          {formData.matchingPairs.map(
                            (
                              pair: { left: string; right: string },
                              index: number
                            ) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  placeholder="Left item"
                                  value={pair.left}
                                  onChange={(e) =>
                                    handleMatchingPairChange(
                                      index,
                                      "left",
                                      e.target.value
                                    )
                                  }
                                />
                                <Input
                                  placeholder="Right item"
                                  value={pair.right}
                                  onChange={(e) =>
                                    handleMatchingPairChange(
                                      index,
                                      "right",
                                      e.target.value
                                    )
                                  }
                                />
                                {formData.matchingPairs.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeMatchingPair(index)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            )
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addMatchingPair}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Pair
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label>Categories</Label>
                          {formData.categories.map(
                            (
                              category: { name: string; items: string[] },
                              categoryIndex: number
                            ) => (
                              <div
                                key={categoryIndex}
                                className="border rounded p-3 space-y-2"
                              >
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Category name"
                                    value={category.name}
                                    onChange={(e) =>
                                      handleCategoryChange(
                                        categoryIndex,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                  />
                                  {formData.categories.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        removeCategory(categoryIndex)
                                      }
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                                {category.items.map(
                                  (item: string, itemIndex: number) => (
                                    <div
                                      key={itemIndex}
                                      className="flex gap-2 ml-4"
                                    >
                                      <Input
                                        placeholder="Item to categorize"
                                        value={item}
                                        onChange={(e) =>
                                          handleCategoryItemChange(
                                            categoryIndex,
                                            itemIndex,
                                            e.target.value
                                          )
                                        }
                                      />
                                      {category.items.length > 1 && (
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            removeCategoryItem(
                                              categoryIndex,
                                              itemIndex
                                            )
                                          }
                                        >
                                          <X className="w-4 h-4" />
                                        </Button>
                                      )}
                                    </div>
                                  )
                                )}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addCategoryItem(categoryIndex)}
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Item
                                </Button>
                              </div>
                            )
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addCategory}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Category
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reordering Exercises */}
                  {isReorderingExercise && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Instructions</Label>
                        <Textarea
                          placeholder="Enter instructions for reordering..."
                          value={formData.content}
                          onChange={(e) =>
                            handleChange("content", e.target.value)
                          }
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>
                          {blockType === "paragraph_reordering"
                            ? "Paragraphs"
                            : "Sentences/Words"}{" "}
                          (in correct order)
                        </Label>
                        {formData.sentences.map(
                          (sentence: string, index: number) => (
                            <div key={index} className="flex gap-2">
                              <span className="flex items-center text-sm text-muted-foreground min-w-[2rem]">
                                {index + 1}.
                              </span>
                              <Textarea
                                placeholder={
                                  blockType === "paragraph_reordering"
                                    ? "Enter paragraph..."
                                    : "Enter sentence or words..."
                                }
                                value={sentence}
                                onChange={(e) =>
                                  handleSentenceChange(index, e.target.value)
                                }
                                rows={
                                  blockType === "paragraph_reordering" ? 3 : 1
                                }
                              />
                              {formData.sentences.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeSentence(index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          )
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addSentence}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add{" "}
                          {blockType === "paragraph_reordering"
                            ? "Paragraph"
                            : "Sentence"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Writing Exercises */}
                  {isWritingExercise && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Writing Prompt</Label>
                        <Textarea
                          placeholder="Enter the writing prompt or topic..."
                          value={formData.prompt}
                          onChange={(e) =>
                            handleChange("prompt", e.target.value)
                          }
                          rows={3}
                        />
                      </div>

                      {(blockType === "describe_picture" ||
                        blockType === "image_based_prompt") && (
                        <div className="space-y-2">
                          <Label>Image URL</Label>
                          <Input
                            placeholder="Enter image URL for the prompt"
                            value={formData.imageUrl}
                            onChange={(e) =>
                              handleChange("imageUrl", e.target.value)
                            }
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Sample Answer (optional)</Label>
                        <Textarea
                          placeholder="Provide a sample answer for reference..."
                          value={formData.sampleAnswer}
                          onChange={(e) =>
                            handleChange("sampleAnswer", e.target.value)
                          }
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Scoring Rubric (optional)</Label>
                        <Textarea
                          placeholder="Define scoring criteria..."
                          value={formData.rubric}
                          onChange={(e) =>
                            handleChange("rubric", e.target.value)
                          }
                          rows={3}
                        />
                      </div>
                    </div>
                  )}

                  {/* Speaking Exercises */}
                  {isSpeakingExercise && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Speaking Prompt</Label>
                        <Textarea
                          placeholder="Enter the speaking prompt or topic..."
                          value={formData.prompt}
                          onChange={(e) =>
                            handleChange("prompt", e.target.value)
                          }
                          rows={3}
                        />
                      </div>

                      {(blockType === "read_aloud" ||
                        blockType === "read_and_speak") && (
                        <div className="space-y-2">
                          <Label>Text to Read</Label>
                          <Textarea
                            placeholder="Enter the text students should read..."
                            value={formData.passage}
                            onChange={(e) =>
                              handleChange("passage", e.target.value)
                            }
                            rows={4}
                          />
                        </div>
                      )}

                      {(blockType === "listen_and_speak" ||
                        blockType === "shadowing_practice") && (
                        <div className="space-y-2">
                          <Label>Audio URL</Label>
                          <Input
                            placeholder="Enter audio URL for listening"
                            value={formData.audioUrl}
                            onChange={(e) =>
                              handleChange("audioUrl", e.target.value)
                            }
                          />
                        </div>
                      )}

                      {blockType === "cue_card_speaking" && (
                        <div className="space-y-2">
                          <Label>Cue Card Points</Label>
                          <Textarea
                            placeholder="• Point 1&#10;• Point 2&#10;• Point 3"
                            value={formData.content}
                            onChange={(e) =>
                              handleChange("content", e.target.value)
                            }
                            rows={4}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Listening Exercises */}
                  {isListeningExercise && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Instructions</Label>
                        <Textarea
                          placeholder="Enter instructions for the listening exercise..."
                          value={formData.content}
                          onChange={(e) =>
                            handleChange("content", e.target.value)
                          }
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Audio URL</Label>
                        <Input
                          placeholder="Enter audio URL"
                          value={formData.audioUrl}
                          onChange={(e) =>
                            handleChange("audioUrl", e.target.value)
                          }
                        />
                      </div>

                      {blockType === "listen_and_select" && (
                        <div className="space-y-2">
                          <Label>Options to Select From</Label>
                          {formData.options.map(
                            (option: string, index: number) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  placeholder={`Option ${index + 1}`}
                                  value={option}
                                  onChange={(e) =>
                                    handleOptionChange(index, e.target.value)
                                  }
                                />
                                {formData.options.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeOption(index)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            )
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addOption}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Option
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Grammar & Vocabulary Exercises */}
                  {[
                    "identify_grammar_error",
                    "choose_correct_tense",
                    "find_synonym",
                    "choose_best_title",
                    "insert_sentence_paragraph",
                    "word_family_practice",
                    "read_and_select",
                    "read_and_complete",
                  ].includes(blockType) && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Question/Prompt</Label>
                        <Textarea
                          placeholder="Enter the question or prompt..."
                          value={formData.content}
                          onChange={(e) =>
                            handleChange("content", e.target.value)
                          }
                          rows={3}
                        />
                      </div>

                      {blockType === "insert_sentence_paragraph" && (
                        <div className="space-y-2">
                          <Label>Paragraph</Label>
                          <Textarea
                            placeholder="Enter the paragraph where sentence should be inserted..."
                            value={formData.passage}
                            onChange={(e) =>
                              handleChange("passage", e.target.value)
                            }
                            rows={4}
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Options</Label>
                        {formData.options.map(
                          (option: string, index: number) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                placeholder={`Option ${index + 1}`}
                                value={option}
                                onChange={(e) =>
                                  handleOptionChange(index, e.target.value)
                                }
                              />
                              {formData.options.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeOption(index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          )
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addOption}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Option
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label>Correct Answer</Label>
                        <Select
                          value={formData.correctAnswer}
                          onValueChange={(value) =>
                            handleChange("correctAnswer", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select correct answer" />
                          </SelectTrigger>
                          <SelectContent>
                            {formData.options.map(
                              (option: string, index: number) =>
                                option && (
                                  <SelectItem key={index} value={option}>
                                    {option}
                                  </SelectItem>
                                )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Short Answer */}
                  {blockType === "short_answer" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Question</Label>
                        <Textarea
                          placeholder="Enter your question..."
                          value={formData.content}
                          onChange={(e) =>
                            handleChange("content", e.target.value)
                          }
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Sample Answer</Label>
                        <Input
                          placeholder="Enter expected short answer"
                          value={formData.correctAnswer}
                          onChange={(e) =>
                            handleChange("correctAnswer", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* Write Sentence Using Given Words */}
                  {blockType === "write_sentence_given_words" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Instructions</Label>
                        <Textarea
                          placeholder="Enter instructions for the exercise..."
                          value={formData.content}
                          onChange={(e) =>
                            handleChange("content", e.target.value)
                          }
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Words to Use</Label>
                        {formData.words.map((word: string, index: number) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder={`Word ${index + 1}`}
                              value={word}
                              onChange={(e) =>
                                handleWordChange(index, e.target.value)
                              }
                            />
                            {formData.words.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeWord(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addWord}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Word
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label>Sample Sentence</Label>
                        <Input
                          placeholder="Enter a sample correct sentence using these words"
                          value={formData.sampleAnswer}
                          onChange={(e) =>
                            handleChange("sampleAnswer", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* AI Feedback Writing */}
                  {blockType === "ai_feedback_writing" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Writing Prompt</Label>
                        <Textarea
                          placeholder="Enter the topic or prompt for free writing..."
                          value={formData.prompt}
                          onChange={(e) =>
                            handleChange("prompt", e.target.value)
                          }
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Feedback Focus</Label>
                        <Textarea
                          placeholder="Specify what the AI should focus on (grammar, style, clarity, etc.)"
                          value={formData.content}
                          onChange={(e) =>
                            handleChange("content", e.target.value)
                          }
                          rows={2}
                        />
                      </div>
                    </div>
                  )}

                  {/* Explanation for all exercises */}
                  <div className="space-y-2">
                    <Label htmlFor="explanation">Explanation (optional)</Label>
                    <Textarea
                      id="explanation"
                      placeholder="Provide explanation or additional notes..."
                      value={formData.explanation}
                      onChange={(e) =>
                        handleChange("explanation", e.target.value)
                      }
                      rows={3}
                    />
                  </div>
                </>
              )}
            </TabsContent>

            {isExercise && (
              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Time & Attempts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="timer">
                        Time Limit (seconds, 0 = no limit)
                      </Label>
                      <Input
                        id="timer"
                        type="number"
                        value={formData.timer}
                        onChange={(e) =>
                          handleChange("timer", parseInt(e.target.value) || 0)
                        }
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="attempts">Maximum Attempts</Label>
                      <Input
                        id="attempts"
                        type="number"
                        value={formData.attempts}
                        onChange={(e) =>
                          handleChange(
                            "attempts",
                            parseInt(e.target.value) || 1
                          )
                        }
                        min="1"
                        max="10"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="showSolution">Show Solution</Label>
                        <p className="text-sm text-muted-foreground">
                          Show correct answer after attempts are exhausted
                        </p>
                      </div>
                      <Switch
                        id="showSolution"
                        checked={formData.showSolution}
                        onCheckedChange={(checked) =>
                          handleChange("showSolution", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="examMode">Exam Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable strict exam conditions with full-screen mode
                        </p>
                      </div>
                      <Switch
                        id="examMode"
                        checked={formData.examMode}
                        onCheckedChange={(checked) =>
                          handleChange("examMode", checked)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Speaking Configuration */}
                {isSpeakingExercise && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mic className="w-4 h-4" />
                        Speaking Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="preparationTime">
                          Preparation Time (seconds)
                        </Label>
                        <Input
                          id="preparationTime"
                          type="number"
                          value={formData.preparationTime}
                          onChange={(e) =>
                            handleChange(
                              "preparationTime",
                              parseInt(e.target.value) || 0
                            )
                          }
                          min="0"
                          max="300"
                        />
                        <p className="text-xs text-muted-foreground">
                          Time given to prepare before recording starts
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="recordingTime">
                          Recording Time (seconds)
                        </Label>
                        <Input
                          id="recordingTime"
                          type="number"
                          value={formData.recordingTime}
                          onChange={(e) =>
                            handleChange(
                              "recordingTime",
                              parseInt(e.target.value) || 60
                            )
                          }
                          min="10"
                          max="600"
                        />
                        <p className="text-xs text-muted-foreground">
                          Maximum recording duration
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Listening Configuration */}
                {isListeningExercise && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mic className="w-4 h-4" />
                        Listening Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="playLimit">Play Limit</Label>
                        <Input
                          id="playLimit"
                          type="number"
                          value={formData.playLimit}
                          onChange={(e) =>
                            handleChange(
                              "playLimit",
                              parseInt(e.target.value) || 3
                            )
                          }
                          min="1"
                          max="10"
                        />
                        <p className="text-xs text-muted-foreground">
                          Number of times audio can be played
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="autoPlay">Auto Play</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically start audio when exercise loads
                          </p>
                        </div>
                        <Switch
                          id="autoPlay"
                          checked={formData.autoPlay}
                          onCheckedChange={(checked) =>
                            handleChange("autoPlay", checked)
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            )}

            <TabsContent value="ai" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    AI Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="aiEnabled">Enable AI Evaluation</Label>
                      <p className="text-sm text-muted-foreground">
                        Use AI for automated feedback and evaluation
                      </p>
                    </div>
                    <Switch
                      id="aiEnabled"
                      checked={formData.aiEnabled}
                      onCheckedChange={(checked) =>
                        handleChange("aiEnabled", checked)
                      }
                    />
                  </div>

                  {formData.aiEnabled && (
                    <div className="space-y-2">
                      <Label htmlFor="aiPrompt">AI Evaluation Prompt</Label>
                      <Textarea
                        id="aiPrompt"
                        placeholder="Custom prompt for AI evaluation..."
                        value={formData.aiPrompt}
                        onChange={(e) =>
                          handleChange("aiPrompt", e.target.value)
                        }
                        rows={3}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Scoring
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="points">Points</Label>
                    <Input
                      id="points"
                      type="number"
                      value={formData.points}
                      onChange={(e) =>
                        handleChange("points", parseInt(e.target.value) || 0)
                      }
                      min="1"
                      max="100"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="partialCredit">Partial Credit</Label>
                      <p className="text-sm text-muted-foreground">
                        Award partial points for partially correct answers
                      </p>
                    </div>
                    <Switch
                      id="partialCredit"
                      checked={formData.partialCredit}
                      onCheckedChange={(checked) =>
                        handleChange("partialCredit", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Separator />

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {existingBlock ? "Update" : "Add"} Block
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
