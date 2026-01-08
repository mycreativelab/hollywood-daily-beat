import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface PodcastCardProps {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  category: string;
  episodeCount?: number;
}

export function PodcastCard({ id, title, description, coverImage, category, episodeCount = 0 }: PodcastCardProps) {
  return (
    <Link to={`/podcasts/${id}`}>
      <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-primary bg-card">
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={coverImage || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop'} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardContent className="p-4">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-secondary/20 text-secondary rounded-full mb-2 capitalize">
            {category}
          </span>
          <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {description || 'No description available'}
          </p>
          {episodeCount > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              {episodeCount} episode{episodeCount !== 1 ? 's' : ''}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
