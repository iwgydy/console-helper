
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import ConsoleViewer from '@/components/ConsoleViewer';
import { useLogData } from '@/utils/api';

const Index = () => {
  const { refreshLogs, isLoading } = useLogData();

  return (
    <motion.div 
      className="min-h-screen py-8 px-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        <Header 
          title="System Console" 
          subtitle="Real-time log monitoring and analysis"
          onRefresh={refreshLogs}
          isLoading={isLoading}
        />
        
        <div className="mt-8">
          <ConsoleViewer />
        </div>
        
        <motion.footer 
          className="text-center mt-12 mb-6 text-gray-500 dark:text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p>Designed with precision and clarity.</p>
        </motion.footer>
      </div>
    </motion.div>
  );
};

export default Index;
