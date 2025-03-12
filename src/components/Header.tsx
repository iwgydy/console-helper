
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const Header = ({ title, subtitle, onRefresh, isLoading }: HeaderProps) => {
  return (
    <motion.div 
      className="my-8 text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="inline-block">
        <motion.div 
          className="mb-2 px-3 py-1 bg-console-accent/10 text-console-accent rounded-full text-xs font-medium inline-block"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Console Viewer
        </motion.div>
      </div>
      
      <motion.h1 
        className="text-4xl font-semibold tracking-tight mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {title}
      </motion.h1>
      
      {subtitle && (
        <motion.p 
          className="text-gray-500 dark:text-gray-400 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {subtitle}
        </motion.p>
      )}
      
      {onRefresh && (
        <motion.div 
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className={cn(
              "font-medium transition-all duration-300",
              isLoading && "opacity-70"
            )}
          >
            <RefreshCw 
              className={cn(
                "h-4 w-4 mr-2", 
                isLoading && "animate-spin"
              )} 
            />
            {isLoading ? "Refreshing..." : "Refresh Logs"}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Header;
