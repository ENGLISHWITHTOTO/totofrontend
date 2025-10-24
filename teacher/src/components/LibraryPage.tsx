import { useState } from "react"
import { Download, FileText, Image, Music, Plus, Search, Upload, Video, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useAppStore } from "../hooks/useAppStore"

export function LibraryPage() {
  const { libraryItems, setUploadFileModalOpen } = useAppStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")



  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
      case "presentation":
        return FileText
      case "image":
        return Image
      case "audio":
        return Music
      case "video":
        return Video
      default:
        return FileText
    }
  }

  const getFileColor = (type: string) => {
    switch (type) {
      case "pdf":
        return "text-red-500"
      case "presentation":
        return "text-orange-500"
      case "image":
        return "text-green-500"
      case "audio":
        return "text-purple-500"
      case "video":
        return "text-blue-500"
      default:
        return "text-gray-500"
    }
  }

  const filteredItems = libraryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === "all" || item.type === selectedFilter
    return matchesSearch && matchesFilter
  })

  const storageUsed = 156.7 // MB
  const storageLimit = 1024 // MB (1 GB)
  const storagePercentage = (storageUsed / storageLimit) * 100

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Library</h1>
        <Button onClick={() => setUploadFileModalOpen(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
        </Button>
      </div>

      {/* Storage Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Usage</CardTitle>
          <CardDescription>
            {storageUsed} MB of {storageLimit} MB used ({storagePercentage.toFixed(1)}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${storagePercentage}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {(storageLimit - storageUsed).toFixed(1)} MB remaining
          </p>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Files</SelectItem>
            <SelectItem value="pdf">PDF Documents</SelectItem>
            <SelectItem value="presentation">Presentations</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="audio">Audio Files</SelectItem>
            <SelectItem value="video">Video Files</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="grid" className="space-y-6">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => {
              const FileIcon = getFileIcon(item.type)
              return (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <FileIcon className={`w-8 h-8 ${getFileColor(item.type)}`} />
                      <Button variant="ghost" size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <h3 className="font-medium text-sm mb-2 line-clamp-2" title={item.name}>
                      {item.name}
                    </h3>
                    
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>{item.size}</span>
                        <span>{item.uploadDate}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>

                    {item.usedIn.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-muted-foreground mb-1">Used in:</p>
                        <div className="space-y-1">
                          {item.usedIn.slice(0, 2).map((lesson, index) => (
                            <p key={index} className="text-xs text-blue-600 line-clamp-1">
                              {lesson}
                            </p>
                          ))}
                          {item.usedIn.length > 2 && (
                            <p className="text-xs text-muted-foreground">
                              +{item.usedIn.length - 2} more
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <div className="space-y-2">
            {filteredItems.map((item) => {
              const FileIcon = getFileIcon(item.type)
              return (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <FileIcon className={`w-6 h-6 ${getFileColor(item.type)}`} />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{item.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{item.size}</span>
                          <span>{item.uploadDate}</span>
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                      </div>

                      <div className="hidden md:block flex-1 min-w-0">
                        {item.usedIn.length > 0 ? (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Used in:</p>
                            <p className="text-sm truncate">
                              {item.usedIn.join(", ")}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">Not used in any lessons</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No files found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Upload your first teaching materials to get started"
              }
            </p>
            <Button onClick={() => setUploadFileModalOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}