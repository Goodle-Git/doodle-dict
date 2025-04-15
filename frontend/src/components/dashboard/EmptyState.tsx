import { Card, CardContent } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/custom-button';
import { Brush, Gamepad } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
        <Brush className="h-16 w-16 text-muted-foreground/60" />
        <h3 className="text-xl font-semibold">No Activity Yet</h3>
        <p className="text-muted-foreground text-center max-w-sm">
          Start playing games to see your learning progress and statistics!
        </p>
        <div className="flex gap-4">
          <CustomButton onClick={() => navigate('/practice')}>
            Try Practice Mode
          </CustomButton>
          <CustomButton onClick={() => navigate('/game')} variant="primary">
            Start a Game
          </CustomButton>
        </div>
      </CardContent>
    </Card>
  );
};