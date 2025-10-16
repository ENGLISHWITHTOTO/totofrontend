# Nested Subcategories Implementation Guide

## Overview
The Course Builder now supports **unlimited nested subcategories** allowing teachers to create deeply structured courses with a clear hierarchy: Categories → Subcategories → Nested Subcategories (unlimited levels) → Lessons.

## Key Features Implemented

### 1. **Unlimited Nesting Depth**
- Create subcategories within subcategories with no depth limit
- Each subcategory can contain:
  - Other subcategories (nested)
  - Lessons (leaf nodes)
  - A mix of both

### 2. **Visual Hierarchy**
- **Indentation**: Each nesting level is indented by 24px for clear visual separation
- **Icons**:
  - 📁 Folder icon for collapsed subcategories
  - 📂 FolderOpen icon for expanded subcategories  
  - 📄 FileText icon for lessons
- **Badges**: Show count of nested subcategories and lessons
  - "X sub" badge for subcategories count
  - "X lessons" badge for total lessons (purple accent)

### 3. **Enhanced Navigation**

#### Breadcrumb Trail
- **Full Path Display**: Shows complete navigation path from course → subcategories → lesson
- **Clickable**: Each breadcrumb item is clickable to navigate back
- **Dynamic**: Updates automatically when selecting lessons at any nesting level

Example breadcrumb:
```
IELTS Preparation > Reading Module > Academic Reading > Matching Exercises > Lesson 1
```

#### Expand/Collapse Controls
- Click chevron icon to expand/collapse subcategories
- Click on subcategory name to also toggle expansion
- Click on lesson name to open lesson editor
- Preserves expansion state during navigation

### 4. **Quick Stats Dashboard**
When viewing course structure, displays:
- **Total Lessons**: Count across all nesting levels
- **Categories**: Total subcategories count
- **Nesting Levels**: Maximum depth of structure

### 5. **Content Management**

#### Adding Content
Multiple ways to add content to nested structures:
1. **"Add Content" button** at top (adds to root level)
2. **"Add to [category]" button** inside expanded categories
3. **Dropdown menu** on each item with "Add Content" option
4. **Modal** allows choosing between:
   - Subcategory (can contain more content)
   - Lesson (final content node)

#### Context Awareness
- Modal shows parent category name: "Add content to 'Reading Module'"
- Can add content at any level of the hierarchy
- No limit to how many items per level

### 6. **Improved UX Patterns**

#### Visual Feedback
- **Selected lesson**: Purple gradient background with border
- **Expanded category**: Purple folder icon and purple accent
- **Hover states**: Muted background on hover
- **Empty categories**: Shows "Empty category" label

#### Smart Indicators
- Shows block count for lessons (e.g., "5 blocks")
- Shows nested content count for categories (e.g., "3 sub, 12 lessons")
- Different badge colors for different content types

### 7. **Data Structure**

```typescript
interface Subcategory {
  id: string
  title: string
  type: 'subcategory' | 'lesson'
  children?: Subcategory[]  // Recursive for nesting
  lesson?: Lesson
  parentId?: string
}
```

Recursive structure allows:
- Unlimited nesting depth
- Easy traversal for path building
- Simple rendering with recursive components

## User Workflow

### Creating Nested Structure
1. Select a course
2. Click "Add Content" 
3. Choose "Subcategory" and name it (e.g., "IELTS Preparation")
4. Expand the subcategory
5. Click "Add to IELTS Preparation"
6. Add another subcategory (e.g., "Reading Module")
7. Continue nesting as needed
8. Add lessons at the final level

### Navigating Structure
1. **Browse**: Click chevrons to expand/collapse categories
2. **Edit**: Click lesson names to open lesson editor
3. **Navigate Back**: Use breadcrumbs or "Back" button
4. **Quick Add**: Use dropdown menu or "Add to" buttons

### Best Practices
- **Logical Hierarchy**: Organize by skill → topic → subtopic
- **Clear Names**: Use descriptive category names
- **Consistent Depth**: Try to keep similar content at similar depths
- **Lesson Placement**: Place lessons at the deepest relevant level

## Technical Implementation

### Recursive Rendering
```typescript
const renderStructureItem = (item: any, courseId: string, level: number) => {
  // Renders item with proper indentation
  // If has children, recursively renders them
  // Shows expansion controls and content counts
}
```

### Path Building
```typescript
const buildLessonPath = (structure, lessonId, currentPath) => {
  // Recursively searches for lesson
  // Builds path array of all parent categories
  // Returns full breadcrumb trail
}
```

### Stats Calculation
```typescript
const calculateCourseStats = (structure) => {
  // Recursively counts all lessons and subcategories
  // Calculates maximum nesting depth
  // Returns aggregate statistics
}
```

## Mobile Optimization
- Responsive indentation (scales on small screens)
- Touch-friendly tap targets (44x44px minimum)
- Scrollable structure view
- Collapsible categories save vertical space
- Full-width "Add to" buttons on mobile

## Performance Considerations
- **Lazy Loading**: Only expanded categories render children
- **Memoization**: Structure items only re-render when data changes
- **Efficient Traversal**: Path building stops when lesson found
- **Fast Loading**: Virtual scrolling for very large structures (future enhancement)

## Future Enhancements
- [ ] Drag & drop reordering within levels
- [ ] Bulk operations (move multiple items)
- [ ] Search/filter across all nesting levels
- [ ] Duplicate entire category branches
- [ ] Import/export structure templates
- [ ] Visual tree diagram view
- [ ] Keyboard navigation shortcuts
