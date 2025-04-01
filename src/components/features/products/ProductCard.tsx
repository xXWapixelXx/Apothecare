import { Button } from '@/components/ui/Button'
import { type Product } from '@/lib/api'

interface ProductCardProps extends Product {}

export function ProductCard({
  name,
  description,
  price,
  image,
  category,
  isNew,
  stock,
}: ProductCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background p-2 transition-all hover:shadow-lg">
      <div className="aspect-square overflow-hidden rounded-md">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{category}</span>
          {isNew && (
            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              New
            </span>
          )}
        </div>
        <h3 className="font-semibold leading-none tracking-tight">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-lg font-bold">€{price.toFixed(2)}</span>
            <p className="text-xs text-muted-foreground">
              {stock > 0 ? `${stock} in stock` : 'Out of stock'}
            </p>
          </div>
          <Button 
            size="sm" 
            className="opacity-0 transition-opacity group-hover:opacity-100"
            disabled={stock === 0}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
} 