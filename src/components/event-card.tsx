import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EventCardProps {
  id: string
  title: string
  subtitle: string
  date: string
  time: string
  location: string
  image: string
  category: string
  urlName: string
  isFeatured?: boolean
}

export function EventCard({ title, subtitle, date, time, location, image, category, urlName, isFeatured = false }: EventCardProps) {
  return (
    <Card className={`overflow-hidden transition-all max-w-md hover:shadow-lg w-full
      ${isFeatured ? "border-red-500 shadow-md" : ""}
      ${isFeatured ? "bg-linear-to-bl from-red-100 to-white from-10% to-40%" : ""}
    `}>
      <div className="relative">
        <Link href={`/events/${urlName}`}>
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            width={600}
            height={400}
            quality={100}
            className="aspect-video object-cover w-full text-center"
          />
        </Link>
        {isFeatured && <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">Featured</Badge>}
      </div>
      <CardHeader className="px-4">
        <div className="space-y-1">
          <Badge variant="outline" className="mb-2 text-blue-900 border-blue-100">
            {category}
          </Badge>
          <h3 className="font-bold text-xl line-clamp-2">{title}</h3>
          <span className="text-muted-foreground">{subtitle}</span>
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
          <Link href={`/events/${urlName}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
