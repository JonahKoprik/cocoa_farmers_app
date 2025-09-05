import { Role } from '@/constants/roles';
import { createContext, ReactNode, useContext, useState } from 'react';

type ProfileType = {
    name: string;
    email: string;
};

type OnboardingContextType = {
    role: Role;
    setRole: (role: Role) => void;
    location: string;
    setLocation: (location: string) => void;
    profile: ProfileType;
    setProfile: (profile: ProfileType) => void;
};

const defaultContext: OnboardingContextType = {
    role: 'Farmer',
    setRole: () => { },
    location: '',
    setLocation: () => { },
    profile: { name: '', email: '' },
    setProfile: () => { },
};

const OnboardingContext = createContext<OnboardingContextType>(defaultContext);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
    const [role, setRole] = useState<Role>('Farmer');
    const [location, setLocation] = useState('');
    const [profile, setProfile] = useState<ProfileType>({ name: '', email: '' });

    return (
        <OnboardingContext.Provider value={{ role, setRole, location, setLocation, profile, setProfile }}>
            {children}
        </OnboardingContext.Provider>
    );
};

export const useOnboardingContext = () => useContext(OnboardingContext);
