import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface BudgetCardProps {
  name: string
  totalLimit: number
  totalSpent: number
  progress: number
  description?: string
}

export function BudgetCard({ 
  name, 
  totalLimit, 
  totalSpent, 
  progress, 
  description 
}: BudgetCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm">
            <span>
              ${totalSpent.toFixed(2)} spent
            </span>
            <span className="text-muted-foreground">
              of ${totalLimit.toFixed(2)}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {progress.toFixed(1)}% used
          </div>
        </div>
      </CardContent>
    </Card>
  )
}