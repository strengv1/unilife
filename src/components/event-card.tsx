import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EventCardProps {
  id: string
  title: string
  date: string
  time: string
  location: string
  image: string
  category: string
  isFeatured?: boolean
}

export function EventCard({ id, title, date, time, location, image, category, isFeatured = false }: EventCardProps) {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg w-full ${isFeatured ? "border-red-500 shadow-md" : ""}`}>
      <div className="relative">
        <Image
          src={image || "/placeholder.svg"}
          alt={title + ".png"}
          width={600}
          height={400}
          className="aspect-video object-cover w-full text-center"
        />
        {isFeatured && <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">Featured</Badge>}
      </div>
      <CardHeader className="p-4">
        <div className="space-y-1">
          <Badge variant="outline" className="mb-2 text-blue-900 border-blue-100">
            {category}
          </Badge>
          <h3 className="font-bold text-xl line-clamp-2">{title}</h3>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-1 h-4 w-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-4 w-4" />
          <span>{time}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          <span>{location}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/events/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
