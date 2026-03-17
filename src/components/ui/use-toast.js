import { toast } from 'sonner';

export const showToast = ({ title, description, variant = 'default' }) => {
    if (variant === 'destructive') {
        toast.error(title, {
            description: description
        });
    } else {
        toast.success(title, {
            description: description
        });
    }
};

export const useToast = () => {
    return {
        toast: showToast
    };
};
